import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useSuspectDelete, useSuspects } from "../../../hooks/useSuspect";
import { AddParticipant } from "./AddParticipant";
import PaginationControls from "../../../components/Pagination/PaginationControls";

const SuspectsTable = () => {
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);

    const deleteMutation = useSuspectDelete(limit, offset);
    const { data, isLoading, error } = useSuspects(limit, offset);

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    const total = data?.total || 0;
    const pages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const handlePageChange = (page: number) => {
        setOffset((page - 1) * limit);
    };
    console.log(data);
    return (
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white shadow p-0 sm:col-span-2 lg:col-span-4">
            <div className="flex flex-col items-center justify-between gap-4 border-b border-neutral-100 p-5 text-center sm:flex-row sm:text-start">
                <div>
                    <h2 className="mb-0.5 font-semibold text-lg">Suspects</h2>
                    <h3 className="text-sm font-medium text-neutral-600">
                        Administra tus suspects aquí
                    </h3>
                </div>
            </div>
            <div className="p-5">
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
                        <div className="min-w-full overflow-x-auto rounded-sm">
                            <table className="min-w-full align-middle text-sm">
                                <thead>
                                    <tr className="border-b-2 border-neutral-100">
                                        <th className="min-w-[180px] px-3 py-2 text-start text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                                            Email
                                        </th>
                                        <th className="min-w-[140px] px-3 py-2 text-start text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                                            Nombre
                                        </th>
                                        <th className="min-w-[120px] px-3 py-2 text-start text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                                            Teléfono
                                        </th>
                                        <th className="min-w-[120px] px-3 py-2 text-start text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                                            Ciudad
                                        </th>
                                        <th className="px-3 py-2 text-start text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                                            Status
                                        </th>
                                        <th className="min-w-[100px] p-3 py-2 text-end text-xs font-semibold tracking-wider text-neutral-700 uppercase"></th>
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
                                    {data?.suspects?.map((row) => (
                                        <tr
                                            key={row.identification}
                                            className={`border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-200
                                            `}
                                        >
                                            <td className="p-3 font-medium text-neutral-600 max-w-[180px] truncate whitespace-nowrap" title={row.email}>
                                                {row.email}
                                            </td>
                                            <td className="p-3 text-neutral-600">{row.name || "-"}</td>
                                            <td className="p-3 text-neutral-600">{row.phone || "-"}</td>
                                            <td className="p-3 text-neutral-600">{row.city || "-"}</td>
                                            <td className="p-3 font-medium">
                                                <div className={`inline-block rounded-full px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap
                                                    ${row.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {row.status}
                                                </div>
                                            </td>
                                            <td className="p-3 text-end font-medium">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm leading-5 font-semibold text-red-600 hover:border-neutral-300 hover:text-red-800 active:border-neutral-200"
                                                        title="Eliminar"
                                                        onClick={() => { handleDelete(Number(row.id)) }}
                                                    >
                                                        <FaTrash />
                                                        <span className="hidden sm:inline">Eliminar</span>
                                                    </button>
                                                    <AddParticipant row={row} limit={limit} offset={offset} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6">
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={pages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SuspectsTable;
