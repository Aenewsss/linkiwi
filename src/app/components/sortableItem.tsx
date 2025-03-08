"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onPointerDown={(e) => {
        // Impede o arraste se estiver interagindo com um input
        console.log((e.target as HTMLElement).dataset.noDnd === "true")
        if ((e.target as HTMLElement).dataset.noDnd === "true") {
          e.stopPropagation();
        }
      }}
      className={`p-4 border rounded-lg bg-white shadow-md flex flex-col items-center`}
    >
      <div
        {...attributes}
        {...listeners}
        className="drag-handle cursor-grab flex self-start active:p-2 active:cursor-grabbing active:bg-gray-100 hover:bg-gray-100 transition-all  font-semibold text-gray-700 py-1 -mt-3 mb-4"
      >
        ⠿ Arraste aqui
      </div>
      {children}
    </div>
  );
}