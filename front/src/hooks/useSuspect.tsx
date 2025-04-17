// src/services/suspects.ts
import { useQuery } from '@tanstack/react-query';
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
