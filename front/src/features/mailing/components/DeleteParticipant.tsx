import { useCampaignStore } from '../../../stores/campaignStore';
import { useDeleteParticipant } from '../../../hooks/useParticipants';
import { FaTrash } from 'react-icons/fa';

export const DeleteParticipant = ({ row, offset, limit }: { row: any, offset: number, limit: number }) => {
    const campaign = useCampaignStore((state) => state.campaign);

    const deleteParticipant = useDeleteParticipant(limit, offset);

    const handleDelete = (id:number) => {
        if (!campaign) return;
        deleteParticipant.mutate(id);
    }

    return (
        <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-red-600 hover:border-neutral-300 hover:text-red-800 active:border-neutral-200"
            title="Eliminar"
            onClick={() => { handleDelete(Number(row.id)) }}
        >
            <FaTrash />
            <span className="hidden sm:inline">Eliminar</span>
        </button>
    )
}
