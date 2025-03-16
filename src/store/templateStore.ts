import { create } from "zustand";
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { IElement } from "@/app/components/template1";

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
  pageId: string; // 🔹 Estado para armazenar o ID da página
  setPageId: (pageId: string) => void; // 🔹 Função para atualizar o ID da página
  elements: IElement[]; // 🔹 Estado para armazenar os elementos
  setElements: (elements: IElement[]) => void; // 🔹 Função para atualizar os elementos
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

  pageId: '',
  setPageId: (pageId) => set({ pageId }),

  elements: [
    { id: "4", type: "tracking", pixel: "" },
    { id: "3", type: "link", text: "Meu Instagram", url: "https://instagram.com", bgColor: "#FFFFFF", textColor: "#00000", border: '#e2e8f0', icon: true, iconBackgroundColor: '#BEF264' },
    { id: "2", type: "link", text: "Meu LinkedIn", url: "https://linkedin.com", bgColor: "#FFFFFF", textColor: "#00000", border: '#e2e8f0', icon: true, iconBackgroundColor: '#BEF264' },
    { id: "1", type: "text", content: "Bem-vindo à minha página personalizada!", textSize: "text-2xl", textColor: "#000000", bold: true, align: "text-left" },
  ],
  setElements: (elements) => set({ elements }),
}));

// 🔹 Monitora o estado da autenticação no Firebase
onAuthStateChanged(auth, (user) => {
  useTemplateStore.getState().setUser(user);
});

export default useTemplateStore;