import { realtimeDb } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { notFound } from "next/navigation";

export default async function PublicPage({ params }: { params: { pageId: string } }) {
  const dbRef = ref(realtimeDb, `publishedPages/${params.pageId}`);
  const snapshot = await get(dbRef);

  if (!snapshot.exists()) return notFound(); // Retorna 404 se não encontrar a página

  const userHtml = snapshot.val().html;

  return (
    <div className="h-screen w-screen" dangerouslySetInnerHTML={{ __html: userHtml }} />
  );
}