"use client";

import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
export default function Login() {
  const { login, user } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div className="flex h-screen relative">
      <Image
        src="/woman.png"
        alt="Woman"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10"
        unoptimized
        width={287}
        height={400}
      />
      <div className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center relative p-10">
        <div className="text-white text-center z-10">
          <h1 className="text-6xl font-bold mb-4 text-start">Conecte-se ao Futuro da Sua Presença Online! </h1>
          <p className="mb-4 text-start">
            Bem-vindo ao Linkiwi – a plataforma que transforma seu<br />
            link único em um hub completo para seus conteúdos, negócios e redes sociais.
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <img src="/logo-linkiwi-horizontal.svg" alt="LinKiwi Logo" className="mb-4" />
        <button
          onClick={login}
          className="px-6 py-3 bg-black text-white rounded-md hover:scale-105 w-64 cursor-pointer transition-all duration-300 hover:bg-gray-800 flex items-center justify-center"
        >
          <img src="/google.png" alt="Google Logo" className="w-6 h-6 mr-2" />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}