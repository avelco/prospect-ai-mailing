import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { Interaction } from "../interfaces/InteractionInterface";
import { useCampaignStore } from "../stores/campaignStore";

const fetchInteractions = async (
  suspect_id: number,
  campaign_id: number
): Promise<Interaction[]> => {
  const response = await api.get(
    `/participants/${suspect_id}/interactions/${campaign_id}`,
    {
      headers: { accept: "application/json" },
    }
  );
  return response.data;
};

export const useInteractions = (suspect_id: number) => {
  const campaign_id = useCampaignStore((state) => state.campaign);
  return useQuery({
    queryKey: ["interactions", suspect_id, campaign_id],
    queryFn: () => fetchInteractions(suspect_id, Number(campaign_id)),
    enabled: !!suspect_id && !!campaign_id,
  });
};

export const useInteractionCreate = (suspect_id: number) => {
  const queryClient = useQueryClient();
  const campaign_id = useCampaignStore((state) => state.campaign);

  return useMutation({
    mutationFn: async (payload: any) => {
      await api.post(`/participants/${suspect_id}/interactions/${campaign_id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interactions", suspect_id, campaign_id],
      });
    },
  });
};
