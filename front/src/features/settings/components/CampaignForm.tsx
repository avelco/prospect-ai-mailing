import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateCampaign } from "../../../hooks/useCampaigns";
import { useProducts } from "../../../hooks/useProducts";

type CampaignFormInputs = {
	product_id: number;
	name: string;
	description: string;
	status: string;
};

const CampaignForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CampaignFormInputs>();
	const { data: products, isLoading, isError } = useProducts();
	const queryClient = useQueryClient();
	const {
		mutate: createCampaign,
		isPending,
		isSuccess,
		isError: isCreateError,
		error,
	} = useCreateCampaign();

	useEffect(() => {
		if (isSuccess) {
			reset();
			queryClient.invalidateQueries({ queryKey: ["campaigns"] });
		}
	}, [isSuccess, reset, queryClient]);

	const onSubmit = (data: CampaignFormInputs) => {
		const payload = {
			...data,
			status: "active"
		};
		createCampaign(payload);
	};

	return (
		<div className="w-full max-w-4xl mx-auto mt-12 flex flex-col md:flex-row gap-8">
			{/* Campaign Form */}
			<div className="flex-1 bg-white rounded-xl shadow p-8">
				<h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
					Campaña
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					<div>
						<label
							htmlFor="product_id"
							className="block text-gray-700 font-medium mb-1"
						>
							Producto
						</label>
						<select
							id="product_id"
							className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.product_id ? "border-red-500" : ""
								}`}
							{...register("product_id", {
								required: "El producto es obligatorio",
								valueAsNumber: true,
							})}
							disabled={isLoading || isError || isPending}
							defaultValue=""
						>
							<option value="" disabled>
								{isLoading
									? "Cargando productos..."
									: isError
										? "Error al cargar productos"
										: "Selecciona un producto"}
							</option>
							{products &&
								products.map((product) => (
									<option key={product.id || product.name} value={product.id}>
										{product.name}
									</option>
								))}
						</select>
						{errors.product_id && (
							<span className="text-red-500 text-sm">
								{errors.product_id.message}
							</span>
						)}
					</div>
					<div>
						<label
							htmlFor="campaign-name"
							className="block text-gray-700 font-medium mb-1"
						>
							Nombre de la campaña
						</label>
						<input
							id="campaign-name"
							type="text"
							className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : ""
								}`}
							placeholder="Ej: Black Friday"
							{...register("name", { required: "El nombre es obligatorio" })}
							disabled={isPending}
						/>
						{errors.name && (
							<span className="text-red-500 text-sm">
								{errors.name.message}
							</span>
						)}
					</div>
					<div>
						<label
							htmlFor="campaign-description"
							className="block text-gray-700 font-medium mb-1"
						>
							Descripción
						</label>
						<textarea
							id="campaign-description"
							className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : ""
								}`}
							placeholder="Describe la campaña"
							rows={3}
							{...register("description", {
								required: "La descripción es obligatoria",
							})}
							disabled={isPending}
						/>
						{errors.description && (
							<span className="text-red-500 text-sm">
								{errors.description.message}
							</span>
						)}
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
						disabled={isPending}
					>
						{isPending ? "Creando..." : "Crear campaña"}
					</button>
					{isSuccess && (
						<div className="text-green-600 text-sm text-center mt-2">
							Campaña creada exitosamente.
						</div>
					)}
					{isCreateError && (
						<div className="text-red-600 text-sm text-center mt-2">
							{error instanceof Error
								? error.message
								: "Ocurrió un error al crear la campaña."}
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default CampaignForm;
