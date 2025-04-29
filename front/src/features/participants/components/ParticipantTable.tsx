import { useEffect } from "react";
import { useParticipants } from "../../../hooks/useParticipants";
import { DeleteParticipant } from "../components/DeleteParticipant";
import { CreateDraft } from "../components/CreateDraft";
import {Paginator} from "../../../components/Paginator";
import { useParticipantsPaginationStore } from "../../../stores/pagination/paginationParticipantsStore";
const ParticipantTable = () => {

    const { data, isLoading, error, isSuccess } = useParticipants();
    const paginationStore = useParticipantsPaginationStore();
    const offset = useParticipantsPaginationStore((state) => state.offset);

    useEffect(() => {
        if (data) {
            const total = data.total || 0;
            paginationStore.setTotalPages(Math.ceil(total / paginationStore.limit));
            paginationStore.setLastPage(Math.ceil(total / paginationStore.limit));
        }
    }, [data, isSuccess, offset]);


    return (
        <>
            <div className="flex flex-col items-center justify-between gap-4 border-b border-neutral-100 p-5 text-center sm:flex-row sm:text-start">
                <div>
                    <h2 className="mb-0.5 font-semibold text-lg">Participantes</h2>
                    <h3 className="text-sm font-medium text-neutral-600">
                        Aquí podrás administrar a los participantes de la campaña así como crear el borrador del correo.
                    </h3>
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
                                        <th className="px-3 py-2 text-start text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                                            Status
                                        </th>
                                        <th className="min-w-[100px] p-3 py-2 text-end text-xs font-semibold tracking-wider text-neutral-700 uppercase"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.participants.length === 0 && (
                                        <tr>
                                            <td colSpan={11} className="text-center py-8 text-gray-400">
                                                No hay participantes de esta campaña para mostrar.
                                            </td>
                                        </tr>
                                    )}
                                    {data?.participants?.map((row) => (
                                        !row.has_email && (
                                        <tr
                                            key={row.suspect.identification}
                                            className={`border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-200
                                            `}
                                        >
                                            <td className="p-3 font-medium text-neutral-600 max-w-[180px] truncate whitespace-nowrap" title={row.suspect.email}>
                                                {row.suspect.email}
                                            </td>
                                            <td className="p-3 text-neutral-600">{row.suspect.name || "-"}</td>
                                            <td className="p-3 text-neutral-600">{row.suspect.phone || "-"}</td>
                                            <td className="p-3 text-neutral-600">{row.suspect.city || "-"}</td>
                                            <td className="p-3 font-medium">
                                                <div
                                                    className={`inline-block rounded-full px-2 py-1 text-xs leading-4 font-semibold whitespace-nowrap
                                                                ${row.status === "nuevo"
                                                            ? "bg-green-100 text-green-700"
                                                            : row.status === "listo"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {row.status}
                                                </div>
                                            </td>
                                            <td className="p-3 text-end font-medium">
                                                <div className="flex gap-2 justify-end">
                                                    <CreateDraft row={row} limit={paginationStore.limit} offset={paginationStore.offset} />
                                                    <DeleteParticipant row={row} limit={paginationStore.limit} offset={paginationStore.offset} />
                                                </div>
                                            </td>
                                        </tr>
                                        )
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Paginator
                            paginationStore={paginationStore}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default ParticipantTable;
