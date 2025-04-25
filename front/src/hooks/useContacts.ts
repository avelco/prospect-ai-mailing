import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { Contact } from "../interfaces/ContactInterface";

const fetchContacts = async (suspect_id: number): Promise<Contact[]> => {
  const response = await api.get(`/contacts/${suspect_id}`, {
    headers: { accept: "application/json" },
  });
  return response.data;
};

export const useContacts = (suspect_id: number) => {
  return useQuery({
    queryKey: ["contacts", suspect_id],
    queryFn: () => fetchContacts(suspect_id),
    enabled: !!suspect_id,
  });
};

export const useContactCreate = (suspect_id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      await api.post(`/contacts`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", suspect_id],
      });
    },
  });
};
