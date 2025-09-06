import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UsersPaginationState {
  // Pagination state
  currentPage: number;
  totalPages: number;
  total: number;
  isLoading: boolean;

  // Search state
  searchQuery: string;
  isSearching: boolean;
  searchResults: any[];

  // Actions
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[], total: number, totalPages: number) => void;
  setPaginationData: (data: {
    total: number;
    page: number;
    totalPages: number;
  }) => void;
  setLoading: (loading: boolean) => void;
  resetPagination: () => void;
  resetSearch: () => void;
  resetAll: () => void;
}

const useUsersPagination = create<UsersPaginationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentPage: 1,
      totalPages: 1,
      total: 0,
      isLoading: false,

      searchQuery: "",
      isSearching: false,
      searchResults: [],

      // Actions
      setCurrentPage: (page: number) => {
        set({ currentPage: page });
      },

      setSearchQuery: (query: string) => {
        set({
          searchQuery: query,
          isSearching: query.length >= 3,
          currentPage: 1, // Reset to first page when searching
        });
      },

      setSearchResults: (results: any[], total: number, totalPages: number) => {
        set({
          searchResults: results,
          total,
          totalPages,
          currentPage: 1, // Always start from page 1 for search results
        });
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

      resetSearch: () => {
        set({
          searchQuery: "",
          isSearching: false,
          searchResults: [],
          currentPage: 1,
        });
      },

      resetAll: () => {
        set({
          currentPage: 1,
          totalPages: 1,
          total: 0,
          isLoading: false,
          searchQuery: "",
          isSearching: false,
          searchResults: [],
        });
      },
    }),
    {
      name: "users-pagination-storage", // localStorage key
      partialize: (state) => ({
        // Only persist pagination, not search results or loading state
        currentPage: state.currentPage,
        searchQuery: state.searchQuery,
      }),
    }
  )
);

export default useUsersPagination;
