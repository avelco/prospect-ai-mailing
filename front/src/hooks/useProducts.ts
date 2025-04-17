import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import { ProductResult } from "../interfaces/ProductInterface";

type ProductFormInputs = {
  name: string;
};

const createProduct = async (data: ProductFormInputs) => {
  try {
    const response = await api.post("/products", data);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Error al crear el producto";
    throw new Error(message);
  }
};

export function useCreateProduct() {
  return useMutation({
    mutationFn: createProduct,
  });
}

const fetchProducts = async (): Promise<ProductResult[]> => {
  const response = await api.get('/products', {
    headers: { accept: 'application/json' },
  });
  return response.data.map((item: any) => ({
    ...item,
    created_at: new Date(item.created_at),
    updated_at: new Date(item.updated_at),
  }));
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });
};


export const useProductDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
