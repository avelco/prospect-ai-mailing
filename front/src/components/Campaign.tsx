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
                <div className="relative">
                    <select
                        name="campaign"
                        id="campaign"
                        className="block w-64 appearance-none px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                        value={campaign ?? ""}
                        onChange={handleChange}
                    >
                        <option value="">Campañas</option>
                        {campaigns.map((campaign) => (
                            <option key={campaign.id} value={campaign.id}>
                                {campaign.name}
                            </option>
                        ))}
                    </select>
                    {/* Custom arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                        <svg
                            className="h-4 w-4 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            <path
                                d="M7 8l3 3 3-3"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            )}
        </>
    );
};
