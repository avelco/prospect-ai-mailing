import React, { useMemo } from 'react';

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageNeighbours?: number; // Optional: number of pages to show on each side of current page
}

// Helper function to generate pagination range (moved from SuspectsTable)
const generatePagination = (currentPage: number, totalPages: number, pageNeighbours: number = 1) => {
    const totalNumbers = (pageNeighbours * 2) + 3; // neighbours + current + first + last
    const totalBlocks = totalNumbers + 2; // including ellipses

    if (totalPages <= totalBlocks) {
        // If total pages is small enough, show all pages
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(2, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
    let pages: (number | string)[] = Array.from({ length: (endPage - startPage) + 1 }, (_, i) => startPage + i);

    const hasLeftSpill = startPage > 2;
    const hasRightSpill = (totalPages - endPage) > 1;
    const spillOffset = totalNumbers - (pages.length + 1); // +1 for the current page implicitly included

    switch (true) {
        // handle: (1) < {4 5} [6] {7 8} > (10) - Left spill only
        case (hasLeftSpill && !hasRightSpill): {
            const extraPages = Array.from({ length: spillOffset }, (_, i) => startPage - 1 - i).reverse();
            pages = ['...', ...extraPages, ...pages];
            break;
        }

        // handle: (1) < {2 3} [4] {5 6} > ... (10) - Right spill only
        case (!hasLeftSpill && hasRightSpill): {
            const extraPages = Array.from({ length: spillOffset }, (_, i) => endPage + 1 + i);
            pages = [...pages, ...extraPages, '...'];
            break;
        }

        // handle: (1) ... {4 5} [6] {7 8} ... (10) - Both spills
        case (hasLeftSpill && hasRightSpill):
        default: {
            pages = ['...', ...pages, '...'];
            break;
        }
    }

    return [1, ...pages, totalPages];
};

const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    pageNeighbours = 1 // Default neighbours
}) => {

    const paginationRange = useMemo(() => generatePagination(currentPage, totalPages, pageNeighbours), [currentPage, totalPages, pageNeighbours]);

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) {
        return null; // Don't render pagination if only one page or less
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            {/* Page Info */}
            <div className="text-neutral-600">
                Página <span className="font-semibold">{currentPage}</span> de{" "}
                <span className="font-semibold">{totalPages}</span>
            </div>

            {/* Page Buttons */}
            <div className="flex gap-2 items-center">
                {/* Previous Button */}
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                    className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 font-semibold hover:border-neutral-300 hover:text-neutral-950 disabled:opacity-50 transition"
                >
                    Anterior
                </button>

                {/* Page Number Buttons */}
                {paginationRange.map((page, index) => {
                    if (typeof page === 'string') {
                        // Render ellipsis
                        return <span key={`ellipsis-${index}`} className="px-2 py-2 text-neutral-500 self-end">...</span>;
                    }

                    // Render page number button
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            aria-label={`Go to page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                            className={`px-4 py-2 rounded-lg font-semibold transition border text-sm
                                ${currentPage === page
                                    ? "bg-blue-600 text-white border-blue-600 shadow"
                                    : "bg-white text-neutral-700 border-neutral-200 hover:border-blue-300 hover:text-blue-700"
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                    aria-label="Next Page"
                    className="px-4 py-2 rounded-lg border border-neutral-200 bg-white text-neutral-700 font-semibold hover:border-neutral-300 hover:text-neutral-950 disabled:opacity-50 transition"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default PaginationControls;
