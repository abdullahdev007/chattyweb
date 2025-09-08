import { create } from "zustand";

interface NotificationsPaginationState {
  // Pagination state
  currentPage: number;
  totalPages: number;
  total: number;
  isLoading: boolean;

  // Actions
  setCurrentPage: (page: number) => void;
  setPaginationData: (data: {
    total: number;
    page: number;
    totalPages: number;
  }) => void;
  setLoading: (loading: boolean) => void;
  resetPagination: () => void;
  resetAll: () => void;
}

const useNotificationsPagination = create<NotificationsPaginationState>(
  (set) => ({
    // Initial state
    currentPage: 1,
    totalPages: 1,
    total: 0,
    isLoading: false,

    // Actions
    setCurrentPage: (page: number) => {
      set({ currentPage: page });
    },

    setPaginationData: (data: {
      total: number;
      page: number;
      totalPages: number;
    }) => {
      set({
        total: data.total,
        currentPage: data.page,
        totalPages: data.totalPages,
      });
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    resetPagination: () => {
      set({
        currentPage: 1,
        totalPages: 1,
        total: 0,
      });
    },

    resetAll: () => {
      set({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        isLoading: false,
      });
    },
  })
);

export default useNotificationsPagination;
