
import { StateCreator, create } from "zustand";
import { Pagination } from "../../interfaces/PaginationInterface";

const storeSentPagination: StateCreator<Pagination> = (set) => ({
    page: 1,
    offset: 0,
    limit: 10,
    currentPage: 1,
    totalPages: 0,
    lastPage: 0,
    setPage: (page) => set({ page }),
    setOffset: (offset) => set({ offset }),
    setLimit: (limit) => set({ limit }),
    setTotalPages: (totalPages) => set({ totalPages }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setLastPage: (lastPage) => set({ lastPage }),
});

export const useSentPaginationStore = create<Pagination>()(
    storeSentPagination
);
