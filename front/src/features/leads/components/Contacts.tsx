import { FiLoader } from "react-icons/fi";
import { useState } from "react";
import { RiContactsBook3Line } from "react-icons/ri";
import { useContacts } from "../../../hooks/useContacts";
import { Contact } from "../../../interfaces/ContactInterface";

export const Contacts = ({ row }: { row: any }) => {
    const { data, isFetching, refetch } = useContacts(Number(row.id));

    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => setModalOpen(false);

    const handleGetContacts = async () => {
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
                    title="Ver Contactos"
                    onClick={async () => {
                        await handleGetContacts();
                        setModalOpen(true);
                    }}
                >
                    <RiContactsBook3Line className="text-blue-600" size={19} />
                    <span className="hidden sm:inline">Ver Contactos</span>
                </button>
            )}
            {modalOpen && data && (
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
                                Contactos
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
                            {data.map((contact: Contact, idx: number) => (
                                <div
                                    key={contact.id || idx}
                                    className="mb-6 rounded-lg bg-white p-4 border border-gray-200 shadow-sm text-left"
                                >
                                    <div className="space-y-4">
                                        {/* Basic info in a grid */}
                                        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                                            <div>
                                                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Enviado el</div>
                                                <div className="font-medium text-gray-800 truncate" title={new Date(contact.created_at).toLocaleString()}>{new Date(contact.created_at).toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Para</div>
                                                <div className="font-medium text-gray-800 truncate" title={contact.email}>{contact.email}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Asunto</div>
                                                <div className="font-medium bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-inner">{contact.phone}</div>
                                            </div>
                                        </div>
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
