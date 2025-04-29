import { Pagination } from '../interfaces/PaginationInterface'

export const Paginator = ({ paginationStore }: { paginationStore: Pagination }) => {

	const handlePageChange = (page: number) => {
		paginationStore.setCurrentPage(page);
		paginationStore.setOffset((page - 1) * paginationStore.limit);
	};

	// Helper function to generate pagination range with ellipsis
	const getPaginationRange = () => {
		const delta = 2; // How many pages to show around the current page
		const range = [];
		const start = Math.max(1, paginationStore.currentPage - delta);
		const end = Math.min(paginationStore.lastPage, paginationStore.currentPage + delta);

		if (start > 1) range.push("1");
		if (start > 2) range.push("...");
		for (let i = start; i <= end; i++) range.push(i.toString());
		if (end < paginationStore.lastPage - 1) range.push("...");
		if (end < paginationStore.lastPage) range.push(paginationStore.lastPage.toString());

		return range;
	};

	const paginationRange = getPaginationRange();
	if (paginationStore.totalPages === 0) return null;

	return (
		<div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
			{/* Page Info */}
			<div className="text-neutral-600">
				Página <span className="font-semibold">{paginationStore.currentPage}</span> de{" "}
				<span className="font-semibold">{paginationStore.totalPages}</span>
			</div>

			{/* Page Buttons */}
			<div className="flex gap-2 items-center">
				{/* Previous Button */}
				<button
					onClick={() => handlePageChange(paginationStore.currentPage - 1)}
					disabled={paginationStore.currentPage === 1}
					aria-label="Previous Page"
					className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 font-semibold hover:border-neutral-300 hover:text-neutral-950 disabled:opacity-50 transition"
				>
					Anterior
				</button>

				<ul className="flex items-center space-x-1">
					{paginationRange.map((item, index) =>
						item === "..." ? (
							<li key={index}>
								<span
									className="px-3 py-1 rounded bg-gray-100 text-gray-400 cursor-default select-none"
								>
									...
								</span>
							</li>
						) : (
							<li key={index}>
								<button
									type="button"
									className={`px-3 py-1 rounded transition-colors duration-150
            ${paginationStore.currentPage === parseInt(item)
											? "bg-blue-600 text-white font-semibold shadow"
											: "bg-white text-gray-700 hover:bg-blue-100"
										}`}
									onClick={() => handlePageChange(parseInt(item))}
									aria-current={paginationStore.currentPage === parseInt(item) ? "page" : undefined}
								>
									{item}
								</button>
							</li>
						)
					)}
				</ul>

				{/* Next Button */}
				<button
					onClick={() => handlePageChange(paginationStore.currentPage + 1)}
					disabled={paginationStore.currentPage === paginationStore.totalPages || paginationStore.totalPages === 0}
					aria-label="Next Page"
					className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 font-semibold hover:border-neutral-300 hover:text-neutral-950 disabled:opacity-50 transition"
				>
					Siguiente
				</button>
			</div>
		</div>
	);
}
