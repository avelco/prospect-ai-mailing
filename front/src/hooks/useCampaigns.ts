import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { CampaignResult } from "../interfaces/CampaignInterface";

type CampaignFormInputs = {
	name: string;
};

const createCampaign = async (data: CampaignFormInputs) => {
	try {
		const response = await api.post("/campaigns", data);
		return response.data;
	} catch (error: any) {
		const message =
			error.response?.data?.detail ||
			error.response?.data?.message ||
			error.message ||
			"Error al crear el campaigno";
		throw new Error(message);
	}
};

export function useCreateCampaign() {
	return useMutation({
		mutationFn: createCampaign,
	});
}

const fetchCampaigns = async (): Promise<CampaignResult[]> => {
	const response = await api.get("/campaigns", {
		headers: { accept: "application/json" },
	});
	return response.data.map((item: any) => ({
		...item,
		created_at: new Date(item.created_at),
		updated_at: new Date(item.updated_at),
	}));
};

export const useCampaigns = () => {
	return useQuery({
		queryKey: ["campaigns"],
		queryFn: () => fetchCampaigns(),
	});
};

export const useCampaignDelete = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			await api.delete(`/campaigns/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
		},
	});
};
