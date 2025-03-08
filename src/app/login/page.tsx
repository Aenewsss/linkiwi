"use client";

import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { login, user } = useAuthStore();

  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Faça Login</h1>
      <button
        onClick={login}
        className="px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer"
      >
        Login com Google
      </button>
    </div>
  );
}