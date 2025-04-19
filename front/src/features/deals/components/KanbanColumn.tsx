import React from "react";
import KanbanCard from "./KanbanCard";

interface CardData {
  title: string;
  description: string;
  labels: string[];
  date: string;
  time: string;
}

interface KanbanColumnProps {
  title: string;
  cards: CardData[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, cards }) => (
  <div className="w-64 flex-none md:w-72">
    <div className="mb-4 flex items-center justify-between gap-2">
      <h2 className="font-semibold">{title}</h2>
      {/* ...add/edit buttons... */}
    </div>
    <div className="flex flex-col gap-4">
      {cards.map((card, idx) => (
        <KanbanCard key={idx} {...card} />
      ))}
    </div>
  </div>
);

export default KanbanColumn;
