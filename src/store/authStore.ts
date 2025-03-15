import { create } from "zustand";
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

// 🔹 Definindo o tipo do estado
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  planType: string | null;
  setPlanType: (planType: string | null) => void;
}

// 🔹 Criando o Zustand Store com tipagem
const useAuthStore = create<AuthState>((set) => ({
  user: null,

  // Atualiza o usuário no Zustand
  setUser: (user) => set({ user }),

  // 🔹 Login com Google
  login: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      set({ user: result.user });
    } catch (error) {
      console.error("Erro ao fazer login:", (error as Error).message);
    }
  },

  // 🔹 Logout do usuário
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  planType: null,
  setPlanType: (planType) => set({ planType }),
}));

// 🔹 Monitora o estado da autenticação no Firebase
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});

export default useAuthStore;