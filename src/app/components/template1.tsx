"use client";
import { forwardRef, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./sortableItem";
import { AddOutlined, DeleteOutlined, FormatAlignCenterOutlined, FormatAlignLeftOutlined, FormatAlignRightOutlined, FormatBoldOutlined, GitHub, Instagram, LinkedIn, Public, Link as LinkIcon, ArrowRightAltRounded, } from "@mui/icons-material"
import Image from "next/image";
import { socialLinks } from "../../constant/social-links.const";
import useTemplateStore from "@/store/templateStore";

interface IElement {
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
}

export const iconOptions = { Instagram, LinkedIn, GitHub, Link: LinkIcon, Public }; // Lista de ícones disponíveis

const TemplateMinimalist = forwardRef<HTMLDivElement, unknown>((_, ref) => {

  const { banner, setBanner, setBannerFile } = useTemplateStore()

  const [pageBackgroundColor, setPageBackgroundColor] = useState("#F3FDC4"); // 🔹 Estado para cor do fundo da página
  const [icon,] = useState('/icon-linkiwi.svg');

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

  const [elements, setElements] = useState<IElement[]>([
    { id: "1", type: "text", content: "Bem-vindo à minha página personalizada!", textSize: "text-2xl", textColor: "#000000", bold: true, align: "text-left" },
    { id: "2", type: "link", text: "Meu LinkedIn", url: "https://linkedin.com", bgColor: "#FFFFFF", textColor: "#00000", border: '#e2e8f0', icon: true, iconBackgroundColor: '#BEF264' },
    { id: "3", type: "link", text: "Meu Instagram", url: "https://instagram.com", bgColor: "#FFFFFF", textColor: "#00000", border: '#e2e8f0', icon: true, iconBackgroundColor: '#BEF264' },
    { id: "4", type: "tracking", pixel: "" },
  ]);
  const isDarkColor = (color: string) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000; // Fórmula de luminância
    return brightness < 128; // Considera escuro se a luminância for menor que 128
  };

  const previewTextColor = isDarkColor(pageBackgroundColor) ? "#ffffff" : "#1f2937"; // Branco para fundo escuro, cinza escuro para fundo claro

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
  const updateElement = (id: string, field: string, value: string | boolean) => {
    setElements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // 🔹 Adiciona um novo elemento (link, imagem ou texto)
  const addNewElement = (type: "link" | "image" | "text" | "tracking") => {
    const newId = String(elements.length + 1);
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
  };

  // 🔹 Remove um elemento
  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setBannerFile(file)

    const fileURL = URL.createObjectURL(file); // Cria um link temporário para visualizar a imagem
    setBanner(fileURL);
  };


  return (
    <div className="flex">
      {/* 🎨 Painel de edição (lado esquerdo) */}
      <div className="w-1/2 p-6 bg-gray-50 relative">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold">Editor de Links</h1>
          <p className="text-gray-600">Personalize seus links facilmente</p>
        </header>

        {/* 🔹 Seletor de cor do fundo */}
        <div className="mb-6 flex flex-col items-center absolute top-2 left-2">
          <span className="text-gray-600 text-sm mb-2">Cor de Fundo</span>
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

        {/* 🔹 Seletor do banner */}
        <div className="mb-10 flex flex-col items-center">
          <span className="text-gray-600 text-lg font-semibold">Banner Topo</span>

          <label className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
            Selecionar Imagem
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {/* 🔹 Seletor do título */}
        <div className="mb-16 flex flex-col items-center">
          <span className="text-gray-600 text-lg font-semibold">Título</span>

          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md"
          />
          <div className="flex gap-1 items-center">
            <label htmlFor="">Cor</label>
            <div className="flex gap-4 w-full mt-2 items-center">
              {/* 🔹 Seletor de cor do texto */}
              <label style={{ backgroundColor: titleColor }} className="w-8 h-8 rounded-full shadow-md border-gray-300">
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

        {/* 🔹 Seletor do subtítulo */}
        <div className="mb-16 flex flex-col items-center">
          <span className="text-gray-600 text-lg font-semibold">Subtítulo</span>

          <textarea
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md"
          />
          <div className="flex gap-1 items-center">
            <label htmlFor="">Cor</label>
            <div className="flex gap-4 w-full mt-2 items-center">
              {/* 🔹 Seletor de cor do texto */}
              <label style={{ backgroundColor: subtitleColor }} className="w-8 h-8 rounded-full shadow-md border-gray-300">
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

        {/* 🔹 Seletor de links do topo */}
        <div className="flex flex-col items-center mb-16">
          <span className="text-gray-600 text-lg font-semibold">Links topo</span>
          {/* onChange={(e) => {
              const exists = socialIcons.find(el => el.icon == e.target.value)
              setSocialIcons()
            }} */}
          <div className="flex gap-4 flex-wrap mt-4">
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
            <div className="flex gap-2">
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
          <div className="flex justify-between mt-4">
            <div className="flex gap-1 items-center">
              <label htmlFor="">Fundo dos links</label>
              <div className="flex gap-4 w-full mt-2 items-center">
                {/* 🔹 Seletor de cor do texto */}
                <label style={{ backgroundColor: topLinksBackground }} className="w-8 h-8 rounded-full shadow-md border-gray-300">
                  <input
                    type="color"
                    value={topLinksBackground}
                    onChange={(e) => setTopLinksBackground(e.target.value)}
                    className="border-none cursor-pointer outline-none opacity-0"
                  />
                </label>
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <label htmlFor="">Cor dos links</label>
              <div className="flex gap-4 w-full mt-2 items-center">
                {/* 🔹 Seletor de cor do texto */}
                <label style={{ backgroundColor: topLinksColor }} className="w-8 h-8 rounded-full shadow-md border-gray-300">
                  <input
                    type="color"
                    value={topLinksColor}
                    onChange={(e) => setTopLinksColor(e.target.value)}
                    className="border-none cursor-pointer outline-none opacity-0"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={elements} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-4">
              {elements.map((item) => (
                <SortableItem key={item.id} id={item.id}>
                  {item.type === "link" && (
                    <>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateElement(item.id, "text", e.target.value)}
                        className="text-center w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => updateElement(item.id, "url", e.target.value)}
                        className="text-center w-full px-2 py-1 border border-gray-300 rounded-md mt-1"
                      />
                      {/* 🔹 Seletor de cores  */}
                      <div className="flex items-center gap-4 mt-2">
                        <label className="flex gap-1 items-center">
                          <span className="text-xs text-gray-600">Fundo</span>
                          <label style={{ background: item.bgColor }} className="w-8 h-8 rounded-full cursor-pointer shadow-md" htmlFor="buttonColor">
                            <input
                              id="buttonColor"
                              type="color"
                              value={item.bgColor}
                              onChange={(e) => updateElement(item.id, "bgColor", e.target.value)}
                              className="w-8 h-8 rounded-md border-none p-0 cursor-pointer outline-none opacity-0 absolute"
                            />
                          </label>
                        </label>
                        <label className="flex gap-1 items-center">
                          <span className="text-xs text-gray-600">Texto</span>
                          <label style={{ background: item.textColor }} className="w-8 h-8 rounded-full cursor-pointer shadow-md" htmlFor="textColor">
                            <input
                              id="textColor"
                              type="color"
                              value={item.textColor}
                              onChange={(e) => updateElement(item.id, "textColor", e.target.value)}
                              className="w-8 h-8 rounded-md border-none p-0 cursor-pointer outline-none opacity-0 absolute"
                            />
                          </label>
                        </label>
                        <label className="flex gap-1 items-center">
                          <span className="text-xs text-gray-600">Borda</span>
                          <label style={{ background: item.border }} className="w-8 h-8 rounded-full cursor-pointer shadow-md" htmlFor="border">
                            <input
                              id="border"
                              type="color"
                              value={item.border}
                              onChange={(e) => updateElement(item.id, "border", e.target.value)}
                              className="w-8 h-8 rounded-md border-none p-0 cursor-pointer outline-none opacity-0 absolute"
                            />
                          </label>
                        </label>
                      </div>

                      {/* 🔹 Seletor de Ícone */}
                      <div className="mt-2">
                        <span className="text-xs text-gray-600">Ícone</span>
                        <select
                          value={item.icon ? 'yes' : 'no'}
                          onChange={(e) => updateElement(item.id, "icon", e.target.value != 'no')}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        >
                          <option value="no">Não</option>
                          <option value="yes">Sim</option>
                        </select>
                      </div>

                      {item.icon && <div className="flex items-center gap-4 mt-2">
                        <label className="flex gap-1 items-center">
                          <span className="text-xs text-gray-600">Fundo ícone</span>
                          <label style={{ background: item.iconBackgroundColor }} className="w-8 h-8 rounded-full cursor-pointer shadow-md" htmlFor="iconBackgroundColor">
                            <input
                              id="iconBackgroundColor"
                              type="color"
                              value={item.iconBackgroundColor}
                              onChange={(e) => updateElement(item.id, "iconBackgroundColor", e.target.value)}
                              className="w-8 h-8 rounded-md border-none p-0 cursor-pointer outline-none opacity-0 absolute"
                            />
                          </label>
                        </label>
                        <label className="flex gap-1 items-center">
                          <span className="text-xs text-gray-600">Cor ícone</span>
                          <label style={{ background: item.iconColor }} className="w-8 h-8 rounded-full cursor-pointer shadow-md" htmlFor="iconColor">
                            <input
                              id="iconColor"
                              type="color"
                              value={item.iconColor}
                              onChange={(e) => updateElement(item.id, "iconColor", e.target.value)}
                              className="w-8 h-8 rounded-md border-none p-0 cursor-pointer outline-none opacity-0 absolute"
                            />
                          </label>
                        </label>
                      </div>}

                    </>
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
                    <>
                      <textarea
                        value={item.content}
                        onChange={(e) => updateElement(item.id, "content", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                      />
                      {/* 🔹 Seletor de tamanho do texto */}
                      <select
                        value={item.textSize}
                        onChange={(e) => updateElement(item.id, "textSize", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md mt-2"
                      >
                        {textSizes.map((size) => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-4 w-full mt-2 items-center">
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
                    </>
                  )}

                  {
                    item.type === "tracking" && (
                      <>
                        <label className="text-sm font-semibold">Código de Rastreamento:</label>
                        <textarea
                          value={item.pixel}
                          onChange={(e) => updateElement(item.id, "pixel", e.target.value)}
                          placeholder="Cole aqui seu código de rastreamento (Meta Pixel, Google Ads, etc.)"
                          className="block w-full mt-2 p-2 border rounded-md font-mono text-sm"
                          rows={4}
                        />
                      </>
                    )
                  }

                  {/* 🔹 Remover botão */}
                  <button
                    onClick={() => removeElement(item.id)}
                    className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center justify-start w-full cursor-pointer"
                  >
                    <DeleteOutlined />
                    Remover
                  </button>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* 🔹 Botões para adicionar elementos */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => addNewElement('link')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md  cursor-pointer"
          >
            <AddOutlined /> Adicionar Link
          </button>
          <button
            onClick={() => addNewElement('text')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md  cursor-pointer"
          >
            <AddOutlined /> Adicionar Texto
          </button>
          <button
            onClick={() => addNewElement("tracking")}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md cursor-pointer"
          >
            <AddOutlined /> Adicionar Pixel/Tag
          </button>
          {/* <button
              onClick={() => addNewElement('image')}
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md  cursor-pointer"
            >
              <AddOutlined /> Adicionar Imagem
            </button> */}
        </div>
      </div>


      {/* 👀 Prévia da página (lado direito) */}
      <div className="w-1/2 flex flex-col py-4 pb-10 px-6 items-center">
        <header className="text-center" style={{ color: previewTextColor }}>
          <h1 className="text-3xl font-bold">Prévia</h1>
          <p className="text-sm">Veja como sua página ficará</p>
        </header>
        <div className="sticky top-10">
          <Image unoptimized className="pointer-events-none absolute z-20 top-8 left-1/2 -translate-x-1/2" width={420} height={800} src="/mockup1.png" alt="mockup 1" />
          <Image unoptimized className="pointer-events-none absolute z-20 top-8 left-1/2 -translate-x-1/2" width={420} height={800} src="/mockup2.png" alt="mockup 2" />
          <div ref={ref} className="relative rounded-[48px] flex items-center w-[380px] h-[750px] mt-10 overflow-hidden" style={{ backgroundColor: pageBackgroundColor }}>
            <div className="flex flex-col items-center justify-start w-full h-full gap-10 pb-4 ps-2 pe-6" style={{ backgroundColor: pageBackgroundColor }}>
              <div className="flex flex-col gap-10 w-full relative  overflow-y-auto">
                <div className="w-full max-h-[200px] relative">
                  <Image unoptimized className="w-full object-cover h-full" width={300} height={300} src={banner} alt="Top banner" />
                  <Image unoptimized className="absolute -bottom-7 left-1/2 -translate-x-1/2" width={60} height={60} src={icon} alt="Top icon" />
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

                <div className="flex flex-col gap-3 px-10">
                  {elements.map((item) => item.type === "link"
                    ? <a target="_blank" style={{ backgroundColor: item.bgColor, color: item.textColor, borderColor: item.border }} key={item.id} href={item.url} className="px-6 py-3 rounded-2xl justify-between items-center flex gap-2 border-2 font-medium uppercase transition-all hover:scale-105">
                      {item.text}
                      {item.icon &&
                        <div style={{ backgroundColor: item.iconBackgroundColor }} className="rounded-xl p-2 flex items-center">
                          <ArrowRightAltRounded style={{ fill: item.iconColor, width: 16, height: 16 }} />
                        </div>
                      }
                    </a>
                    : item.type === "image"
                      ? <img key={item.id} src={item.src} className="max-w-48 max-h-48 object-cover" />
                      : item.type === "tracking"
                        ? <div key={item.id} dangerouslySetInnerHTML={{ __html: item.pixel }} />
                        : <p className={`${item.textSize} ${item.bold ? "font-bold" : ""} ${item.align} mb-0`} style={{ color: item.textColor }} key={item.id}>{item.content}</p>)}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div >
    </div >
  );
})

export default TemplateMinimalist

TemplateMinimalist.displayName = "TemplateMinimalist";