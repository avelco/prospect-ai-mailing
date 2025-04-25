// src/components/SuspectInteractions.tsx

import { useParams } from "react-router";
import { useInteractions } from "../../../hooks/useInteractions";
import { LoaderSpinner } from "../../../components/LoaderSpinner";
import { MdOutlineMessage, MdOutlineErrorOutline } from "react-icons/md";
import { FaUserNinja } from "react-icons/fa6";

interface Interaction {
	description: string;
	participant_id: number;
	updated_at: Date;
	id: number;
	created_at: Date;
}

export const SuspectInteractions = () => {
	const { id } = useParams();
	const { data, isLoading } = useInteractions(Number(id));

	if (isLoading) {
		return <LoaderSpinner />;
	}

	if (!data || data.length === 0) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-100">
					<div className="p-8 text-center">
						<MdOutlineErrorOutline className="mx-auto h-12 w-12 text-gray-400" />
						<h3 className="mt-2 text-sm font-medium text-gray-900">
							Sin interacciones
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							No se han registrado interacciones para este prospecto.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-4 py-4">
				<div className="flex items-center mb-6 px-2">
					<div className="flex items-center gap-3">
						<MdOutlineMessage className="h-6 w-6 text-indigo-600" />
						<h2 className="text-xl font-semibold text-gray-900">Interacciones</h2>
					</div>
					<span className="ml-2 mt-1 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
						{data.length} {data.length === 1 ? "interacción" : "interacciones"}
					</span>
				</div>
			</div>
			<div className="max-w-4xl mx-auto p-6">
				<div className="space-y-4">
					{data.map((interaction: Interaction) => (
						<article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 border border-gray-300 my-2">
							<footer className="flex justify-between items-center mb-2">
								<div className="flex items-center">
									<p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><FaUserNinja className="mr-2 w-6 h-6" />Usuario</p>
									<p className="text-sm text-gray-600 dark:text-gray-400"><time dateTime={new Date(interaction.created_at).toLocaleString()}>{new Date(interaction.created_at).toLocaleString()}</time></p>
								</div>
							</footer>
							<p className="text-gray-500 dark:text-gray-400">{interaction.description}</p>
						</article>
					))}
				</div>
			</div>
		</>
	);
};
