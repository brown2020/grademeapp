"use client";

import { Edit2Icon, Trash2 } from "lucide-react";

type Props = { onEdit: () => void; onDelete: () => void };

export default function CriterionActions({ onEdit, onDelete }: Props) {
  return (
    <div className="flex gap-x-4">
      <button type="button" aria-label="Edit criterion" onClick={onEdit} className="text-blue-500 hover:text-blue-700 bg-transparent border-0">
        <Edit2Icon size={20} />
      </button>
      <button type="button" aria-label="Delete criterion" onClick={onDelete} className="text-red-500 hover:text-red-700 bg-transparent border-0">
        <Trash2 size={20} />
      </button>
    </div>
  );
}
