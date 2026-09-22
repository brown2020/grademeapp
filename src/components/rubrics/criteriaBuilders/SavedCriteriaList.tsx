"use client";

import CriterionActions from "./CriterionActions";

type Item = { id: string; name: string };

type Props = {
  title?: string;
  emptyText?: string;
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
};

export default function SavedCriteriaList({
  title = "Saved Criteria",
  emptyText = "Added criteria will appear here.",
  items,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="criteria-list mt-4">
      <h4 className="text-primary-30 font-semibold text-center">{title}</h4>
      {items.length === 0 ? (
        <div className="text-center text-primary-10 p-2 border-dashed border-2 border-primary-30 rounded-md">
          <p>{emptyText}</p>
        </div>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex justify-between items-center my-2">
            <span className="text-primary-20">{item.name}</span>
            <CriterionActions onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
          </div>
        ))
      )}
    </div>
  );
}
