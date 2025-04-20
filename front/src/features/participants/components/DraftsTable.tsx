import { useState } from "react";
import { useParticipants } from "../../../hooks/useParticipants";
import { DeleteParticipant } from "../components/DeleteParticipant";
import { CreateDraft } from "../components/CreateDraft";
import { DraftShow } from "./DraftShow";
import { DraftSend } from "./DraftSend";
import { DraftDelete } from "./DraftDelete";
const DraftsTable = () => {
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);

    const { data, isLoading, error } = useParticipants(limit, offset);

    // Pagination logic
    const total = data?.total || 0;
    const pages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const goToPage = (page: number) => {
        setOffset((page - 1) * limit);
    };

    const handlePrev = () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < pages) goToPage(currentPage + 1);
    };

    return (
        <>
            <div className="flex flex-col items-center justify-between gap-4 border-b border-neutral-100 p-5 text-center sm:flex-row sm:text-start">
                <div>
                    <h2 className="mb-0.5 font-semibold text-lg">Borradores</h2>
                    <h3 className="text-sm font-medium text-neutral-600">
                        Aquí podrás administrar los borradores de la campaña así como enviar el correo
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
                                        row.has_email && (
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
                                                    <DraftShow row={row} />
                                                    <DraftSend row={row} limit={limit} offset={offset} />
                                                    <DraftDelete row={row} limit={limit} offset={offset} />
                                                </div>
                                            </td>
                                        </tr>
                                        )
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination Controls */}
                        {data?.participants.length != 0 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                                <div className="text-neutral-600">
                                    Página <span className="font-semibold">{currentPage}</span> de{" "}
                                    <span className="font-semibold">{pages}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePrev}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 font-semibold hover:border-neutral-300 hover:text-neutral-950 disabled:opacity-50 transition"
                                    >
                                        Anterior
                                    </button>
                                    {Array.from({ length: pages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => goToPage(i + 1)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition border
                                            ${currentPage === i + 1
                                                    ? "bg-blue-600 text-white border-blue-600 shadow"
                                                    : "bg-white text-neutral-700 border-neutral-200 hover:border-blue-300 hover:text-blue-700"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === pages || pages === 0}
                                        className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 font-semibold hover:border-neutral-300 hover:text-neutral-950 disabled:opacity-50 transition"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default DraftsTable;
