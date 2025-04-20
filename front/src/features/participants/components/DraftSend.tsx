import { useCreateDraft } from "../../../hooks/useMailing";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { BsSend } from "react-icons/bs";

export const DraftSend = ({ row, offset, limit }: { row: any, offset: number, limit: number }) => {
    
    const createDraft = useCreateDraft(row, offset, limit);
    const [isLoading, setIsLoading] = useState(false);
    const handleCreateDraft = () => {
        console.log('executing')
        setIsLoading(true);
        createDraft.mutate(Number(row.id),
            {
                onSuccess: () => {
                    setIsLoading(false);
                }
            }
        );
    }

    return (
        <>
            {isLoading ? (
                <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-green-600 hover:border-neutral-300 hover:text-green-800 active:border-neutral-200">
                    <FiLoader className="animate-spin" />
                    <span className="hidden sm:inline">...</span>
                </div>
            ):(
            <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-green-600 hover:border-neutral-300 hover:text-green-800 active:border-neutral-200"
                title="Enviar"
                onClick={() => handleCreateDraft()}
            >
                <BsSend />
                <span className="hidden sm:inline">Enviar</span>
            </button>
            )}
        </>
    )
}