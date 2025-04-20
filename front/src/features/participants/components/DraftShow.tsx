import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { useGetDrafts } from "../../../hooks/useMailing";

export const DraftShow = ({ row }: { row: any }) => {
    
    const {
        data,
        isFetching,
        refetch,
      } = useGetDrafts(Number(row.id), { enabled: false });

    
      const handleGetDrafts = async () => {
        try {
          await refetch();
        } finally {
        }
      };

      console.log(data);
    return (
        <>
            {isFetching ? (
                <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-blue-600 hover:border-neutral-300 hover:text-blue-800 active:border-neutral-200">
                    <FiLoader className="animate-spin" />
                    <span className="hidden sm:inline">...</span>
                </div>
            ):(
            <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-blue-600 hover:border-neutral-300 hover:text-blue-800 active:border-neutral-200"
                title="Crear"
                onClick={() => handleGetDrafts()}
            >
                <FaRegEye />
                <span className="hidden sm:inline">Borrador</span>
            </button>
            )}
        </>
    )
}