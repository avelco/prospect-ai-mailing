import React, { useState, useRef } from "react";
import { Heading } from "../components/Heading";

// Types for cards and columns
type Card = {
  id: number;
  title: string;
  description: string;
  tags: { label: string; color: string }[];
  date: string;
  time: string;
};

type Column = {
  id: string;
  title: string;
  cards: Card[];
};

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "Todo",
    cards: [
      {
        id: 1,
        title: "New logo design",
        description:
          "We have to re-evalute our brand message and come up with a clean and modern design.",
        tags: [
          { label: "brand", color: "bg-rose-50 text-rose-600" },
          { label: "design", color: "bg-blue-50 text-blue-600" },
        ],
        date: "October 1st",
        time: "14:00",
      },
      {
        id: 2,
        title: "Build mobile application",
        description: "We must come up with a cool design",
        tags: [
          { label: "brand", color: "bg-rose-50 text-rose-600" },
          { label: "design", color: "bg-blue-50 text-blue-600" },
          { label: "development", color: "bg-emerald-50 text-emerald-600" },
        ],
        date: "November 10th",
        time: "18:00",
      },
      {
        id: 3,
        title: "Website implementation",
        description:
          "We are starting with the basic idea and move forward. It needs to be ready in a couple of months, so let's get started.",
        tags: [
          { label: "design", color: "bg-blue-50 text-blue-600" },
          { label: "development", color: "bg-emerald-50 text-emerald-600" },
        ],
        date: "November 20th",
        time: "10:00",
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    cards: [
      {
        id: 4,
        title: "Accounting software",
        description:
          "Crucial to finish the integration to the new software as soon as possible.",
        tags: [
          { label: "business", color: "bg-purple-50 text-purple-600" },
          { label: "accounting", color: "bg-pink-50 text-pink-600" },
        ],
        date: "September 21st",
        time: "16:30",
      },
      {
        id: 5,
        title: "Import data to the new CRM",
        description:
          "All customers' data is ready to be added in our new solution.",
        tags: [{ label: "personal", color: "bg-orange-50 text-orange-600" }],
        date: "September 22nd",
        time: "17:00",
      },
    ],
  },
  {
    id: "underreview",
    title: "Under Review",
    cards: [],
  },
  {
    id: "completed",
    title: "Completed",
    cards: [
      {
        id: 6,
        title: "Database data integration",
        description:
          "Make sure all customer data is integrated in our brand new database system.",
        tags: [{ label: "personal", color: "bg-orange-50 text-orange-600" }],
        date: "August 23rd",
        time: "11:26",
      },
      {
        id: 7,
        title: "Sales preparation",
        description:
          "Prepare the email marketing software with templates for all possible responses.",
        tags: [{ label: "marketing", color: "bg-sky-50 text-sky-600" }],
        date: "September 2nd",
        time: "15:15",
      },
    ],
  },
];

const DealsPage: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [addFormShow, setAddFormShow] = useState<boolean>(false);
  const [addFormTitle, setAddFormTitle] = useState<string>("");
  const [addFormDescription, setAddFormDescription] = useState<string>("");
  const addFormRef = useRef<HTMLInputElement>(null);

  // Dropdown handlers
  const handleDropdown = (cardId: number) => {
    setDropdownOpen(dropdownOpen === cardId ? null : cardId);
  };

  // Add card handlers (for Under Review column as example)
  const handleAddCard = () => {
    if (!addFormTitle.trim()) return;
    setColumns((prev) =>
      prev.map((col) =>
        col.id === "underreview"
          ? {
              ...col,
              cards: [
                ...col.cards,
                {
                  id: Date.now(),
                  title: addFormTitle,
                  description: addFormDescription,
                  tags: [],
                  date: "TBD",
                  time: "TBD",
                },
              ],
            }
          : col
      )
    );
    setAddFormTitle("");
    setAddFormDescription("");
    setAddFormShow(false);
  };

  // Card delete handler
  const handleDeleteCard = (colId: string, cardId: number) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    );
    setDropdownOpen(null);
  };

  // Card edit handler (not implemented, just a placeholder)
  const handleEditCard = (colId: string, cardId: number) => {
    alert("Edit card " + cardId + " in column " + colId);
    setDropdownOpen(null);
  };

  // Render a card
  const renderCard = (colId: string, card: Card) => (
    <div className="relative" key={card.id}>
      <div className="absolute end-4 top-4">
        <div className="relative">
          <button
            id={`card-dropdown-${card.id}`}
            aria-haspopup="true"
            aria-expanded={dropdownOpen === card.id}
            type="button"
            className="flex size-6 items-center justify-center text-slate-400 hover:text-slate-600 active:text-slate-400"
            onClick={() => handleDropdown(card.id)}
          >
            <svg
              className="hi-mini hi-ellipsis-vertical inline-block size-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"></path>
            </svg>
          </button>
          {dropdownOpen === card.id && (
            <div
              role="menu"
              aria-labelledby={`card-dropdown-${card.id}`}
              className="absolute end-0 z-10 mt-2 w-32 rounded-lg shadow-xl bg-white ring-1 ring-black/5"
            >
              <div className="divide-y divide-slate-100 rounded-lg">
                <div className="flex flex-col gap-2 p-2">
                  <button
                    type="button"
                    className="group inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-600"
                    onClick={() => handleEditCard(colId, card.id)}
                  >
                    <svg
                      className="hi-mini hi-pencil inline-block size-4 opacity-50 group-hover:opacity-100"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"></path>
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="group inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                    onClick={() => handleDeleteCard(colId, card.id)}
                  >
                    <svg
                      className="hi-mini hi-trash inline-block size-4 opacity-50 group-hover:opacity-100"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="group flex flex-col gap-3 rounded-xl bg-white p-4 text-sm transition hover:shadow-lg hover:shadow-slate-200">
        <div className="-ms-1.5 flex grow flex-wrap gap-1 pe-6">
          {card.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`rounded-xl px-1.5 py-px font-medium ${tag.color}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
        <div>
          <h3 className="mb-1 font-bold">{card.title}</h3>
          <p className="line-clamp-3 text-slate-500">{card.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-slate-500">
            <svg
              className="hi-mini hi-calendar-days inline-block size-5 text-slate-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z"></path>
              <path
                fillRule="evenodd"
                d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>{card.date}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-slate-500">
            <svg
              className="hi-mini hi-clock inline-block size-5 text-slate-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>{card.time}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-nowrap items-start justify-start gap-6 overflow-x-auto px-4 py-6 lg:gap-8 lg:p-8">
        {columns.map((col) => (
          <div className="w-64 md:w-72 flex-none" key={col.id}>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-semibold">{col.title}</h2>
              <div className="flex items-center gap-2">
                {/* Add/Edit buttons, can be customized per column */}
                <button
                  type="button"
                  className="group inline-flex size-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-950 active:border-slate-400"
                  onClick={() => {
                    if (col.id === "underreview") {
                      setAddFormShow(true);
                      setTimeout(() => addFormRef.current?.focus(), 0);
                    }
                  }}
                >
                  <svg
                    className="hi-mini hi-plus inline-block size-5 transition group-active:scale-90"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"></path>
                  </svg>
                </button>
                <button
                  type="button"
                  className="group inline-flex size-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-950 active:border-slate-400"
                >
                  <svg
                    className="hi-mini hi-pencil-square inline-block size-5 transition group-active:scale-90"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"></path>
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {/* Add card form for Under Review column */}
              {col.id === "underreview" && addFormShow ? (
                <form
                  className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-lg shadow-slate-200"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddCard();
                  }}
                >
                  <div className="space-y-1">
                    <input
                      ref={addFormRef}
                      type="text"
                      id="add-card-title"
                      name="add-card-title"
                      placeholder="Enter a title"
                      className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                      value={addFormTitle}
                      onChange={(e) => setAddFormTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <textarea
                      id="add-card-description"
                      name="add-card-description"
                      rows={4}
                      placeholder="Enter further details"
                      className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                      value={addFormDescription}
                      onChange={(e) => setAddFormDescription(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="block w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-3 focus:outline-hidden"
                  >
                    Add new card
                  </button>
                  <button
                    type="button"
                    className="mt-2 text-xs text-slate-400 hover:text-slate-600"
                    onClick={() => setAddFormShow(false)}
                  >
                    Cancel
                  </button>
                </form>
              ) : col.id === "underreview" ? (
                <button
                  className="group inline-flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 p-4 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-950 active:border-slate-200"
                  onClick={() => {
                    setAddFormShow(true);
                    setTimeout(() => addFormRef.current?.focus(), 0);
                  }}
                >
                  <svg
                    className="hi-mini hi-plus inline-block size-5 text-slate-400 transition group-hover:text-slate-600 group-active:scale-75"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"></path>
                  </svg>
                  <span>Add a card</span>
                </button>
              ) : null}
              {/* Render cards */}
              {col.cards.map((card) => renderCard(col.id, card))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DealsPage;
