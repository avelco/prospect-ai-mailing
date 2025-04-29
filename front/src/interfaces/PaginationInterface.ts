export interface Pagination {
    page: number;
    offset: number;
    limit: number;
    totalPages: number;
    lastPage: number;
    currentPage: number;

    setPage: (page: number) => void;
    setOffset: (offset: number) => void;
    setLimit: (limit: number) => void;
    setTotalPages: (total: number) => void;
    setCurrentPage: (currentPage: number) => void;
    setLastPage: (lastPage: number) => void;
}
