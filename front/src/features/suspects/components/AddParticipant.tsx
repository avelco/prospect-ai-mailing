import { IoAdd } from 'react-icons/io5'
import { useCampaignStore } from '../../../stores/campaignStore';
import { useAddParticipant } from '../../../hooks/useParticipants';
import { useQueryClient } from '@tanstack/react-query';

export const AddParticipant = ({ row, offset, limit }: { row: any, offset: number, limit: number }) => {
    const campaign = useCampaignStore((state) => state.campaign);
    const queryClient = useQueryClient();

    const addParticipant = useAddParticipant();

    const handleConvertion = () => {
        if (!campaign) return;
        addParticipant.mutate({
            campaign_id: Number(campaign),
            suspect_id: row.id,
            status: 'nuevo'
        }, {
            onSuccess: () => {
                console.log(limit, offset, campaign);
                queryClient.invalidateQueries({
                    queryKey: ['suspects', limit, offset, campaign],
                });
            }
        });

    }
    
    return (
        <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-green-600 hover:border-neutral-300 hover:text-green-800 active:border-neutral-200"
            title="Agregar"
            onClick={handleConvertion}
        >
            <IoAdd />
            <span className="hidden sm:inline">Agregar</span>
        </button>
    )
}
