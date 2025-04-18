// src/services/suspects.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SuspectResult } from '../interfaces/SuspectInterface';
import api from '../services/axios';

const fetchSuspects = async (
  limit: number,
  offset: number
): Promise<SuspectResult> => {
  const response = await api.get('/suspects', {
    params: { limit, offset },
    headers: { accept: 'application/json' },
  });
  return response.data;
};

export const useSuspects = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ['suspects', limit, offset],
    queryFn: () => fetchSuspects(limit, offset),
  });
};

export const useSuspectDelete = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			await api.delete(`/suspects/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["suspects"] });
		},
	});
};
