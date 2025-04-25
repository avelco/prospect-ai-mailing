// src/components/SuspectDetail.jsx

import {
	MdOutlineEmail,
	MdOutlinePhone,
	MdOutlineLocationOn,
	MdOutlineEdit,
} from "react-icons/md";
import { useSuspect } from "../../../hooks/useSuspect";
import { LoaderSpinner } from "../../../components/LoaderSpinner";
import { CopyToClipboard } from "../../../components/CopyToClipboard";

export const SuspectDetail = () => {
	const { data, isLoading } = useSuspect();
	// Improved Loading State
	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-8">
				<LoaderSpinner />
			</div>
		);
	}

	// Handle case where data might not be available after loading
	if (!data) {
		return (
			<div className="py-6 text-center text-red-500 bg-red-50 rounded-lg">
				<p className="font-medium">No se pudieron cargar los detalles del prospecto</p>
				<p className="text-sm mt-1">Intente nuevamente más tarde</p>
			</div>
		);
	}


	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden my-2 mx-3">
			<div className="p-5">
				{/* Header with name and status */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex-1">
						<div className="flex items-center">
							<div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mr-4">
								<span className="text-indigo-600 font-medium text-lg">
									{data.name ? data.name.charAt(0).toUpperCase() : "?"}
								</span>
							</div>
							<div>
								<h2 className="text-xl font-semibold text-gray-900">{data.name}</h2>
							</div>
						</div>
					</div>

					<div className="flex items-center">
						<button
							className="ml-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
							title="Editar prospecto"
						>
							<MdOutlineEdit className="h-5 w-5" />
						</button>
					</div>
				</div>

				{/* Primary contact information */}
				<div className="bg-gray-50 rounded-lg p-4 mb-4">
					<h3 className="text-sm font-medium text-gray-500 mb-3">Información de contacto</h3>
					<div className="space-y-3">
						{data.email && (
							<div className="flex items-center">
								<MdOutlineEmail className="h-5 w-5 text-gray-400 mr-3" />
								<span className="text-gray-700 flex-1">{data.email}</span>
								<CopyToClipboard
									textToCopy={data.email}
									tooltip="Copiar email"
								/>
							</div>
						)}

						{data.phone && (
							<div className="flex items-center">
								<MdOutlinePhone className="h-5 w-5 text-gray-400 mr-3" />
								<span className="text-gray-700 flex-1">{data.phone}</span>
								<CopyToClipboard
									textToCopy={data.phone}
									tooltip="Copiar teléfono"
								/>
							</div>
						)}

						{(data.city || data.country) && (
							<div className="flex items-center">
								<MdOutlineLocationOn className="h-5 w-5 text-gray-400 mr-3" />
								<span className="text-gray-700">
									{[data.city, data.country].filter(Boolean).join(", ")}
								</span>
							</div>
						)}
					</div>
				</div>

			</div>

			{/* Footer with metadata */}
			{(data.created_at || data.updated_at) && (
				<div className="border-t border-gray-100 px-5 py-3 bg-gray-50 text-xs text-gray-500">
					<div className="flex flex-wrap gap-x-4 gap-y-1">
						{data.created_at && (
							<span>
								Creado: {new Date(data.created_at).toLocaleDateString()}
							</span>
						)}
						{data.updated_at && (
							<span>
								Actualizado: {new Date(data.updated_at).toLocaleDateString()}
							</span>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
