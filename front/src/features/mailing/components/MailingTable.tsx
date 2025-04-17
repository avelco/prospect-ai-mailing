import { useState } from "react";
import {
	FaTrash,
	FaEdit,
	FaCog,
	FaCheckCircle,
	FaRegCircle,
} from "react-icons/fa";
import { useSuspects } from "../../../hooks/useSuspect";

const MailingTable = () => {
	const [checked, setChecked] = useState<Set<string>>(new Set());
	const [limit, setLimit] = useState(10);
	const [offset, setOffset] = useState(0);

	const { data, isLoading, error } = useSuspects(limit, offset);

	const isChecked = (id: string) => checked.has(id);

	const handleCheck = (id: string) => {
		setChecked((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const handleCheckAll = () => {
		if (checked.size === data?.suspects.length) {
			setChecked(new Set());
		} else {
			setChecked(new Set(data?.suspects.map((row) => row.identification)));
		}
	};

	// Pagination logic
	const total = data?.total || 0;
	const pages = Math.ceil(total / limit);
	const currentPage = Math.floor(offset / limit) + 1;

	const goToPage = (page: number) => {
		setOffset((page - 1) * limit);
		setChecked(new Set());
	};

	const handlePrev = () => {
		if (currentPage > 1) goToPage(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < pages) goToPage(currentPage + 1);
	};

	return (
		<div className="w-full max-w-7xl mx-auto mt-10 bg-white rounded-2xl shadow-2xl p-8">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
				<h2 className="text-2xl font-bold text-gray-900 tracking-tight">
					Suspects
				</h2>
				<div className="flex items-center gap-2">
					<FaCheckCircle className="text-blue-600" />
					<span className="text-gray-700 font-medium">
						{checked.size} seleccionados
					</span>
				</div>
			</div>
			{/* Loading and Error States */}
			{isLoading && (
				<div className="text-center py-12 text-blue-500 text-lg font-semibold animate-pulse">
					Cargando...
				</div>
			)}
			{error && (
				<div className="text-center py-12 text-red-500 text-lg font-semibold">
					Error al cargar los datos: {(error as Error).message}
				</div>
			)}
			{!isLoading && !error && (
				<>
					<div className="overflow-x-auto rounded-xl shadow">
						<table className="min-w-full text-sm text-left border-separate border-spacing-y-1">
							<thead className="sticky top-0 z-10 bg-white shadow">
								<tr className="text-gray-700">
									<th className="px-3 py-3">
										<input
											type="checkbox"
											checked={
												checked.size === data?.suspects.length &&
												data?.suspects.length > 0
											}
											onChange={handleCheckAll}
											className="accent-blue-600 w-5 h-5"
											aria-label="Seleccionar todos"
										/>
									</th>
									<th className="px-3 py-3">Email</th>
									<th className="px-3 py-3">Nombre</th>
									<th className="px-3 py-3">Teléfono</th>
									<th className="px-3 py-3">Ciudad</th>
									<th className="px-3 py-3">Estado</th>
									<th className="px-3 py-3">Identificación</th>
									<th className="px-3 py-3">Status</th>
									<th className="px-3 py-3">Eliminado</th>
									<th className="px-3 py-3 text-center">Acciones</th>
								</tr>
							</thead>
							<tbody>
								{data?.suspects.length === 0 && (
									<tr>
										<td colSpan={11} className="text-center py-8 text-gray-400">
											No hay datos para mostrar.
										</td>
									</tr>
								)}
								{data?.suspects?.map((row, idx) => (
									<tr
										key={row.identification}
										className={`transition-colors duration-200 border-b last:border-b-0
                      ${isChecked(row.identification)
												? "bg-blue-50"
												: idx % 2 === 0
													? "bg-gray-50"
													: "bg-white"
											}
                      hover:bg-blue-100 focus-within:bg-blue-100`}
									>
										<td className="px-3 py-3">
											<input
												type="checkbox"
												checked={isChecked(row.identification)}
												onChange={() => handleCheck(row.identification)}
												className="accent-blue-600 w-5 h-5"
												aria-label={`Seleccionar ${row.email}`}
											/>
										</td>
										<td className="px-3 py-3 font-medium text-gray-900">{row.email}</td>
										<td className="px-3 py-3">{row.name || "-"}</td>
										<td className="px-3 py-3">{row.phone || "-"}</td>
										<td className="px-3 py-3">{row.city || "-"}</td>
										<td className="px-3 py-3">{row.state || "-"}</td>
										<td className="px-3 py-3">{row.identification}</td>
										<td className="px-3 py-3">
											<span
												className={`inline-block px-2 py-1 rounded text-xs font-semibold
                          ${row.status === "active"
														? "bg-green-100 text-green-700"
														: "bg-yellow-100 text-yellow-700"
													}`}
											>
												{row.status}
											</span>
										</td>
										<td className="px-3 py-3 text-center">
											{row.deleted ? (
												<FaCheckCircle className="text-red-500 mx-auto" />
											) : (
												<FaRegCircle className="text-gray-400 mx-auto" />
											)}
										</td>
										<td className="px-3 py-3 text-center">
											<div className="flex gap-2 justify-center">
												<button
													className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
													title="Eliminar"
													onClick={() => alert(`Eliminar ${row.email}`)}
												>
													<FaTrash />
												</button>
												<button
													className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 transition"
													title="Editar"
													onClick={() => alert(`Editar ${row.email}`)}
												>
													<FaEdit />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{/* Pagination Controls */}
					<div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
						<div className="text-gray-600">
							Página <span className="font-semibold">{currentPage}</span> de{" "}
							<span className="font-semibold">{pages}</span>
						</div>
						<div className="flex gap-2">
							<button
								onClick={handlePrev}
								disabled={currentPage === 1}
								className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-semibold transition"
							>
								Anterior
							</button>
							{Array.from({ length: pages }, (_, i) => (
								<button
									key={i + 1}
									onClick={() => goToPage(i + 1)}
									className={`px-4 py-2 rounded-lg font-semibold transition
                    ${currentPage === i + 1
											? "bg-blue-600 text-white shadow"
											: "bg-gray-100 hover:bg-blue-100 text-gray-700"
										}`}
								>
									{i + 1}
								</button>
							))}
							<button
								onClick={handleNext}
								disabled={currentPage === pages || pages === 0}
								className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 font-semibold transition"
							>
								Siguiente
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default MailingTable;
