import { FaTrash } from 'react-icons/fa';
import { useDeleteDrafts } from '../../../hooks/useMailing';
import { useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';

export const DraftDelete = ({ row, offset, limit }: { row: any, offset: number, limit: number }) => {
    const deleteDrafts = useDeleteDrafts(limit, offset);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = (id: number) => {
        if (!deleteDrafts) return;
        setIsLoading(true);
        deleteDrafts.mutate(id,
            {
                onSuccess: () => {
                    toast.success("Borrador eliminado!");
                    setIsLoading(false);
                }
            }
        );
    }

    return (
        <>
            {isLoading ? (
                <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-blue-600 hover:border-neutral-300 hover:text-blue-800 active:border-neutral-200">
                    <FiLoader className="animate-spin" />
                    <span className="hidden sm:inline">Eliminando</span>
                </div>
            ) : (
                <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-red-600 hover:border-neutral-300 hover:text-red-800 active:border-neutral-200"
                    title="Eliminar"
                    onClick={() => { handleDelete(Number(row.id)) }}
                >
                    <FaTrash />
                    <span className="hidden sm:inline">Eliminar</span>
                </button>
            )}
        </>
    )
}
