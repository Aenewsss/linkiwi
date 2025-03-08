"use client";
import { createElement, forwardRef, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "./sortableItem";
import { AddOutlined, DeleteOutlined, FormatAlignCenterOutlined, FormatAlignLeftOutlined, FormatAlignRightOutlined, FormatBoldOutlined, GitHub, Instagram, LinkedIn, Public, Link as LinkIcon } from "@mui/icons-material"

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
  icon?: string
  pixel?: string
}

export const iconOptions = { Instagram, LinkedIn, GitHub, Link: LinkIcon, Public }; // Lista de ícones disponíveis

const TemplateMinimalist = forwardRef<HTMLDivElement, unknown>((_, ref) => {
  const [pageBackgroundColor, setPageBackgroundColor] = useState("#f3f4f6"); // 🔹 Estado para cor do fundo da página
  const [cardbackgroundColor, setCardBackgroundColor] = useState("#ffffff"); // 🔹 Estado para cor do fundo do card

  const textSizes = ["text-sm", "text-md", "text-lg", "text-xl", "text-2xl", "text-3xl"];
  const textAlignments = ["text-left", "text-center", "text-right"];

  const [elements, setElements] = useState<IElement[]>([
    { id: "1", type: "text", content: "Bem-vindo à minha página personalizada!", textSize: "text-2xl", textColor: "#000000", bold: true, align: "text-left" },
    { id: "2", type: "link", text: "Meu LinkedIn", url: "https://linkedin.com", bgColor: "#22c55e", textColor: "#ffffff" },
    { id: "3", type: "link", text: "Meu Instagram", url: "https://instagram.com", bgColor: "#3b82f6", textColor: "#ffffff" },
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
        { id: newId, type: "link", text: "Novo Link", url: "#", bgColor: "#2563eb", textColor: "#ffffff" },
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

        <div className="mb-6 flex gap-2 justify-center items-center ">
          <span className="text-gray-600 text-sm">Cor do card</span>
          <label style={{ backgroundColor: cardbackgroundColor }} className="cursor-pointer rounded-full h-8 w-8 shadow-md border-gray-300 border" htmlFor="pageBgColor">
            <input
              id="pageBgColor"
              type="color"
              value={cardbackgroundColor}
              onChange={(e) => setCardBackgroundColor(e.target.value)}
              className="w-12 h-12 rounded-md border-none cursor-pointer outline-none opacity-0"
            />
          </label>
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
                      </div>

                      {/* 🔹 Seletor de Ícone */}
                      <div className="mt-2">
                        <span className="text-xs text-gray-600">Ícone</span>
                        <select
                          value={item.icon}
                          onChange={(e) => updateElement(item.id, "icon", e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        >
                          <option value="">Nenhum</option>
                          {Object.keys(iconOptions).map((iconKey) => (
                            <option key={iconKey} value={iconKey}>
                              {iconKey}
                            </option>
                          ))}
                        </select>
                      </div>

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
                          <option key={size} value={size}>
                            {size}
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
      <div className="w-1/2 flex flex-col" style={{ backgroundColor: pageBackgroundColor }}>
        <header className="text-center m-4" style={{ color: previewTextColor }}>
          <h1 className="text-3xl font-bold">Prévia</h1>
          <p className="text-sm">Veja como sua página ficará</p>
        </header>
        <div ref={ref} className="flex items-center w-full h-full">
          <div className="flex items-center justify-center w-full h-full" style={{ backgroundColor: pageBackgroundColor }}>
            <div style={{ backgroundColor: cardbackgroundColor }} className=" p-6 rounded-lg shadow-lg w-80">
              <div className="flex flex-col gap-3">
                {elements.map((item) => item.type === "link"
                  ? <a target="_blank" style={{ backgroundColor: item.bgColor, color: item.textColor }} key={item.id} href={item.url} className="px-6 py-3 rounded-md justify-center items-center shadow-md flex gap-2">
                    {iconOptions[item.icon] && createElement(iconOptions[item.icon], { style: { width: 20, height: 20, fill: item.textColor } })}
                    {item.text}
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
    </div>
  );
})

export default TemplateMinimalist

TemplateMinimalist.displayName = "TemplateMinimalist";