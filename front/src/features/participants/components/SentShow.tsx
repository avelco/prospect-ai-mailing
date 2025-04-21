import { FiLoader } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { useGetDrafts } from "../../../hooks/useMailing";
import { useState } from "react";
import { DraftSend } from "./DraftSend";

export const SentShow = ({ row, offset, limit }: { row: any, offset: number, limit: number }) => {
    const { data, isFetching, refetch } = useGetDrafts(Number(row.id), {
        enabled: false,
    });

    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => setModalOpen(false);

    const handleGetDrafts = async () => {
        try {
            await refetch();
        } finally {
        }
    };

    return (
        <>
            {isFetching ? (
                <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-blue-600 hover:border-neutral-300 hover:text-blue-800 active:border-neutral-200">
                    <FiLoader className="animate-spin" />
                    <span className="hidden sm:inline">...</span>
                </div>
            ) : (
                <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-blue-600 hover:border-neutral-300 hover:text-blue-800 active:border-neutral-200"
                    title="Ver borrador"
                    onClick={async () => {
                        await handleGetDrafts();
                        setModalOpen(true);
                    }}
                >
                    <FaRegEye />
                    <span className="hidden sm:inline">Ver Enviados</span>
                </button>
            )}
            {modalOpen && data?.length > 0 && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-end backdrop-blur-sm bg-black/40 transition-all duration-300"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleCloseModal();
                    }}
                >
                    <div
                        className="bg-white rounded-l-xl shadow-2xl w-full max-w-[50%] h-screen overflow-y-auto border-l border-gray-200 animate-slide-in-right transition-transform duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800">
                                Información del Borrador
                            </h2>
                            <button
                                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                onClick={handleCloseModal}
                                aria-label="Cerrar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {data.map((draft: any, idx: number) => (
                                <div
                                    key={draft.id || idx}
                                    className="mb-6 rounded-lg bg-white p-4 border border-gray-200 shadow-sm text-left"
                                >
                                    <div className="space-y-4">
                                        {/* Basic info in a grid */}
                                        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                                            <div>
                                                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Para</div>
                                                <div className="font-medium text-gray-800 truncate" title={draft.to}>{draft.to}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Asunto</div>
                                                <div className="font-medium bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-inner">{draft.subject}</div>
                                            </div>
                                        </div>

                                        {/* Email content in a card with email styling */}
                                        <div className="mt-4">
                                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">Contenido</div>
                                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-inner">
                                                <div className="prose prose-sm max-w-none">
                                                    {draft.body.split('\n').map((paragraph: string, i: number) => {
                                                        // Handle bullet points
                                                        if (paragraph.trim().startsWith('*')) {
                                                            return (
                                                                <ul key={i} className="list-disc pl-5 my-2">
                                                                    <li className="text-gray-700">{paragraph.trim().substring(1).trim()}</li>
                                                                </ul>
                                                            );
                                                        }

                                                        // Handle empty lines as spacing
                                                        if (paragraph.trim() === '') {
                                                            return <div key={i} className="h-2"></div>;
                                                        }

                                                        // Regular paragraphs
                                                        return (
                                                            <p key={i} className="text-gray-700 mb-2">
                                                                {paragraph}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <DraftSend draft={draft} offset={offset} limit={limit} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
