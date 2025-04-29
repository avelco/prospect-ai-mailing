import { useEffect } from "react";
import { useLeads } from "../../../hooks/useLeads";
import { ConvertLeadToProspect } from "./ConvertLeadToProspect";
import { Contacts } from "./Contacts";
import { Link } from "react-router";
import { Paginator } from "../../../components/Paginator";
import { useLeadsPaginationStore } from "../../../stores/pagination/paginationLeadsStore";

const LeadsTable = () => {
    const { data, isLoading, error, isSuccess } = useLeads();
    const paginationStore = useLeadsPaginationStore();
    const offset = useLeadsPaginationStore((state) => state.offset);

    useEffect(() => {
        if (data) {
            const total = data.total || 0;
            paginationStore.setTotalPages(Math.ceil(total / paginationStore.limit));
            paginationStore.setLastPage(Math.ceil(total / paginationStore.limit));
        }
    }, [data, isSuccess, offset]);

    return (
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white shadow p-0 sm:col-span-2 lg:col-span-4">
            <div className="flex flex-col items-center justify-between gap-4 border-b border-neutral-100 p-5 text-center sm:flex-row sm:text-start">
                <div>
                    <h2 className="mb-0.5 font-semibold text-lg">Leads</h2>
                    <h3 className="text-sm font-medium text-neutral-600">
                        Leads, empresas que han mostrado interés en el producto
                    </h3>
                    <div className="text-sm font-medium text-neutral-600">
                    <strong>Lead:</strong> Es cualquier contacto que ha mostrado algún interés o ha interactuado con tu empresa, pero aún no ha sido calificado.
                    </div>
                    <div className="text-sm font-medium text-neutral-600">
                    <strong>Prospecto:</strong> Es un lead que ya ha sido calificado y cumple con los requisitos clave para ser considerado un cliente potencial real. 
                    </div>
                </div>
            </div>
            <div className="p-5">
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
                                        <th className="min-w-[100px] p-3 py-2 text-end text-xs font-semibold tracking-wider text-neutral-700 uppercase"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.leads?.length === 0 && (
                                        <tr>
                                            <td colSpan={11} className="text-center py-8 text-gray-400">
                                                No hay leads para mostrar.
                                            </td>
                                        </tr>
                                    )}
                                    {data?.leads?.map((row) => (
                                        <tr
                                            key={row.identification}
                                            className={`border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-200
                                            `}
                                        >
                                            <td className="p-3 font-medium text-neutral-600 max-w-[180px] truncate whitespace-nowrap" title={row.email}>
                                                <Link to={`/suspects/${row.id}`}>
                                                {row.email}
                                                </Link>
                                            </td>
                                            <td className="p-3 text-neutral-600">{row.name || "-"}</td>
                                            <td className="p-3 text-neutral-600">{row.phone || "-"}</td>
                                            <td className="p-3 text-neutral-600">{row.city || "-"}</td>
                                            <td className="p-3 text-end font-medium">
                                                <div className="flex gap-2 justify-end">
                                                    <Contacts row={row} />
                                                    <ConvertLeadToProspect participant_id={row.id} offset={offset} limit={paginationStore.limit} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        <Paginator
                            paginationStore={paginationStore}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default LeadsTable;
