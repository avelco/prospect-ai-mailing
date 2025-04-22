import { FiLoader } from "react-icons/fi";
import { RiUserStarLine } from "react-icons/ri";
import { useConvertIntoLead } from "../../../hooks/useLeads";
import { toast } from "react-toastify";
import { useState } from "react";

export const SentConvertIntoLead = ({ participant_id, offset, limit }: { participant_id: number, offset: number, limit: number }) => {
    const convertIntoLead = useConvertIntoLead(participant_id, offset, limit);
    const [isLoading, setIsLoading] = useState(false);
    const handleSendDraft = () => {
        setIsLoading(true);
        convertIntoLead.mutate(Number(participant_id),
            {
                onSuccess: () => {
                    setIsLoading(false);
                    toast.success("Convertido en Lead, ahora se encuentra en la lista de Leads");
                },
                onError: (error) => {
                    console.log(error);
                    setIsLoading(false);
                    toast.error("Error al convertir en Lead");
                }
            }
        );
    }

    return (
        <>
            {isLoading ? (
                <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-green-600 hover:border-neutral-300 hover:text-green-800 active:border-neutral-200">
                    <FiLoader className="animate-spin" />
                    <span className="hidden sm:inline">Convertiendo...</span>
                </div>
            ):(
            <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-green-600 hover:border-neutral-300 hover:text-green-800 active:border-neutral-200"
                title="Enviar"
                onClick={() => handleSendDraft()}
            >
                <RiUserStarLine className="text-green-600" size={19} />
                <span className="hidden sm:inline">Convertir en Lead</span>
            </button>
            )}
        </>
    )    
};
