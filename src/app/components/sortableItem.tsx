"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableItem({ id, children, highlighted }: { id: string; children: React.ReactNode, highlighted: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderColor: highlighted && 'green',
    borderWidth: highlighted && 4
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onPointerDown={(e) => {
        // Impede o arraste se estiver interagindo com um input
        if ((e.target as HTMLElement).dataset.noDnd === "true") {
          e.stopPropagation();
        }
      }}
      className={`border rounded-lg bg-white shadow-md flex items-center gap-4`}
    >
      <div
        {...attributes}
        {...listeners}
        className="drag-handle p-4 cursor-grab flex self-start active:p-2 active:cursor-grabbing active:bg-gray-100 hover:bg-gray-100 transition-all  font-semibold text-gray-700 h-full items-center justify-center"
      >
        ⠿
      </div>
      <div className="w-full pe-4">
        {children}
      </div>
    </div>
  );
}