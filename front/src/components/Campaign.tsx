import { useCampaigns } from '../hooks/useCampaigns';
import { useCampaignStore } from '../stores/campaignStore';

export const Campaign = () => {
    const { data: campaigns, isLoading } = useCampaigns();
    const campaign = useCampaignStore((state) => state.campaign);
    const setCampaign = useCampaignStore((state) => state.setCampaign);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCampaign(e.target.value);
    };

    return (
        <>
            {!isLoading && campaigns && campaigns.length > 0 && (
            <div className="px-4 pb-2">
            <label htmlFor="campaign-select" className="block text-xs font-semibold text-slate-600 mb-1">
                Seleccione Campaña
            </label>
            <select
                id="campaign-select"
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700 focus:border-blue-500 focus:outline-none"
                value={campaign ?? ""}
                onChange={handleChange}
            >
                {campaigns.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>
        </div>
            )}
        </>
    );
};
