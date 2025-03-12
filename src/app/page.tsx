"use client";

import { useEffect, useState, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import TemplateMinimalist from "./components/template1";
import { v4 as uuidv4 } from "uuid"
import { auth, realtimeDb } from "@/lib/firebase";
import { get, ref, set } from "firebase/database";
import { storage } from "@/lib/firebase";
import { ref as firebaseRef, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import useTemplateStore from "@/store/templateStore";
import { FaCopy, FaExternalLinkAlt } from "react-icons/fa"; // Import the copy icon
import { toast } from 'react-toastify';

export default function Home() {
  const { user, logout } = useAuthStore();
  const { bannerFile, setBanner } = useTemplateStore();
  const router = useRouter();


  // 🔹 Referência para capturar o HTML gerado
  const previewRef = useRef<HTMLDivElement>(null);

  // 🔹 Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // 🔹 Estado do template escolhido
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleFileUpload = async () => {
    if (!bannerFile) return;

    const userId = auth.currentUser.uid

    const storageRef = firebaseRef(storage, `banners/${userId}/${(bannerFile as File).name}`);
    const uploadTask = uploadBytesResumable(storageRef, bannerFile as File);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload em andamento: ${progress}%`);
      },
      (error) => {
        console.error("Erro ao enviar imagem:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setBanner(downloadURL); // Atualiza o estado com a URL da imagem
      }
    );
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [publishedPageUrl, setPublishedPageUrl] = useState("");

  const publishSite = async () => {
    try {
      if (bannerFile) handleFileUpload();

      setPublishing(true);

      setTimeout(() => {
        console.log('awaiting');
      }, 1000);

      console.log(auth.currentUser);
      if (!previewRef.current || !auth?.currentUser?.uid) return;

      // 🔹 Captura SOMENTE o HTML do preview
      const htmlContent = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Site Personalizado</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex items-center justify-center h-screen">
    ${previewRef.current.innerHTML} 
</body>
</html>`;

      const userId = auth.currentUser.uid;

      const userRef = ref(realtimeDb, `users/${userId}/latestPage`);
      const snapshot = await get(userRef);

      const pageId = snapshot.exists() ? snapshot.val() : uuidv4(); // Se existir, usa o mesmo UUID, senão, cria um novo

      // 📌 Salva o HTML no Firebase usando o UUID como identificador único
      await set(ref(realtimeDb, `publishedPages/${pageId}`), {
        html: htmlContent,
        userId,
        timestamp: Date.now(),
      });

      // 📌 Atualiza o UUID salvo para esse usuário
      await set(userRef, pageId);

      const pageUrl = `${window.location.origin}/${pageId}`;
      setPublishedPageUrl(pageUrl);
      setModalOpen(true);

    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!publishedPageUrl) {
      const userRef = ref(realtimeDb, `users/${auth.currentUser.uid}/latestPage`);
      const snapshot = await get(userRef);

      const pageId = snapshot.exists() ? snapshot.val() : null

      if (!pageId) {
        toast.error("Failed to retrieve page ID.");
        return;
      }

      toast.success("URL copiada para a área de transferência!");
      return navigator.clipboard.writeText(`${window.location.origin}/${pageId}`);
    }
    navigator.clipboard.writeText(publishedPageUrl);
    toast.success("URL copiada para a área de transferência!");
  };

  const handleAccessPage = async () => {
    const userRef = ref(realtimeDb, `users/${auth.currentUser.uid}/latestPage`);
    const snapshot = await get(userRef);

    const pageId = snapshot.exists() ? snapshot.val() : null

    if (!pageId) {
      toast.error("Failed to retrieve page ID.");
      return;
    }

    return window.open(`${window.location.origin}/${pageId}`, "_blank");
  };

  const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">Site Publicado!</h2>
          <p className="mb-4">URL do site: {publishedPageUrl}</p>
          <button onClick={handleCopyUrl} className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
            Copiar URL
          </button>
          <button onClick={handleAccessPage} className="mr-2 bg-green-500 text-white px-4 py-2 rounded">
            Acessar
          </button>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  const exportSite = () => {
    if (!previewRef.current) return;

    setExporting(true);

    // 🔹 Captura SOMENTE o HTML do preview
    const htmlContent = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Site Personalizado</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex items-center justify-center h-screen">
    ${previewRef.current.innerHTML} 
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });

    // Criar um link para download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "meu_site.html";

    // Simular clique para baixar
    document.body.appendChild(link);
    link.click();

    // Limpar referência do link
    document.body.removeChild(link);
    setExporting(false);
  };

  if (!user) return null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bem-vindo, {user?.displayName}!</h1>
      <div className="flex items-center mt-2">
        <p className="font-medium mr-2">Copiar URL do site</p>
        <FaCopy onClick={handleCopyUrl} className="text-green-900 cursor-pointer" />
      </div>
      <div className="flex items-center mt-2">
        <p className="font-medium mr-2">Abrir site</p>
        <FaExternalLinkAlt onClick={handleAccessPage} className="text-green-900 cursor-pointer" />
      </div>

      {/* Escolha de Template */}
      <div className="p-6">
        <TemplateMinimalist ref={previewRef} />
      </div>

      {/* Exportação do Site */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Exportar/Publicar do Site</h2>
        <div className="flex gap-4">
          <button
            onClick={exportSite}
            disabled={exporting}
            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-md cursor-pointer"
          >
            {exporting ? "Exportando..." : "Exportar Site"}
          </button>
          <button
            onClick={publishSite}
            disabled={publishing}
            className="mt-4 px-6 py-3 bg-amber-600 text-white rounded-md cursor-pointer"
          >
            {publishing ? "Publicando..." : "Publicar Site"}
          </button>
        </div>
      </div>

      {/* Configurações da Conta */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Configurações</h2>
        <p className="text-gray-600 text-sm">Gerencie suas informações de conta e personalizações.</p>
      </div>

      {/* Logout */}
      <button onClick={logout} className="mt-6 px-6 py-3 bg-red-600 text-white rounded-md cursor-pointer">
        Logout
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}