// src/components/SuspectInteractionForm.jsx

import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { FiLoader } from "react-icons/fi";
import { IoMdSave } from "react-icons/io";
import { useState } from "react";
import { useInteractionCreate } from "../../../hooks/useInteractions";

interface SuspectInteractionInputs {
	description: string;
	suspect_id?: number;
}

export const SuspectInteractionForm = () => {
	const { id } = useParams();
	const createContact = useInteractionCreate(Number(id));
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			description: "",
		},
	});

	const onSubmit = async (data: SuspectInteractionInputs) => {
		setIsLoading(true);
		createContact.mutate(data, {
			onSuccess: () => {
				reset();
				toast.success("Comentario agregado exitosamente.");
				setIsLoading(false);
			},
		});
	};

	return (
		<div className="max-w-2xl mx-auto">
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<div className="px-5 py-4 border-b border-gray-100">
					<h3 className="text-lg font-medium text-gray-900">
						Agregar comentario
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						Registre notas o comentarios sobre este Lead.
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="p-5"
					autoComplete="off"
				>
					{/* Description */}
					<div className="w-full">
						<label
							className="block text-sm font-medium text-gray-700 mb-1"
							htmlFor="description"
						>
							Comentario
						</label>
						<div className="relative">
							<textarea
								id="description"
								placeholder="Escriba su comentario aquí..."
								className={`pl-2 pr-3 py-2 border border-gray-300 shadow-sm rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-300" : ""
									}`}
								{...register("description", {
									required: "La descripción es necesaria",
								})}
							/>
						</div>
						{errors.description && (
							<p className="mt-1 text-sm text-red-600">
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Submit Button */}
					<div className="mt-5 flex justify-end">
						{isLoading ? (
							<div className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-blue-600 hover:border-neutral-300 hover:text-blue-800 active:border-neutral-200 opacity-70 cursor-not-allowed">
								<FiLoader className="animate-spin h-4 w-4" />
								<span>Guardando...</span>
							</div>
						) : (
							<button
								className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-blue-600 hover:border-neutral-300 hover:text-blue-800 active:border-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
								title="Guardar comentario"
								type="submit"
							>
								<IoMdSave className="h-4 w-4" />
								<span>Guardar comentario</span>
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};
