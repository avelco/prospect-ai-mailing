import React, { useRef, useState } from "react";

const DealsPage: React.FC = () => {
  // For the add card form in "Under Review"
  const [addFormShow, setAddFormShow] = useState(false);
  const [addFormTitle, setAddFormTitle] = useState("");
  const [addFormDescription, setAddFormDescription] = useState("");
  const addFormRef = useRef<HTMLInputElement>(null);

  // Example handler for the add card form (does nothing in static version)
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormTitle("");
    setAddFormDescription("");
    setAddFormShow(false);
  };

  return (
    <div className="flex flex-nowrap items-start justify-start gap-6 overflow-x-auto px-4 py-6 lg:gap-8 lg:p-8">
      {/* Todo Column */}
      <div className="w-64 md:w-72 flex-none">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-semibold">Todo</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="group inline-flex size-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-950 active:border-slate-400"
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
          {/* Card 1 */}
          <div className="relative">
            <div className="group flex flex-col gap-3 rounded-xl bg-white p-4 text-sm transition hover:shadow-lg hover:shadow-slate-200">
              <div className="-ms-1.5 flex grow flex-wrap gap-1 pe-6">
                <span className="rounded-xl px-1.5 py-px font-medium bg-rose-50 text-rose-600">
                  brand
                </span>
                <span className="rounded-xl px-1.5 py-px font-medium bg-blue-50 text-blue-600">
                  design
                </span>
              </div>
              <div>
                <h3 className="mb-1 font-bold">New logo design</h3>
                <p className="line-clamp-3 text-slate-500">
                  We have to re-evalute our brand message and come up with a clean and modern design.
                </p>
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
                  <span>October 1st</span>
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
                  <span>14:00</span>
                </div>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="relative">
            <div className="group flex flex-col gap-3 rounded-xl bg-white p-4 text-sm transition hover:shadow-lg hover:shadow-slate-200">
              <div className="-ms-1.5 flex grow flex-wrap gap-1 pe-6">
                <span className="rounded-xl px-1.5 py-px font-medium bg-rose-50 text-rose-600">
                  brand
                </span>
                <span className="rounded-xl px-1.5 py-px font-medium bg-blue-50 text-blue-600">
                  design
                </span>
                <span className="rounded-xl px-1.5 py-px font-medium bg-emerald-50 text-emerald-600">
                  development
                </span>
              </div>
              <div>
                <h3 className="mb-1 font-bold">Build mobile application</h3>
                <p className="line-clamp-3 text-slate-500">
                  We must come up with a cool design
                </p>
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
                  <span>November 10th</span>
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
                  <span>18:00</span>
                </div>
              </div>
            </div>
          </div>
          {/* Card 3 */}
          <div className="relative">
            <div className="group flex flex-col gap-3 rounded-xl bg-white p-4 text-sm transition hover:shadow-lg hover:shadow-slate-200">
              <div className="-ms-1.5 flex grow flex-wrap gap-1 pe-6">
                <span className="rounded-xl px-1.5 py-px font-medium bg-blue-50 text-blue-600">
                  design
                </span>
                <span className="rounded-xl px-1.5 py-px font-medium bg-emerald-50 text-emerald-600">
                  development
                </span>
              </div>
              <div>
                <h3 className="mb-1 font-bold">Website implementation</h3>
                <p className="line-clamp-3 text-slate-500">
                  We are starting with the basic idea and move forward. It needs to be ready in a couple of months, so let's get started.
                </p>
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
                  <span>November 20th</span>
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
                  <span>10:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In Progress Column */}
      <div className="w-64 md:w-72 flex-none">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-semibold">In Progress</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="group inline-flex size-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-950 active:border-slate-400"
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
          {/* Card 1 */}
          <div className="relative">
            <div className="group flex flex-col gap-3 rounded-xl bg-white p-4 text-sm transition hover:shadow-lg hover:shadow-slate-200">
              <div className="-ms-1.5 flex grow flex-wrap gap-1 pe-6">
                <span className="rounded-xl px-1.5 py-px font-medium bg-purple-50 text-purple-600">
                  business
                </span>
                <span className="rounded-xl px-1.5 py-px font-medium bg-pink-50 text-pink-600">
                  accounting
                </span>
              </div>
              <div>
                <h3 className="mb-1 font-bold">Accounting software</h3>
                <p className="line-clamp-3 text-slate-500">
                  Crucial to finish the integration to the new software as soon as possible.
                </p>
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
                  <span>September 21st</span>
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
                  <span>16:30</span>
                </div>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="relative">
            <div className="group flex flex-col gap-3 rounded-xl bg-white p-4 text-sm transition hover:shadow-lg hover:shadow-slate-200">
              <div className="-ms-1.5 flex grow flex-wrap gap-1 pe-6">
                <span className="rounded-xl px-1.5 py-px font-medium bg-orange-50 text-orange-600">
                  personal
                </span>
              </div>
              <div>
                <h3 className="mb-1 font-bold">Import data to the new CRM</h3>
                <p className="line-clamp-3 text-slate-500">
                  All customers' data is ready to be added in our new solution.
                </p>
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
                  <span>September 22nd</span>
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
                  <span>17:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Under Review Column */}
      <div className="w-64 md:w-72 flex-none">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-semibold">Under Review</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="group inline-flex size-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-950 active:border-slate-400"
              onClick={() => {
                setAddFormShow(true);
                setTimeout(() => addFormRef.current?.focus(), 0);
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
          {/* Add card form (optional, can be removed for full static) */}
          {addFormShow ? (
            <form
              className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow-lg shadow-slate-200"
              onSubmit={handleAddCard}
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
          ) : (
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
          )}
        </div>
      </div>

      {/* Completed Column */}
      <div className="w-64 md:w-72 flex-none">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="font-semibold">Completed</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="group inline-flex size-8 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-slate-500 hover:text-slate-950 active:border-slate-400"
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
          {/* Card 1 */}
          <div className="relative">
            <div className="group flex flex-col gap-3 rounded-xl bg-white p-4 text-sm transition hover:shadow-lg hover:shadow-slate-200">
              <div className="-ms-1.5 flex grow flex-wrap gap-1 pe-6">
                <span className="rounded-xl px-1.5 py-px font-medium bg-orange-50 text-orange-600">
                  personal
                </span>
              </div>
              <div>
                <h3 className="mb-1 font-bold">Database data integration</h3>
                <p className="line-clamp-3 text-slate-500">
                  Make sure all customer data is integrated in our brand new database system.
                </p>
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
                  <span>August 23rd</span>
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
                  <span>11:26</span>
                </div>
              </div>
            </div>
          </div>
          {/* Card 2 */}
          <div className="relative">
            <div className="group flex flex-col gap-3 rounded-xl bg-white p-4 text-sm transition hover:shadow-lg hover:shadow-slate-200">
              <div className="-ms-1.5 flex grow flex-wrap gap-1 pe-6">
                <span className="rounded-xl px-1.5 py-px font-medium bg-sky-50 text-sky-600">
                  marketing
                </span>
              </div>
              <div>
                <h3 className="mb-1 font-bold">Sales preparation</h3>
                <p className="line-clamp-3 text-slate-500">
                  Prepare the email marketing software with templates for all possible responses.
                </p>
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
                  <span>September 2nd</span>
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
                  <span>15:15</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
