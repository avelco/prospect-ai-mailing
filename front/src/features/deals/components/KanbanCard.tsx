import React, { useState } from "react";

interface KanbanCardProps {
  title: string;
  description: string;
  labels: string[];
  date: string;
  time: string;
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  title,
  description,
  labels,
  date,
  time,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative">
      {/* Action Dropdown */}
      <div className="absolute end-4 top-4">
        <div className="relative">
          <button
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen(true)}
            type="button"
            className="flex size-6 items-center justify-center text-slate-400 hover:text-slate-600 active:text-slate-400"
          >
            {/* ...ellipsis SVG... */}
          </button>
          {dropdownOpen && (
            <div
              className="absolute end-0 z-10 mt-2 w-32 rounded-lg shadow-xl ltr:origin-top-right rtl:origin-top-left"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="divide-y divide-slate-100 rounded-lg bg-white ring-1 ring-black/5">
                <div className="flex flex-col gap-2 p-2">
                  <button
                    type="button"
                    className="group inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-600"
                  >
                    {/* ...edit SVG... */}
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="group inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                  >
                    {/* ...delete SVG... */}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Card */}
      <a
        href="#"
        className="group flex flex-col gap-3 rounded-xl bg-white p-4 text-sm transition hover:shadow-lg hover:shadow-slate-200"
      >
        <div className="-ms-1.5 flex grow flex-wrap gap-1 pe-6">
          {labels.map((label) => (
            <span
              key={label}
              className={`rounded-xl px-1.5 py-px font-medium ${
                label === "brand"
                  ? "bg-rose-50 text-rose-600"
                  : label === "design"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
        <div>
          <h3 className="mb-1 font-bold">{title}</h3>
          <p className="line-clamp-3 text-slate-500">{description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-slate-500">
            {/* ...calendar SVG... */}
            <span>{date}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-slate-500">
            {/* ...clock SVG... */}
            <span>{time}</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default KanbanCard;
