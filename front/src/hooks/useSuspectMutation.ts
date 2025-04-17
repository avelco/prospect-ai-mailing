// hooks/useSuspectMutation.ts
import { useMutation } from "@tanstack/react-query";
import api from '../services/axios';

const uploadSuspectCSV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post('/upload-csv/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    const detail = error?.response?.data?.detail;
    throw new Error(detail || "Error al subir el archivo. Intenta de nuevo.");
  }
};

export function useSuspectMutation() {
  return useMutation({
    mutationFn: uploadSuspectCSV,
  });
}
