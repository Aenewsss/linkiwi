import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Crie sua Página de Links em Minutos!</h1>
      <p className="text-gray-600 mt-2">Arraste, solte e personalize sua página facilmente.</p>

      <Link href="/dashboard">
        <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md">Comece Agora</button>
      </Link>
    </div>
  );
}