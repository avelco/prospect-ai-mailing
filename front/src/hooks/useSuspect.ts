// src/services/suspects.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Suspect, SuspectResult } from "../interfaces/SuspectInterface";
import api from "../services/axios";
import { useCampaignStore } from "../stores/campaignStore";
import { useParams } from "react-router";
import { useSuspectsPaginationStore } from "../stores/pagination/paginationSuspectsStore";

const fetchSuspects = async (
  limit: number,
  offset: number,
  campaign: string
): Promise<SuspectResult> => {
  	const response = await api.get(`/suspects/${campaign}`, {
    params: { limit, offset },
    headers: { accept: "application/json" },
  });
  return response.data;
};

export const useSuspects = () => {
	const campaign = useCampaignStore((state) => state.campaign);
	const limit = useSuspectsPaginationStore((state) => state.limit);
  const offset = useSuspectsPaginationStore((state) => state.offset);

	return useQuery({
		queryKey: ["suspects", limit, offset, campaign],
		queryFn: () => fetchSuspects(limit, offset, campaign!),
		enabled: !!campaign
	});
};

export const useSuspectDelete = () => {
  const campaign = useCampaignStore((state) => state.campaign);
  const limit = useSuspectsPaginationStore((state) => state.limit);
  const offset = useSuspectsPaginationStore((state) => state.offset);

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/suspects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suspects", limit, offset, campaign] });
    },
  });
};


const fetchSuspect = async (id: number): Promise<Suspect> => {
  	const response = await api.get(`/suspects/${id}/company-info`, {
    headers: { accept: "application/json" },
  });
  return response.data;
};

export const useSuspect = () => {
	const id = useParams().id;
	return useQuery({
		queryKey: ["suspect", id],
		queryFn: () => fetchSuspect(Number(id)),
		enabled: !!id
	});
};
