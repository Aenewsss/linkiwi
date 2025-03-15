import { create } from "zustand";
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

// 🔹 Definindo o tipo do estado
interface TemplateState {
  user: User | null;
  banner: string; // 🔹 Estado para armazenar a imagem do banner
  bannerFile?: string | File; // 🔹 Estado para armazenar a imagem do banner
  setUser: (user: User | null) => void;
  setBanner: (banner: string) => void; // 🔹 Função para atualizar o banner
  setBannerFile: (bannerFile: string | File) => void; // 🔹 Função para atualizar o banner
  login: () => Promise<void>;
  logout: () => Promise<void>;
  icon: string; // 🔹 Estado para armazenar o ícone
  iconFile?: string | File; // 🔹 Estado para armazenar o ícone
  setIcon: (icon: string) => void; // 🔹 Função para atualizar o ícone
  setIconFile: (iconFile: string | File) => void; // 🔹 Função para atualizar o ícone
}

// 🔹 Criando o Zustand Store
const useTemplateStore = create<TemplateState>((set) => ({
  user: null,
  banner: '/top-banner-linkiwi.png', // 🔹 Inicialmente vazio
  bannerFile: '',

  // Atualiza o usuário no Zustand
  setUser: (user) => set({ user }),

  // Atualiza a imagem do banner
  setBanner: (banner) => set({ banner }),

  // Atualiza a imagem do banner
  setBannerFile: (bannerFile) => set({ bannerFile }),

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
  icon: '/icon-linkiwi.svg',
  iconFile: null,
  setIcon: (icon) => set({ icon }),
  setIconFile: (iconFile) => set({ iconFile }),
}));

// 🔹 Monitora o estado da autenticação no Firebase
onAuthStateChanged(auth, (user) => {
  useTemplateStore.getState().setUser(user);
});

export default useTemplateStore;