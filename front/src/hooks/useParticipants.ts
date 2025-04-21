import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { ParticipantResult } from "../interfaces/ParticipantInterface";
import { useCampaignStore } from "../stores/campaignStore";



type AddParticipantInputs = {
	campaign_id: number;
	suspect_id: number;
	status: string;
};


const fetchParticipants = async (limit: number, offset: number, campaign: string): Promise<ParticipantResult> => {
	const response = await api.get(`/participants/${campaign}/participants`, {
		params: { limit, offset },
		headers: { accept: "application/json" },
	});
	return response.data;
};

export const useParticipants = (limit: number, offset: number) => {
	const campaign = useCampaignStore((state) => state.campaign);
	return useQuery({
		queryKey: ["participants", limit, offset, campaign],
		queryFn: () => fetchParticipants(limit, offset, campaign!),
		enabled: !!campaign
	});
};

const fetchParticipantsWithDrafts = async (limit: number, offset: number, campaign: string): Promise<ParticipantResult> => {
	const response = await api.get(`/participants/${campaign}/drafts`, {
		params: { limit, offset },
		headers: { accept: "application/json" },
	});
	return response.data;
};

export const useParticipantsWithDrafts = (limit: number, offset: number) => {
	const campaign = useCampaignStore((state) => state.campaign);
	return useQuery({
		queryKey: ["participantsWithDrafts", limit, offset, campaign],
		queryFn: () => fetchParticipantsWithDrafts(limit, offset, campaign!),
		enabled: !!campaign
	});
};

const fetchParticipantsWithMail = async (limit: number, offset: number, campaign: string): Promise<ParticipantResult> => {
	const response = await api.get(`/participants/${campaign}/mails`, {
		params: { limit, offset },
		headers: { accept: "application/json" },
	});
	return response.data;
};

export const useParticipantsWithMail = (limit: number, offset: number) => {
	const campaign = useCampaignStore((state) => state.campaign);
	return useQuery({
		queryKey: ["participantsWithEmail", limit, offset, campaign],
		queryFn: () => fetchParticipantsWithMail(limit, offset, campaign!),
		enabled: !!campaign
	});
};


export const useDeleteParticipant = (limit: number, offset: number) => {
	const campaign = useCampaignStore((state) => state.campaign);
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			await api.delete(`/participants/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["participants", limit, offset, campaign] });
		},
	});
};

export const useAddParticipant = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: AddParticipantInputs) => {
			await api.post(`/participants`, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["participants"] });
		},
	});
};
