"use client";
import { ForwardedRef, forwardRef, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./sortableItem";
import { AddOutlined, DeleteOutlined, FormatAlignCenterOutlined, FormatAlignLeftOutlined, FormatAlignRightOutlined, FormatBoldOutlined, GitHub, Instagram, LinkedIn, Public, Link as LinkIcon, ArrowRightAltRounded, } from "@mui/icons-material"
import Image from "next/image";
import { socialLinks } from "../../constant/social-links.const";
import useTemplateStore from "@/store/templateStore";
import useAuthStore from "@/store/authStore";
import { toast } from "react-toastify";

export interface IElement {
  id: string
  type: 'link' | 'image' | 'text' | "tracking"
  text?: string
  url?: string
  bgColor?: string
  textColor?: string
  src?: string
  content?: string
  alt?: string
  textSize?: string
  bold?: boolean
  align?: string
  icon?: boolean
  iconBackgroundColor?: string
  iconColor?: string
  pixel?: string
  border?: string
  image?: File
}

export const iconOptions = { Instagram, LinkedIn, GitHub, Link: LinkIcon, Public }; // Lista de ícones disponíveis

const TemplateMinimalist = forwardRef(({ publishSite, publishing }: { publishSite: () => void, publishing: boolean }, ref: ForwardedRef<HTMLDivElement>) => {

  const { planType } = useAuthStore();
  const { banner, setBanner, setBannerFile, icon, setIcon, setIconFile, elements, setElements } = useTemplateStore()

  const [pageBackgroundColor, setPageBackgroundColor] = useState("#F3FDC4"); // 🔹 Estado para cor do fundo da página

  const [title, setTitle] = useState('Linkiwi');
  const [titleColor, setTitleColor] = useState('black');

  const [subtitle, setSubtitle] = useState('Sua página de links profissional em minutos de maneira simples e prática! ');
  const [subtitleColor, setSubtitleColor] = useState('black');

  const [topLinksBackground, setTopLinksBackground] = useState('#5C9E31');
  const [topLinksColor, setTopLinksColor] = useState('white');

  const [socialIcons, setSocialIcons] = useState([
    { icon: 'facebook', 'link': 'https://facebook.com', backgroundColor: topLinksBackground, color: topLinksColor },
    { icon: 'instagram', 'link': 'https://instagram.com', backgroundColor: topLinksBackground, color: topLinksColor },
    { icon: 'whatsapp', 'link': 'https://whatsapp.com', backgroundColor: topLinksBackground, color: topLinksColor },
    { icon: 'telegram', 'link': 'https://telegram.com', backgroundColor: topLinksBackground, color: topLinksColor },
  ]);

  const textSizes = [{ value: "text-sm", label: 'Pequeno' }, { value: "text-md", label: 'Médio' }, { value: "text-lg", label: 'Grande' }, { value: "text-xl", label: 'Muito Grande' }, { value: "text-2xl", label: 'Maior ainda' }, { value: "text-3xl", label: 'Super Grande' }];
  const textAlignments = ["text-left", "text-center", "text-right"];

  const [showModal, setShowModal] = useState(false);
  const [elementToRemove, setElementToRemove] = useState<string | null>(null);

  const [highlightNewElement, setHighlightNewElement] = useState(false);

  // 🔹 Atualiza os elementos ao arrastar
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = elements.findIndex((item) => item.id === active.id);
      const newIndex = elements.findIndex((item) => item.id === over.id);
      setElements(arrayMove(elements, oldIndex, newIndex));
    }
  };

  // 🔹 Atualiza os valores editados
  const updateElement = (id: string, field: string, value: string | boolean | File) => {
    setElements(elements.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // 🔹 Adiciona um novo elemento (link, imagem ou texto)
  const addNewElement = (type: "link" | "image" | "text" | "tracking") => {

    if (planType === "free" && elements.length >= 5) {
      toast.error("Você não tem permissão para adicionar mais elementos. Atualize seu plano para desbloquear recursos.")
      setTimeout(() => {
        window.open(process.env.NEXT_PUBLIC_CHOOSE_PLAN, "_blank");
      }, 2000);
      return;
    } else if (planType === "basic" && elements.length >= 16) {
      toast.error("Você não tem permissão para adicionar mais elementos. Atualize seu plano para desbloquear recursos.")
      setTimeout(() => {
        window.open(process.env.NEXT_PUBLIC_CHOOSE_PLAN, "_blank");
      }, 2000);
      return;
    }

    const newId = String(elements.length + 1);

    setHighlightNewElement(true)
    
    if (type === "link") {
      setElements([
        ...elements,
        { id: newId, type: "link", text: "Novo Link", url: "#", bgColor: "#2563eb", textColor: "#ffffff", icon: false, iconBackgroundColor: '#BEF264', iconColor: '#292D32', border: '#E2E8F0' },
      ]);
    } else if (type === "image") {
      setElements([
        ...elements,
        { id: newId, type: "image", src: "", alt: "Nova Imagem" },
      ]);
    } else if (type === "text") {
      setElements([
        ...elements,
        { id: newId, type: "text", content: "Novo Texto" },
      ]);
    } else if (type === "tracking") {
      setElements([
        ...elements,
        { id: newId, type, pixel: "", }
      ]);
    }

    toast.success('Elemento adicionado!')

    setTimeout(() => {
      setHighlightNewElement(false)
    }, 3000);
  };

  // 🔹 Remove um elemento
  const removeElement = (id: string) => {
    setElements(elements.filter((item) => item.id !== id));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setBannerFile(file)

    const fileURL = URL.createObjectURL(file); // Cria um link temporário para visualizar a imagem
    setBanner(fileURL);
  };

  const handleIconChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIconFile(file)

    const fileURL = URL.createObjectURL(file); // Cria um link temporário para visualizar a imagem
    setIcon(fileURL);
  };

  const confirmRemoveElement = (id: string) => {
    setElementToRemove(id);
    setShowModal(true);
  };

  const handleConfirmRemove = () => {
    if (elementToRemove) {
      removeElement(elementToRemove);
      setElementToRemove(null);
      setShowModal(false);
    }
  };

  const handleCancelRemove = () => {
    setElementToRemove(null);
    setShowModal(false);
  };

  return (
    <div className="flex border-2 border-gray-200">
      {/* 🎨 Painel de edição (lado esquerdo) */}
      <div className="w-3/4 relative p-10 flex flex-col gap-4">
        {/* <header className="text-center mb-6">
          <h1 className="text-3xl font-bold">Editor de Links</h1>
          <p className="text-gray-600">Personalize seus links facilmente</p>
        </header> */}

        <h2 className="text-gray-600 text-2xl font-semibold">Topo</h2>
        <div className="flex flex-col items-center border-2 border-gray-200 p-4 bg-[rgb(242,242,242)] rounded-lg shadow-md gap-16">

          <div className="flex gap-4 justify-start w-full">
            {/* 🔹 Seletor do banner */}
            <div className="flex flex-col items-center bg-white w-64  min-h-56 rounded-lg shadow-md shadow-gray-500">
              <Image className="w-full object-contain h-48 rounded-t-lg " src={banner} alt="Banner" width={100} height={100} />
              <label className="px-4 py-2 bg-[#5C9E31] text-white rounded-b-lg cursor-pointer w-full">
                Selecionar Imagem do Banner
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            {/* 🔹 Seletor do ícone */}
            <div className="flex flex-col items-center  min-h-56 bg-white w-64 rounded-lg shadow-md shadow-gray-500">
              <Image className="w-full object-contain rounded-t-lg h-48" src={icon} alt="Ícone" width={100} height={100 } />
              <label className="px-4 py-2 bg-[#5C9E31] text-white rounded-b-lg cursor-pointer w-full">
                Selecionar Ícone
                <input type="file" accept="image/*" className="hidden" onChange={handleIconChange} />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {/* 🔹 Seletor do título */}
            <div className=" flex flex-col gap-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-gray-600 text-xl font-semibold">Título</span>
                <div className="flex gap-1">

                  <label className="text-sm text-gray-600" htmlFor="">Cor</label>
                  <div className="flex gap-4 w-full items-center">
                    {/* 🔹 Seletor de cor do texto */}
                    <label style={{ backgroundColor: titleColor }} className="w-5 h-5 rounded-full shadow-md border-gray-300">
                      <input
                        type="color"
                        value={titleColor}
                        onChange={(e) => setTitleColor(e.target.value)}
                        className="border-none cursor-pointer outline-none opacity-0"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
              />

            </div>

            {/* 🔹 Seletor do subtítulo */}
            <div className=" flex flex-col gap-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-gray-600 text-xl font-semibold">Subtítulo</span>
                <div className="flex gap-1 items-center">
                  <label className="text-sm text-gray-600" htmlFor="">Cor</label>
                  <div className="flex gap-4 w-full items-center">
                    {/* 🔹 Seletor de cor do texto */}
                    <label style={{ backgroundColor: subtitleColor }} className="w-5 h-5 rounded-full shadow-md border-gray-300">
                      <input
                        type="color"
                        value={subtitleColor}
                        onChange={(e) => setSubtitleColor(e.target.value)}
                        className="border-none cursor-pointer outline-none opacity-0"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          {/* 🔹 Seletor de links do topo */}
          <div className="flex flex-col  ">
            <div className="flex items-center justify-between w-full">
              <span className="text-gray-600 text-xl font-semibold">Links topo</span>
              <div className="flex gap-10">
                <div className="flex gap-1 items-center">
                  <label className="text-sm text-gray-600" htmlFor="">Cor de fundo</label>
                  <div className="flex gap-4 items-center">
                    {/* 🔹 Seletor de cor do texto */}
                    <label style={{ backgroundColor: topLinksBackground }} className="w-5 h-5 rounded-full shadow-md border-gray-300">
                      <input
                        type="color"
                        value={topLinksBackground}
                        onChange={(e) => setTopLinksBackground(e.target.value)}
                        className="w-1 border-none cursor-pointer outline-none opacity-0"
                      />
                    </label>
                  </div>
                </div>
                <div className="flex">
                  <label className="text-sm text-gray-600" htmlFor="">Cor dos links</label>
                  <div className="flex gap-4 items-center">
                    {/* 🔹 Seletor de cor do texto */}
                    <label style={{ backgroundColor: topLinksColor }} className="w-5 h-5 rounded-full shadow-md border-gray-300">
                      <input
                        type="color"
                        value={topLinksColor}
                        onChange={(e) => setTopLinksColor(e.target.value)}
                        className="w-1 border-none cursor-pointer outline-none opacity-0"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* onChange={(e) => {
              const exists = socialIcons.find(el => el.icon == e.target.value)
              setSocialIcons()
            }} */}
            <div className="flex gap-10 flex-wrap mt-4">
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'facebook'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="facebook" /> <label htmlFor="">facebook</label>
                {Boolean(socialIcons.find(el => el.icon == 'facebook')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'facebook' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'facebook')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'instagram'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="instagram" /> <label htmlFor="">instagram</label>
                {Boolean(socialIcons.find(el => el.icon == 'instagram')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'instagram' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'instagram')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'whatsapp'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="whatsapp" /> <label htmlFor="">whatsapp</label>
                {Boolean(socialIcons.find(el => el.icon == 'whatsapp')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'whatsapp' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'whatsapp')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'telegram'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="telegram" /> <label htmlFor="">telegram</label>
                {Boolean(socialIcons.find(el => el.icon == 'telegram')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'telegram' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'telegram')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'tiktok'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="tiktok" /> <label htmlFor="">tiktok</label>
                {Boolean(socialIcons.find(el => el.icon == 'tiktok')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'tiktok' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'tiktok')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'youtube'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="youtube" /> <label htmlFor="">youtube</label>
                {Boolean(socialIcons.find(el => el.icon == 'youtube')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'youtube' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'youtube')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'twitter'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="twitter" /> <label htmlFor="">twitter</label>
                {Boolean(socialIcons.find(el => el.icon == 'twitter')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'twitter' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'twitter')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'linkedin'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="linkedin" /> <label htmlFor="">linkedin</label>
                {Boolean(socialIcons.find(el => el.icon == 'linkedin')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'linkedin' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'linkedin')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'amazon'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="amazon" /> <label htmlFor="">amazon</label>
                {Boolean(socialIcons.find(el => el.icon == 'amazon')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'amazon' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'amazon')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'shopee'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="shopee" /> <label htmlFor="">shopee</label>
                {Boolean(socialIcons.find(el => el.icon == 'shopee')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'shopee' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'shopee')?.link} />}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  checked={Boolean(socialIcons.find(el => el.icon == 'aliexpress'))}
                  onChange={e => setSocialIcons(
                    e.target.checked
                      ? socialIcons.concat([{ icon: e.target.value, backgroundColor: '#5C9E31', color: 'white', link: '' }])
                      : socialIcons.filter(socialIc => socialIc.icon != e.target.value))

                  } type="checkbox" value="aliexpress" /> <label htmlFor="">aliexpress</label>
                {Boolean(socialIcons.find(el => el.icon == 'aliexpress')) && <input className="w-full px-2 py-1 border border-gray-300 rounded-md" type="text"
                  onChange={e => setSocialIcons(socialIcons.map(el => {
                    return el.icon == 'aliexpress' ? { ...el, link: e.target.value } : el
                  }))}
                  value={socialIcons.find(el => el.icon == 'aliexpress')?.link} />}
              </div>
            </div>

          </div>
        </div>

        {/* 🔹 Botões para adicionar elementos */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => addNewElement('link')}
            className="mt-6 px-6 py-3 bg-[#5C9E31] text-white rounded-md  cursor-pointer"
          >
            <AddOutlined /> Adicionar Link
          </button>
          <button
            onClick={() => addNewElement('text')}
            className="mt-6 px-6 py-3 bg-[#5C9E31] text-white rounded-md  cursor-pointer"
          >
            <AddOutlined /> Adicionar Texto
          </button>
          {planType === 'premium' && <button
            onClick={() => addNewElement("tracking")}
            className="mt-6 px-6 py-3 bg-[#5C9E31] text-white rounded-md cursor-pointer"
          >
            <AddOutlined /> Adicionar Pixel/Tag
          </button>}
          {/* <button
              onClick={() => addNewElement('image')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md  cursor-pointer"
            >
              <AddOutlined /> Adicionar Imagem
            </button> */}
        </div>

        <h2 className="text-gray-600 text-2xl font-semibold mt-10">Elementos da página</h2>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={elements} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4">
              {[...elements].reverse().map((item, index) => (
                <SortableItem highlighted={highlightNewElement && index == 0} key={item.id} id={item.id}>
                  {item.type === "link" && (
                    <div className="flex flex-col gap-4 py-4">

                      <div className="flex gap-4 self-end">
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md w-fit">
                          <span className="text-sm ">Cor de Fundo</span>
                          <label style={{ backgroundColor: item.bgColor }} className="cursor-pointer rounded-full h-8 w-8 shadow-md border-gray-300 border">
                            <input
                              type="color"
                              value={item.bgColor}
                              onChange={(e) => updateElement(item.id, "bgColor", e.target.value)}
                              className="w-12 h-12 rounded-md border-none cursor-pointer outline-none opacity-0"
                            />
                          </label>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md w-fit">
                          <span className="text-sm ">Cor do Texto</span>
                          <label style={{ backgroundColor: item.textColor }} className="cursor-pointer rounded-full h-8 w-8 shadow-md border-gray-300 border">
                            <input
                              type="color"
                              value={item.textColor}
                              onChange={(e) => updateElement(item.id, "textColor", e.target.value)}
                              className="w-12 h-12 rounded-md border-none cursor-pointer outline-none opacity-0"
                            />
                          </label>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md w-fit">
                          <span className="text-sm ">Cor da Borda</span>
                          <label style={{ backgroundColor: item.border }} className="cursor-pointer rounded-full h-8 w-8 shadow-md border-gray-300 border">
                            <input
                              type="color"
                              value={item.border}
                              onChange={(e) => updateElement(item.id, "border", e.target.value)}
                              className="w-12 h-12 rounded-md border-none cursor-pointer outline-none opacity-0"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-md text-gray-600">Imagem</label>
                        <label htmlFor={`file-input-${item.id}`} className="w-full px-2 py-1 border border-gray-300 rounded-md cursor-pointer text-gray-500">
                          Escolha uma imagem
                        </label>
                        <input
                          id={`file-input-${item.id}`}
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 50 * 1024 * 1024) {
                                toast.error("O arquivo deve ser menor que 2MB.");
                                return;
                              }
                              updateElement(item.id, "image", file);
                            }
                          }}
                          className="hidden"
                        />
                        {item.image && (
                          <Image
                            src={URL.createObjectURL(item.image)}
                            alt="Preview"
                            className="object-contain"
                            width={100}
                            height={100}
                          />
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-md text-gray-600">Texto</label>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => updateElement(item.id, "text", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-md text-gray-600">URL</label>
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => updateElement(item.id, "url", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md mt-1"
                        />
                      </div>

                      {/* 🔹 Seletor de Ícone */}
                      <div className="mt-2">
                        <div className="flex gap-5 align-items-center">
                          <span className="text-md text-gray-600">Ícone</span>
                          {item.icon && <div className="flex items-center gap-4">
                            <label className="flex gap-1 items-center">
                              <span className="text-xs text-gray-600">Cor de Fundo</span>
                              <label style={{ background: item.iconBackgroundColor }} className="w-5 h-5 rounded-full cursor-pointer shadow-md" htmlFor="iconBackgroundColor">
                                <input
                                  id="iconBackgroundColor"
                                  type="color"
                                  value={item.iconBackgroundColor}
                                  onChange={(e) => updateElement(item.id, "iconBackgroundColor", e.target.value)}
                                  className="w-5 h-5 rounded-md border-none p-0 cursor-pointer outline-none opacity-0 absolute"
                                />
                              </label>
                            </label>
                            <label className="flex gap-1 items-center">
                              <span className="text-xs text-gray-600">Cor</span>
                              <label style={{ background: item.iconColor }} className="w-5 h-5 rounded-full cursor-pointer shadow-md" htmlFor="iconColor">
                                <input
                                  id="iconColor"
                                  type="color"
                                  value={item.iconColor}
                                  onChange={(e) => updateElement(item.id, "iconColor", e.target.value)}
                                  className="w-5 h-5 rounded-md border-none p-0 cursor-pointer outline-none opacity-0 absolute"
                                />
                              </label>
                            </label>
                          </div>}
                        </div>
                        <div className="flex gap-4">
                          <div className="flex gap-1">
                            <label htmlFor={`${item.id}-icon-yes`}>Sim</label>
                            <input id={`${item.id}-icon-yes`} checked={item.icon} onChange={() => updateElement(item.id, "icon", true)} type="radio" name={`${item.id}-icon`} />
                          </div>
                          <div className="flex gap-1">
                            <label htmlFor={`${item.id}-icon-no`}>Não</label>
                            <input id={`${item.id}-icon-no`} checked={!item.icon} onChange={() => updateElement(item.id, "icon", false)} type="radio" name={`${item.id}-icon`} />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                  {item.type === "image" && (
                    <input
                      type="text"
                      placeholder="URL da Imagem"
                      value={item.src}
                      onChange={(e) => updateElement(item.id, "src", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    />
                  )}
                  {item.type === "text" && (
                    <div className="flex flex-col gap-4 py-4 w-full">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <label className="text-md text-gray-600">Texto</label>
                          <div className="flex gap-4 items-center">
                            {/* 🔹 Seletor de cor do texto */}
                            <label style={{ backgroundColor: item.textColor }} className="w-8 h-8 rounded-full shadow-md border-gray-300">
                              <input
                                type="color"
                                value={item.textColor}
                                onChange={(e) => updateElement(item.id, "textColor", e.target.value)}
                                className="border-none cursor-pointer outline-none opacity-0"
                              />
                            </label>

                            {/* 🔹 Botão para negrito */}
                            <button
                              onClick={() => updateElement(item.id, "bold", !item.bold)}
                              className={`flex items-center gap-2 p-2 rounded-md ${item.bold ? "bg-gray-700 text-white" : "bg-gray-200"} cursor-pointer`}
                            >
                              <FormatBoldOutlined style={{ width: 16 }} />
                            </button>

                            {/* 🔹 Seletor de alinhamento do texto */}
                            <div className="flex gap-1">
                              {textAlignments.map((align, index) => (
                                <button
                                  key={index}
                                  onClick={() => updateElement(item.id, "align", align)}
                                  className={`p-2 rounded-md ${item.align === align ? "bg-gray-700 text-white" : "bg-gray-200"} cursor-pointer`}
                                >
                                  {align === "text-left" && <FormatAlignLeftOutlined style={{ width: 16 }} />}
                                  {align === "text-center" && <FormatAlignCenterOutlined style={{ width: 16 }} />}
                                  {align === "text-right" && <FormatAlignRightOutlined style={{ width: 16 }} />}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <textarea
                          value={item.content}
                          onChange={(e) => updateElement(item.id, "content", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </div>

                      {/* 🔹 Seletor de tamanho do texto */}
                      <div className="flex flex-col gap-1">
                        <label className="text-md text-gray-600">Tamanho do Texto</label>
                        <select
                          value={item.textSize}
                          onChange={(e) => updateElement(item.id, "textSize", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        >
                          {textSizes.map((size) => (
                            <option key={size.value} value={size.value}>
                              {size.label}
                            </option>
                          ))}
                        </select>
                      </div>


                    </div>
                  )}

                  {
                    (planType === 'premium' && item.type === "tracking") && (
                      <div className="flex flex-col gap-2 py-4 justify-center">
                        <label className="text-sm font-medium text-gray-600">Código de Rastreamento</label>
                        <textarea
                          value={item.pixel}
                          onChange={(e) => updateElement(item.id, "pixel", e.target.value)}
                          placeholder="Cole aqui seu código de rastreamento (Meta Pixel, Google Ads, etc.)"
                          className="block w-full p-2 border rounded-md font-mono text-sm"
                          rows={4}
                        />
                      </div>
                    )
                  }

                  {/* 🔹 Remover botão */}
                  <button
                    onClick={() => confirmRemoveElement(item.id)}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center justify-end w-full cursor-pointer my-4"
                  >
                    <DeleteOutlined />
                  </button>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* 👀 Prévia da página (lado direito) */}
      <div className="px-4 flex flex-col py-4 pb-10 items-center border-l-2 border-gray-200 relative">
        {/* 🔹 Seletor de cor do fundo */}
        <div className="flex items-center gap-2 z-10 bg-white p-2 rounded-lg shadow-md w-fit absolute  top-2 right-2">
          <span className="text-sm ">Cor de Fundo</span>
          <label style={{ backgroundColor: pageBackgroundColor }} className="cursor-pointer rounded-full h-8 w-8 shadow-md border-gray-300 border" htmlFor="pageBgColor">
            <input
              id="pageBgColor"
              type="color"
              value={pageBackgroundColor}
              onChange={(e) => setPageBackgroundColor(e.target.value)}
              className="w-12 h-12 rounded-md border-none cursor-pointer outline-none opacity-0"
            />
          </label>
        </div>
        {/* <header className="text-center" style={{ color: previewTextColor }}>
          <h1 className="text-3xl font-bold">Prévia</h1>
          <p className="text-sm">Veja como sua página ficará</p>
        </header> */}
        <div className="sticky top-10 scale-90 px-2">
          <button
            onClick={publishSite}
            disabled={publishing}
            className="absolute -top-12 -right-6 -z-10 px-6 py-3 bg-amber-600 text-white rounded-md cursor-pointer"
          >
            {publishing ? "Publicando..." : "Publicar Site"}
          </button>
          <Image unoptimized className="pointer-events-none absolute z-20 top-8 left-1/2 -translate-x-1/2" width={420} height={800} src="/mockup1.png" alt="mockup 1" />
          <Image unoptimized className="pointer-events-none absolute z-20 top-8 left-1/2 -translate-x-1/2" width={420} height={800} src="/mockup2.png" alt="mockup 2" />
          <div ref={ref} className="relative h-[780px] rounded-[48px] flex items-center w-[380px]  mt-10 overflow-hidden" style={{ backgroundColor: pageBackgroundColor }}>
            <div className="flex flex-col items-center justify-between h-full w-full gap-10" style={{ backgroundColor: pageBackgroundColor }}>
              <div className="flex flex-col w-full relative overflow-y-auto justify-between h-full gap-4">
                <div className="flex flex-col gap-10">

                  <div className="w-full max-h-[200px] relative">
                    <Image id="top-banner" unoptimized className="w-full object-cover h-full" width={300} height={300} src={banner} alt="Top banner" />
                    <Image id="top-icon" unoptimized className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded-full object-cover w-16 h-16" width={60} height={60} src={icon} alt="Top icon" />
                  </div>

                  <div className="flex flex-col gap-4 px-4 ">
                    <div className="flex flex-col gap-1">
                      {title && <h1 style={{ color: titleColor }} className="text-2xl font-semibold text-center">{title}</h1>}
                      {subtitle && <h2 style={{ color: subtitleColor }} className="text-center">{subtitle}</h2>}
                    </div>
                    {socialIcons.length > 0 && (
                      <div className="flex flex-wrap gap-4 justify-center max-w-[300px] mx-auto">
                        {socialIcons.map((el, index) => {
                          const IconComponent = socialLinks[el.icon]; // Obtém o componente do ícone pelo nome

                          if (!IconComponent) return null; // Garante que não haja erro caso o ícone não exista

                          return (
                            <a
                              target="_blank"
                              key={index}
                              className="p-3 rounded-md flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-all"
                              style={{ backgroundColor: topLinksBackground }}
                              href={el.link}
                            >
                              <IconComponent style={{ width: 20, height: 20, fill: topLinksColor, color: topLinksColor }} />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 px-10 max-w-[900px] mx-auto">
                    {[...elements].reverse().map((item) => item.type === "link"
                      ? <a target="_blank" style={{ backgroundColor: item.bgColor, color: item.textColor, borderColor: item.border }} key={item.id} href={item.url} className="px-6 py-3 rounded-2xl justify-between items-center flex gap-2 border-2 font-medium uppercase transition-all hover:scale-105 flex-col w-full">
                        {item.image && (
                          <Image
                            id={`${item.id}-link-image`}
                            unoptimized
                            src={URL.createObjectURL(item.image)}
                            alt="Preview"
                            className={`object-cover w-full rounded-lg h-48`}
                            width={100}
                            height={100}
                          />
                        )}
                        <div className="flex justify-between w-full">
                          {item.text}
                          {item.icon &&
                            <div style={{ backgroundColor: item.iconBackgroundColor }} className="rounded-xl p-2 flex items-center">
                              <ArrowRightAltRounded style={{ fill: item.iconColor, width: 16, height: 16 }} />
                            </div>
                          }
                        </div>
                      </a>
                      : item.type === "image"
                        ? <img key={item.id} src={item.src} className="max-w-48 max-h-48 object-cover" />
                        : item.type === "tracking"
                          ? <div key={item.id} dangerouslySetInnerHTML={{ __html: item.pixel }} />
                          : <p className={`${item.textSize} ${item.bold ? "font-bold" : ""} ${item.align} mb-0`} style={{ color: item.textColor }} key={item.id}>{item.content}</p>)}
                  </div>
                </div>
                {planType !== 'premium' && <footer className="py-4 text-center bg-[#5C9E31] w-full flex items-center justify-center flex-col">
                  <p className="text-sm text-white">
                    Página criada por <a href={process.env.NEXT_PUBLIC_LINKIWI_URL_LANDING_PAGE} target="_blank" className="underline font-bold">Linkiwi</a>
                  </p>
                  <p className="text-sm text-white">
                    Todos os direitos reservados
                  </p>
                </footer>}
              </div>
            </div>
          </div>
        </div>

      </div >
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#00000080] z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirmar Remoção</h2>
            <p className="mb-4">Tem certeza de que deseja remover este elemento?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelRemove}
                className="cursor-pointer transition-all hover:scale-105 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRemove}
                className="currsor-pointer transition-all hover:scale-105 px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
})

export default TemplateMinimalist

TemplateMinimalist.displayName = "TemplateMinimalist";