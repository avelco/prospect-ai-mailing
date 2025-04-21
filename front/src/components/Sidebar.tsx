import React from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { TbMoodSearch, TbUserQuestion } from "react-icons/tb";
import { FaRegHandshake } from "react-icons/fa";
import { RiUserStarLine } from "react-icons/ri";
import { Campaign } from "./Campaign";
import { useSessionStore } from "../stores/authStore";
import { FaUsersBetweenLines } from "react-icons/fa6";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (to: string) => location.pathname.startsWith(to);

    return (
        <nav
            className={`fixed start-0 top-0 bottom-0 z-50 flex h-full w-80 flex-col border-slate-200 bg-white
        transition-transform duration-500 ease-out lg:w-64 lg:border-blue-900/10 ltr:border-r-8 lg:ltr:translate-x-0
        rtl:border-l-8 lg:rtl:translate-x-0 ${open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
                }`}
            aria-label="Main Sidebar Navigation"
        >
            {/* Sidebar Header */}
            <div className="flex h-20 w-full flex-none items-center justify-between ps-5 pe-4">
                {/* Brand */}
                <Link
                    to="/suspects"
                    className="inline-flex items-center gap-2 text-lg font-bold tracking-wide text-slate-800 hover:opacity-75 active:opacity-100"
                >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                        <TbMoodSearch className="inline-block size-5" />                        
                    </div>
                    <span>
                        Prospect<span className="text-blue-600">AI</span>
                    </span>
                </Link>
                {/* Close Sidebar on Mobile */}
                <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-lg bg-slate-100 leading-6 font-semibold text-slate-800 hover:bg-slate-200 lg:hidden"
                    onClick={onClose}
                >
                    <svg
                        className="hi-solid hi-x -mx-1 inline-block size-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {/* Campaign Select */}
            <Campaign />

            {/* Main Navigation */}
            <div className="w-full grow space-y-2 overflow-auto p-4">
                <Link
                    to="/suspects"
                    className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm
                font-medium transition ${isActive("/suspects")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-800 hover:bg-blue-50 active:text-slate-950"
                        }`}
                >
                    <TbUserQuestion
                        className={`inline-block size-5 ${isActive("/suspects")
                                ? "text-blue-600"
                                : "text-slate-300 group-hover:text-blue-600"
                            }`}
                    />
                    <span className="grow">Suspects</span>
                </Link>
                <Link
                    to="/participants"
                    className="group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-800 hover:bg-blue-50 active:text-slate-950"
                >
                    <FaUsersBetweenLines
                        className={`inline-block size-5 ${isActive("/participants")
                                ? "text-blue-600"
                                : "text-slate-300 group-hover:text-blue-600"
                            }`}
                    />
                    <span className="grow">Participantes</span>
                </Link>
                <Link
                    to="/leads"
                    className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm
                font-medium transition ${isActive("/leads")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-800 hover:bg-blue-50 active:text-slate-950"
                        }`}
                >
                    <RiUserStarLine
                        className={`inline-block size-5 ${isActive("/leads")
                                ? "text-blue-600"
                                : "text-slate-300 group-hover:text-blue-600"
                            }`}
                    />
                    <span className="grow">Leads</span>
                </Link>
                <Link
                    to="/deals"
                    className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm
                font-medium transition ${isActive("/deals")
                            ? "bg-blue-100 text-blue-700"
                            : "text-slate-800 hover:bg-blue-50 active:text-slate-950"
                        }`}
                >
                    <FaRegHandshake
                        className={`inline-block size-5 ${isActive("/deals")
                                ? "text-blue-600"
                                : "text-slate-300 group-hover:text-blue-600"
                            }`}
                    />
                    <span className="grow">Tratos</span>
                </Link>
            </div>

            {/* Sub Navigation */}
            <div className="w-full flex-none space-y-2 p-4">
                <span className="group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-800 hover:bg-blue-50 active:text-slate-950">
                    <svg
                        className="hi-mini hi-cog-8-tooth inline-block size-5 text-slate-300 group-hover:text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 01.804.98v1.361a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.294 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.294A1 1 0 011 10.68V9.32a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.03l1.25.834a6.957 6.957 0 011.416-.587l.294-1.473zM13 10a3 3 0 11-6 0 3 3 0 016 0z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                    <Link to="settings" className="grow">
                        Settings
                    </Link>
                </span>
                <Link
                    to="/mailing"
                    className="group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-800 hover:bg-blue-50 active:text-slate-950"
                >
                    <svg
                        className="hi-mini hi-arrow-left-on-rectangle inline-block size-5 text-slate-300 group-hover:text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                            clipRule="evenodd"
                        ></path>
                        <path
                            fillRule="evenodd"
                            d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                    <span
                        className="grow"
                        onClick={() => {
                            useSessionStore.getState().clearSession();
                            navigate("/login");
                        }}
                    >
                        Sign Out
                    </span>
                </Link>
            </div>
        </nav>
    );
};

export default Sidebar;
