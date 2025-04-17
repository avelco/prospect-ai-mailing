import React from "react";
import { useProductDelete, useProducts } from "../../../hooks/useProducts";

export const ProductTable: React.FC = () => {
	const { data, isLoading, isError, error } = useProducts();
	const { mutate: deleteProduct, isPending } = useProductDelete();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-8">
				<span className="text-gray-500">Loading products...</span>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex justify-center items-center py-8">
				<span className="text-red-500">
					Error loading products: {error instanceof Error ? error.message : "Unknown error"}
				</span>
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className="flex justify-center items-center py-8">
				<span className="text-gray-500">No products found.</span>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto rounded-lg shadow">
			<table className="min-w-full divide-y divide-gray-200 bg-white">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
							Nombre
						</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
							Descripción
						</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
							Status
						</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
							Creado
						</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
							Actualizado
						</th>
						<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
							Acciones
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{data.map((product, idx) => (
						<tr key={idx} className="hover:bg-gray-50">
							<td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
								{product.name}
							</td>
							<td className="px-4 py-3 text-gray-700">{product.description}</td>
							<td className="px-4 py-3">
								<span
									className={`inline-block px-2 py-1 rounded text-xs font-semibold ${product.status === "active"
										? "bg-green-100 text-green-800"
										: "bg-red-100 text-red-800"
										}`}
								>
									{product.status}
								</span>
							</td>
							<td className="px-4 py-3 text-gray-500">
								{product.created_at.toLocaleDateString('es-ES')}
							</td>
							<td className="px-4 py-3 text-gray-500">
								{product.updated_at.toLocaleDateString('es-ES')}
							</td>
							<td className="px-4 py-3">
								<button
									type="button"
									className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50"
									onClick={() => deleteProduct(product.id)}
									disabled={isPending}
									title="Eliminar producto"
								>
									{isPending ? "Eliminando..." : "Eliminar"}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
};