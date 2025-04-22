import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { useCampaignStore } from "../stores/campaignStore";

export const useCreateDraft = (
	limit: number,
	offset: number,
	campaign: number
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			await api.post(`/mails/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["participants", limit, offset, campaign],
			});
		},
	});
};

export const useDeleteDrafts = (limit: number, offset: number) => {
	const campaign = useCampaignStore((state) => state.campaign);
	const queryClient = useQueryClient();

	if (!campaign) return null;

	return useMutation({
		mutationFn: async (id: number) => {
			await api.delete(`/mails/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["participants", limit, offset, campaign],
			});
		},
	});
};

export const useGetDrafts = (
	participant_id: number,
	options: { enabled?: boolean } = {}
) => {
	return useQuery({
		queryKey: ["drafts", participant_id],
		queryFn: async () => {
			const response = await api.get(`/mails/${participant_id}/drafts`);
			return response.data;
		},
		enabled: options.enabled !== undefined ? options.enabled : true,
		...options,
	});
};

export const useGetSentEmails = (
	participant_id: number,
	options: { enabled?: boolean } = {}
) => {
	return useQuery({
		queryKey: ["sentEmails", participant_id],
		queryFn: async () => {
			const response = await api.get(`/mails/${participant_id}/sent`);
			return response.data;
		},
		enabled: options.enabled !== undefined ? options.enabled : true,
		...options,
	});
};

export const useSendDraft = (
	limit: number,
	offset: number,
	campaign: number
) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			await api.post(`/mails/send/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["participants", limit, offset, campaign],
			});
		},
	});
};
