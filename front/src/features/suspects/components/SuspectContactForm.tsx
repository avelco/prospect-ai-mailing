// src/components/SuspectContactForm.jsx

import { useForm } from "react-hook-form";
import {
	MdOutlineEmail,
	MdOutlinePhone,
	MdOutlinePerson,
} from "react-icons/md";
import { useContactCreate } from "../../../hooks/useContacts";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { FiLoader } from "react-icons/fi";
import { useState } from "react";
import { IoMdSave } from "react-icons/io";

interface SuspectContactInputs {
	name: string;
	email: string;
	phone: string;
	suspect_id?: number;
}

export const SuspectContactForm = () => {
	const { id } = useParams();
	const createContact = useContactCreate(Number(id));
	const [isLoading, setIsLoading] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
			phone: "",
		},
	});

	const onSubmit = async (data: SuspectContactInputs) => {
		setIsLoading(true);
		const payload = {
			...data,
			suspect_id: Number(id),
		};
		createContact.mutate(payload, {
			onSuccess: () => {
				reset();
				toast.success("Contacto creado exitosamente.");
				setIsLoading(false);
			},
		});
	};

	return (
		<div className="max-w-5xl mx-auto">
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<div className="px-5 py-4 border-b border-gray-100">
					<h3 className="text-lg font-medium text-gray-900">
						Agregar contacto
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						Registre un nuevo contacto para este Lead.
					</p>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="p-4"
					autoComplete="off"
				>
					<div className="flex flex-col md:flex-row items-end gap-3">
						{/* Name */}
						<div className="w-full md:w-1/4">
							<label
								className="block text-xs font-medium text-gray-700 mb-1"
								htmlFor="name"
							>
								Nombre
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<MdOutlinePerson className="text-gray-400 h-5 w-5" />
								</div>
								<input
									id="name"
									type="text"
									placeholder="Nombre"
									className={`pl-10 pr-3 py-2 border border-gray-300 shadow-sm rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-300" : ""
										}`}
									{...register("name", { required: "El nombre es necesario" })}
								/>
							</div>
							{errors.name && (
								<p className="mt-1 text-xs text-red-600">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Email */}
						<div className="w-full md:w-1/3">
							<label
								className="block text-xs font-medium text-gray-700 mb-1"
								htmlFor="email"
							>
								Email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<MdOutlineEmail className="text-gray-400 h-5 w-5" />
								</div>
								<input
									id="email"
									type="email"
									placeholder="correo@ejemplo.com"
									className={`pl-10 pr-3 py-2 border border-gray-300 shadow-sm rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-300" : ""
										}`}
									{...register("email", {
										required: "El email es necesario",
										pattern: {
											value: /^\S+@\S+$/i,
											message: "Formato de email inválido",
										},
									})}
								/>
							</div>
							{errors.email && (
								<p className="mt-1 text-xs text-red-600">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Phone */}
						<div className="w-full md:w-1/4">
							<label
								className="block text-xs font-medium text-gray-700 mb-1"
								htmlFor="phone"
							>
								Teléfono
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<MdOutlinePhone className="text-gray-400 h-5 w-5" />
								</div>
								<input
									id="phone"
									type="tel"
									placeholder="+1 (555) 123-4567"
									className={`pl-10 pr-3 py-2 border border-gray-300 shadow-sm rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? "border-red-300" : ""
										}`}
									{...register("phone", {
										required: "El teléfono es necesario",
										pattern: {
											value: /^[0-9+\-\s()]{7,}$/,
											message: "Formato de teléfono inválido",
										},
									})}
								/>
							</div>
							{errors.phone && (
								<p className="mt-1 text-xs text-red-600">
									{errors.phone.message}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<div className="w-full md:w-auto md:self-end">
							{isLoading ? (
								<button
									disabled
									className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-blue-600 hover:border-neutral-300 hover:text-blue-800 opacity-70 cursor-not-allowed"
								>
									<FiLoader className="animate-spin h-4 w-4" />
									<span>Creando...</span>
								</button>
							) : (
								<button
									className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-blue-600 hover:border-neutral-300 hover:text-blue-800 active:border-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mb-1"
									title="Agregar contacto"
									type="submit"
								>
									<IoMdSave className="h-4 w-4" />
									<span>Agregar</span>
								</button>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};
