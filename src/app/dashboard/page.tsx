"use client";

import { useEffect, useState, useRef } from "react";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import TemplateMinimalist from "../components/template1";
import TemplateModern from "../components/template2";
import { v4 as uuidv4 } from "uuid"
import { auth, realtimeDb } from "@/lib/firebase";
import { get, ref, set } from "firebase/database";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
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
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const publishSite = async () => {
    console.log(auth.currentUser)
    if (!previewRef.current || !auth?.currentUser?.uid) return;

    setPublishing(true);

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

    const userId = auth.currentUser.uid

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

    alert(`Site publicado - Id do site: ${pageId}`)
  }

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Bem-vindo, {user?.displayName}!</h1>

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
    </div>
  );
}