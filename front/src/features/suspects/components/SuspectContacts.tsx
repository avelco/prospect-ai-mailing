// src/components/SuspectContacts.jsx

import { useState } from "react";
import {
	MdOutlineEmail,
	MdOutlinePhone,
	MdOutlineCalendarToday,
	MdOutlinePersonOutline,
	MdOutlineExpandMore,
	MdOutlineExpandLess,
	MdOutlineDelete,
	MdOutlineEdit,
} from "react-icons/md";
import { useParams } from "react-router";
import { useContacts } from "../../../hooks/useContacts";
import { LoaderSpinner } from "../../../components/LoaderSpinner";
import { CopyToClipboard } from "../../../components/CopyToClipboard";
import { IoMdContacts } from "react-icons/io";

export const SuspectContacts = () => {
	const { id } = useParams();
	const { data, isLoading } = useContacts(Number(id));
	const [expandedContact, setExpandedContact] = useState<number | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

	const handleDeleteClick = (e: React.MouseEvent, contactId: number) => {
		e.stopPropagation(); // Prevent triggering the expand/collapse
		setShowDeleteConfirm(contactId);
	};

	const handleDeleteConfirm = (e: React.MouseEvent, contactId: number) => {
		e.stopPropagation(); // Prevent triggering the expand/collapse
		// Implement actual delete functionality here
		console.log(`Deleting contact with ID: ${contactId}`);
		setShowDeleteConfirm(null);
		// After successful deletion, you would typically refetch the data
	};

	const handleDeleteCancel = (e: React.MouseEvent) => {
		e.stopPropagation(); // Prevent triggering the expand/collapse
		setShowDeleteConfirm(null);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-8">
				<LoaderSpinner />
			</div>
		);
	}

	if (!data) {
		return (
			<div className="py-6 text-center text-red-500 bg-red-50 rounded-lg">
				<p className="font-medium">No se pudieron cargar los detalles de contacto</p>
				<p className="text-sm mt-1">Intente nuevamente más tarde</p>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="py-8 text-center">
				<MdOutlinePersonOutline className="mx-auto h-12 w-12 text-gray-300" />
				<p className="mt-2 text-gray-500 font-medium">
					No hay contactos adicionales registrados
				</p>
			</div>
		);
	}

	const toggleExpand = (index: number) => {
		setExpandedContact(expandedContact === index ? null : index);
	};

	return (
			<div className="space-y-4 py-4">
				<div className="flex items-center mb-6 px-2">
					<div className="flex items-center gap-3">
						<IoMdContacts className="h-6 w-6 text-indigo-600" />
						<h2 className="text-xl font-semibold text-gray-900">Contactos</h2>
					</div>
					<span className="ml-2 mt-1 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
						{data.length} {data.length === 1 ? "contacto" : "contactos"}
					</span>
				</div>
			{data.map((contact, index) => (
				<div
					key={index}
					className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
				>
					{/* Desktop view - always visible */}
					<div className="hidden md:flex items-center p-4">
						<div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mr-4">
							<span className="text-indigo-600 font-medium">
								{contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
							</span>
						</div>

						<div className="flex-1 min-w-0 mr-4">
							<h3 className="text-gray-900 font-medium">
								{contact.name || (
									<span className="text-gray-400">Sin nombre</span>
								)}
							</h3>
						</div>

						<div className="flex items-center gap-6">
							{contact.email && (
								<div className="flex items-center gap-2">
									<MdOutlineEmail className="h-5 w-5 text-gray-400" />
									<span className="text-gray-600 text-sm">{contact.email}</span>
									<CopyToClipboard
										textToCopy={contact.email}
										tooltip="Copiar email"
									/>
								</div>
							)}

							{contact.phone && (
								<div className="flex items-center gap-2">
									<MdOutlinePhone className="h-5 w-5 text-gray-400" />
									<span className="text-gray-600 text-sm">{contact.phone}</span>
									<CopyToClipboard
										textToCopy={contact.phone}
										tooltip="Copiar teléfono"
									/>
								</div>
							)}

							{contact.created_at && (
								<div className="flex items-center gap-2">
									<MdOutlineCalendarToday className="h-5 w-5 text-gray-400" />
									<span className="text-gray-600 text-sm">
										{new Date(contact.created_at).toLocaleDateString()}
									</span>
								</div>
							)}

							{/* Action buttons */}
							<div className="flex items-center ml-2">
								<button
									className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
									title="Editar contacto"
									onClick={(e) => e.stopPropagation()}
								>
									<MdOutlineEdit className="h-5 w-5" />
								</button>

								{showDeleteConfirm === contact.id ? (
									<div className="flex items-center ml-1 bg-gray-100 rounded-lg p-1">
										<span className="text-xs text-gray-700 mr-2">¿Eliminar?</span>
										<button
											className="p-1 text-green-600 hover:bg-green-50 rounded-full"
											onClick={(e) => handleDeleteConfirm(e, contact.id)}
										>
											Sí
										</button>
										<button
											className="p-1 text-red-600 hover:bg-red-50 rounded-full"
											onClick={handleDeleteCancel}
										>
											No
										</button>
									</div>
								) : (
									<button
										className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
										title="Eliminar contacto"
										onClick={(e) => handleDeleteClick(e, contact.id)}
									>
										<MdOutlineDelete className="h-5 w-5" />
									</button>
								)}
							</div>
						</div>
					</div>

					{/* Mobile view - collapsible */}
					<div className="md:hidden">
						<div
							className="flex items-center justify-between p-4 cursor-pointer"
							onClick={() => toggleExpand(index)}
						>
							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mr-3">
									<span className="text-indigo-600 font-medium">
										{contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
									</span>
								</div>
								<div>
									<h3 className="text-gray-900 font-medium">
										{contact.name || (
											<span className="text-gray-400">Sin nombre</span>
										)}
									</h3>
									{contact.email && (
										<p className="text-gray-500 text-sm truncate max-w-[200px]">
											{contact.email}
										</p>
									)}
								</div>
							</div>

							<div className="flex items-center">
								{showDeleteConfirm === contact.id ? (
									<div className="flex items-center mr-2 bg-gray-100 rounded-lg p-1">
										<span className="text-xs text-gray-700 mr-1">¿Eliminar?</span>
										<button
											className="p-1 text-green-600 hover:bg-green-50 rounded-full"
											onClick={(e) => handleDeleteConfirm(e, contact.id)}
										>
											Sí
										</button>
										<button
											className="p-1 text-red-600 hover:bg-red-50 rounded-full"
											onClick={handleDeleteCancel}
										>
											No
										</button>
									</div>
								) : (
									<>
										<button
											className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors mr-1"
											title="Eliminar contacto"
											onClick={(e) => handleDeleteClick(e, contact.id)}
										>
											<MdOutlineDelete className="h-5 w-5" />
										</button>
										<button
											className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors mr-1"
											title="Editar contacto"
											onClick={(e) => e.stopPropagation()}
										>
											<MdOutlineEdit className="h-5 w-5" />
										</button>
									</>
								)}

								{expandedContact === index ? (
									<MdOutlineExpandLess className="h-6 w-6 text-gray-400" />
								) : (
									<MdOutlineExpandMore className="h-6 w-6 text-gray-400" />
								)}
							</div>
						</div>

						{expandedContact === index && (
							<div className="px-4 pb-4 space-y-3 transition-all duration-200 ease-in-out">
								{contact.email && (
									<div className="flex items-center">
										<MdOutlineEmail className="h-5 w-5 text-gray-400 mr-3" />
										<span className="text-gray-600 text-sm flex-1">
											{contact.email}
										</span>
										<CopyToClipboard
											textToCopy={contact.email}
											tooltip="Copiar email"
										/>
									</div>
								)}

								{contact.phone && (
									<div className="flex items-center">
										<MdOutlinePhone className="h-5 w-5 text-gray-400 mr-3" />
										<span className="text-gray-600 text-sm flex-1">
											{contact.phone}
										</span>
										<CopyToClipboard
											textToCopy={contact.phone}
											tooltip="Copiar teléfono"
										/>
									</div>
								)}

								{contact.created_at && (
									<div className="flex items-center">
										<MdOutlineCalendarToday className="h-5 w-5 text-gray-400 mr-3" />
										<span className="text-gray-600 text-sm">
											{new Date(contact.created_at).toLocaleDateString()}
										</span>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
};
