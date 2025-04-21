import { useSendDraft } from "../../../hooks/useMailing";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { BsSend } from "react-icons/bs";
import { toast } from "react-toastify";

export const DraftSend = ({ draft, offset, limit }: { draft: any, offset: number, limit: number }) => {
    
    const sendDraft = useSendDraft(draft, offset, limit);
    const [isLoading, setIsLoading] = useState(false);
    const handleSendDraft = () => {
        setIsLoading(true);
        sendDraft.mutate(Number(draft.id),
            {
                onSuccess: () => {
                    setIsLoading(false);
                    toast.success("Correo enviado!");
                },
                onError: (error) => {
                    console.log(error);
                    setIsLoading(false);
                    toast.error("Error al enviar el correo");
                }
            }
        );
    }

    return (
        <>
            {isLoading ? (
                <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-green-600 hover:border-neutral-300 hover:text-green-800 active:border-neutral-200">
                    <FiLoader className="animate-spin" />
                    <span className="hidden sm:inline">Enviando...</span>
                </div>
            ):(
            <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-green-600 hover:border-neutral-300 hover:text-green-800 active:border-neutral-200"
                title="Enviar"
                onClick={() => handleSendDraft()}
            >
                <BsSend />
                <span className="hidden sm:inline">Enviar correo</span>
            </button>
            )}
        </>
    )
}