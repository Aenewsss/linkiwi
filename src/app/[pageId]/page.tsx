"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ref, get, update } from "firebase/database";
import { realtimeDb } from "@/lib/firebase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PublicPage({ params }: any) {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(realtimeDb, `publishedPages/${params.pageId}`);
        const snapshot = await get(dbRef);

        if (snapshot.exists()) {
          setHtmlContent(snapshot.val().html);

          await update(dbRef, {
            views: (snapshot.val()?.views || 0) + 1,
          });
        } else {
          router.push("/404"); // Redireciona para a página 404 se não encontrar
        }
      } catch (error) {
        console.error("Erro ao buscar a página:", error);
        router.push("/404"); // Redireciona em caso de erro
      }
    };

    fetchData();
  }, [params.pageId, router]);

  if (htmlContent === null) return <p className="text-center p-10">Carregando...</p>;

  return <div className="h-screen w-screen" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}