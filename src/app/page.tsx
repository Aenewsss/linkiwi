"use client";

import { useEffect, useState, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import TemplateMinimalist from "./components/template1";
import { v4 as uuidv4 } from "uuid"
import { auth, realtimeDb } from "@/lib/firebase";
import { get, ref, update } from "firebase/database";
import { storage } from "@/lib/firebase";
import { ref as firebaseRef, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import useTemplateStore from "@/store/templateStore";
import { FaCopy } from "react-icons/fa"; // Import the copy icon
import { toast } from 'react-toastify';
import { Logout } from "@mui/icons-material";
import Image from "next/image";

const Spinner = () => (
  <div className="flex justify-center items-center fixed inset-0 bg-[#00000080] top-0 left-0 w-screen h-screen z-20 pointer-events-none">
    <Image className="animate-spin" src="/icon-linkiwi.svg" alt="Spinner" width={64} height={64} />
  </div>
);

export default function Home() {
  const { user, logout, setPlanType, planType } = useAuthStore();
  const { bannerFile, setBanner, iconFile, setIcon, pageId, setPageId, elements } = useTemplateStore();
  const router = useRouter();

  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(false); // State for loading spinner
  // 🔹 Referência para capturar o HTML gerado
  const previewRef = useRef<HTMLDivElement>(null);

  // 🔹 Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      const userPlanRef = ref(realtimeDb, `users/${auth.currentUser.uid}`);
      get(userPlanRef).then((snapshot) => {
        const planType = snapshot.val()?.planType;

        setPlanType(planType);
      })

      const userRef = ref(realtimeDb, `users/${auth.currentUser.uid}/latestPage`);
      get(userRef).then((snapshot) => {
        const pageId = snapshot.exists() ? snapshot.val() : null;

        if (!pageId) return toast.error("Não foi possível encontrar a página");

        setPageId(pageId);

        get(ref(realtimeDb, `publishedPages/${pageId}`)).then((snapshot) => {
          setViews(snapshot.val()?.views || 0);
        });
      });
    }
  }, [user, router]);

  // 🔹 Estado do template escolhido
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleFileUpload = async () => {
    if (!bannerFile && !iconFile) return;

    const userId = auth.currentUser.uid;
    const uploadTasks = [];

    if (bannerFile) {
      const storageRef = firebaseRef(storage, `banners/${userId}/${(bannerFile as File).name}`);
      const uploadTask = uploadBytesResumable(storageRef, bannerFile as File);

      const bannerUploadPromise = new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload em andamento: ${progress}%`);
          },
          (error) => {
            console.error("Erro ao enviar imagem:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setBanner(downloadURL); // Atualiza o estado com a URL da imagem
            await new Promise(resolve => setTimeout(resolve, 1000));
            resolve();
          }
        );
      });

      uploadTasks.push(bannerUploadPromise);
    }

    if (iconFile) {
      const storageRef = firebaseRef(storage, `icons/${userId}/${(iconFile as File).name}`);
      const uploadTask = uploadBytesResumable(storageRef, iconFile as File);

      const iconUploadPromise = new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload em andamento: ${progress}%`);
          },
          (error) => {
            console.error("Erro ao enviar ícone:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setIcon(downloadURL); // Atualiza o estado com a URL da imagem
            await new Promise(resolve => setTimeout(resolve, 1000));
            resolve();
          }
        );
      });

      uploadTasks.push(iconUploadPromise);
    }

    await Promise.all(uploadTasks);
    setLoading(false); // Unset loading spinner
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [publishedPageUrl, setPublishedPageUrl] = useState("");

  const publishSite = async () => {
    try {
      setLoading(true); // Set loading spinner
      if (bannerFile || iconFile) await handleFileUpload();

      setPublishing(true);

      setTimeout(() => {
        console.log('awaiting');
      }, 1000);

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

      const userRef = ref(realtimeDb, `users/${userId}`);
      const snapshot = await get(userRef);

      const pageId = snapshot.exists() ? snapshot.val()?.latestPage : uuidv4(); // Se existir, usa o mesmo UUID, senão, cria um novo

      // 📌 Salva o HTML no Firebase usando o UUID como identificador único
      await update(ref(realtimeDb, `publishedPages/${pageId}`), {
        html: htmlContent,
        userId,
        timestamp: Date.now(),
      });

      // 📌 Atualiza o UUID salvo para esse usuário
      await update(userRef, { latestPage: pageId });

      const pageUrl = `${window.location.origin}/${pageId}`;
      setPublishedPageUrl(pageUrl);
      setModalOpen(true);

    } catch (e) {
      console.error(e);
    } finally {
      setPublishing(false);
      setLoading(false); // Unset loading spinner
    }
  };
  const handleCopyUrl = async () => {
    setLoading(true); // Set loading spinner
    if (!publishedPageUrl) {
      const userRef = ref(realtimeDb, `users/${auth.currentUser.uid}/latestPage`);
      const snapshot = await get(userRef);

      const pageId = snapshot.exists() ? snapshot.val() : null

      if (!pageId) {
        toast.error("Failed to retrieve page ID.");
        setLoading(false); // Unset loading spinner
        return;
      }

      toast.success("URL copiada para a área de transferência!");
      setLoading(false); // Unset loading spinner
      return navigator.clipboard.writeText(`${window.location.origin}/${pageId}`);
    }
    navigator.clipboard.writeText(publishedPageUrl);
    toast.success("URL copiada para a área de transferência!");
    setLoading(false); // Unset loading spinner
  };

  const handleAccessPage = async () => {
    setLoading(true); // Set loading spinner
    const userRef = ref(realtimeDb, `users/${auth.currentUser.uid}/latestPage`);
    const snapshot = await get(userRef);

    const pageId = snapshot.exists() ? snapshot.val() : null

    if (!pageId) {
      toast.error("Failed to retrieve page ID.");
      setLoading(false); // Unset loading spinner
      return;
    }

    setLoading(false); // Unset loading spinner
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

  const exportSite = async () => {
    setLoading(true); // Set loading spinner
    if (!previewRef.current) {
      setLoading(false); // Unset loading spinner
      return;
    }
    console.log(bannerFile, iconFile)

    if (bannerFile || iconFile) await handleFileUpload();

    if (!bannerFile) {
      const sanitizedId = CSS.escape(`top-banner`);
      const imgElement = previewRef.current.querySelector(`#${sanitizedId}`) as HTMLImageElement;
      imgElement.src = 'https://firebasestorage.googleapis.com/v0/b/linkiwi-fecef.firebasestorage.app/o/default%2Ftop-banner-linkiwi.png?alt=media&token=0418a2d1-f7f4-4179-9dff-a916dd95cd40'
    }

    if (!iconFile) {
      const sanitizedId = CSS.escape(`top-icon`);
      const imgElement = previewRef.current.querySelector(`#${sanitizedId}`) as HTMLImageElement;
      imgElement.src = 'https://firebasestorage.googleapis.com/v0/b/linkiwi-fecef.firebasestorage.app/o/default%2Ficon-linkiwi.png?alt=media&token=02968413-c1e2-42c3-a65c-db8f0e6acb0f'
    }

    const uploadImage = async (item) => {
      const storageRef = firebaseRef(storage, `images/${auth.currentUser.uid}/${item.id}`);
      const uploadTask = uploadBytesResumable(storageRef, item.image);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });
    };

    const linkElementsWithImages = elements.filter((item) => item.type === "link" && item.image);
    for (const item of linkElementsWithImages) {
      try {
        const downloadUrl = await uploadImage(item) as string;
        const sanitizedId = CSS.escape(`${item.id}-link-image`);
        const imgElement = previewRef.current.querySelector(`#${sanitizedId}`) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = downloadUrl; // Update the src attribute of the image element in the HTML
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
        setLoading(false); // Unset loading spinner
        return;
      }
    }

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
    setLoading(false); // Unset loading spinner
  };

  if (!user) return null

  return (
    <div className="p-6 flex flex-col gap-6">
      {loading && <Spinner />} {/* Show spinner when loading */}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Bem-vindo, {user?.displayName}!</h1>
          {planType !== "free" && <span className="text-sm text-gray-500">Sua página tem {views} visitas</span>}
        </div>
        <div className="flex bg-[#5C9E31] text-white rounded-2xl p-4 w-fit items-center gap-10">
          <p className="font-medium">Clique para acessar seu
            <a href={`${window.location.origin}/${pageId}`} className="underline cursor-pointer hover:text-white/80 transition-all duration-300">
              &nbsp;Linkiwi
            </a>
          </p>
          <div onClick={handleCopyUrl} className="hover:bg-white/80 transition-all duration-300 flex items-center cursor-pointer text-black bg-white rounded-2xl p-2">
            <p className="font-medium mr-2">Copiar URL do site</p>
            <FaCopy />
          </div>
        </div>
      </div>

      {/* Escolha de Template */}
      <TemplateMinimalist ref={previewRef} />

      {/* Exportação do Site */}
      {planType === 'premium' && <div className="mt-6">
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
      </div>}

      {/* Configurações da Conta */}
      {/* <div className="mt-6">
        <h2 className="text-xl font-semibold">Configurações</h2>
        <p className="text-gray-600 text-sm">Gerencie suas informações de conta e personalizações.</p>
      </div> */}

      {/* Logout */}
      <button onClick={logout} className="mt-6 px-6 py-3 bg-red-600 text-white rounded-md cursor-pointer flex self-end gap-4">
        Sair
        <Logout />
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}