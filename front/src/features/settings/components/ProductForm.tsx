import React from "react";
import { useForm } from "react-hook-form";
import { useCreateProduct } from "../../../hooks/useProducts";
import { useQueryClient } from "@tanstack/react-query";

type ProductFormInputs = {
	name: string;
	description: string;
	status: string;
};

const ProductForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProductFormInputs>();

	const {
		mutate: createProduct,
		isPending,
		isSuccess,
		isError,
		error
	} = useCreateProduct();

	const queryClient = useQueryClient();

	const onSubmit = (data: ProductFormInputs) => {
		data.status = "active";
		createProduct(data, {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["products"] });
				reset();
			},
		});
	};

	return (
		<div className="w-full max-w-4xl mx-auto mt-12 flex flex-col md:flex-row gap-8">
			<div className="flex-1 p-8">
				<h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
					Producto
				</h2>
				<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label
							htmlFor="product-name"
							className="block text-gray-700 font-medium mb-1"
						>
							Nombre del producto
						</label>
						<input
							id="product-name"
							type="text"
							className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : ""
								}`}
							placeholder="Nombre del producto"
							{...register("name", { required: "El nombre es obligatorio" })}
						/>
						{errors.name && (
							<span className="text-red-500 text-sm">{errors.name.message}</span>
						)}
					</div>
					<div>
						<label
							htmlFor="product-description"
							className="block text-gray-700 font-medium mb-1"
						>
							Descripción
						</label>
						<textarea
							id="product-description"
							className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : ""}
								}`}
							placeholder="Descripción del producto"
							{...register("description", { required: "La descripción es obligatoria" })}
						/>
						{errors.description && (
							<span className="text-red-500 text-sm">{errors.description.message}</span>
						)}
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
						disabled={isPending}
					>
						{isPending ? "Creando..." : "Crear producto"}
					</button>
					{isSuccess && (
						<div className="text-green-600 text-sm text-center mt-2">
							Producto creado exitosamente.
						</div>
					)}
					{isError && (
						<div className="text-red-600 text-sm text-center mt-2">
							{(error as Error).message}
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default ProductForm;
