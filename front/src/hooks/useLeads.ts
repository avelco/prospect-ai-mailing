import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCampaignStore } from "../stores/campaignStore";
import api from "../services/axios";
import { LeadResult } from "../interfaces/LeadInterface";

const fetchLeads = async (
  limit: number,
  offset: number,
  campaign: string
): Promise<LeadResult> => {
  const response = await api.get(`/participants/${campaign}/leads`, {
    params: { limit, offset },
    headers: { accept: "application/json" },
  });
  return response.data;
};

export const useLeads = (limit: number, offset: number) => {
  const campaign = useCampaignStore((state) => state.campaign);
  return useQuery({
    queryKey: ["leads", limit, offset, campaign],
    queryFn: () => fetchLeads(limit, offset, campaign!),
    enabled: !!campaign,
  });
};



export const useConvertIntoLead = (
	limit: number,
	offset: number,
	campaign: number
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (participant_id: number) => {
			await api.post(`/participants/${participant_id}/to-lead`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["participantsWithEmail", limit, offset, campaign],
			});
		},
	});
};
