// src/stores/campaignStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CampaignState {
    campaign: string | null;
    setCampaign: (campaign: string) => void;
    clearCampaign: () => void;
}

export const useCampaignStore = create<CampaignState>()(
    persist(
        (set) => ({
            campaign: null,
            setCampaign: (campaign) => set({ campaign }),
            clearCampaign: () => set({ campaign: null }),
        }),
        {
            name: "campaign",
        }
    )
);
