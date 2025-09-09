import toast from "react-hot-toast";
import { useUsers, useUsersPagination } from "@/stores";
import { GetUsersResponseBody } from "@shared/types/http/modules/user";

const useGetUsers = () => {
  const { users, setUsers } = useUsers();
  const { setCurrentPage, setSearchResults, setPaginationData, setLoading } =
    useUsersPagination();

  // Fetch users with pagination
  const fetchUsers = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?page=${page}`);
      const data: GetUsersResponseBody = await res.json();

      if (!data.success) throw data.message;

      if (data.users) {
        setUsers(data.users);

        const pagination = data.pagination;
        if (pagination === undefined) return;

        setPaginationData({
          total: pagination.total || 0,
          page: pagination.page || 1,
          totalPages: pagination.totalPages || 1,
        });
        setCurrentPage(pagination.page || 1);
      }
    } catch (error: any) {
      toast.error(
        error instanceof Error ? error.message : "Error fetching Users",
      );
    } finally {
      setLoading(false);
    }
  };

  // Search users with pagination
  const searchUsers = async (
    query: string,
    page: number = 1,
  ): Promise<void> => {
    if (query.length < 3) {
      return;
    }

    setLoading(true);
    try {
      // Get all users for search
      await fetchAllUsers();

      // Filter users
      const filtered = users.filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.fullName.toLowerCase().includes(query.toLowerCase()),
      );

      // Paginate results
      const itemsPerPage = 8;
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedResults = filtered.slice(
        startIndex,
        startIndex + itemsPerPage,
      );
      const totalPages = Math.ceil(filtered.length / itemsPerPage);

      setSearchResults(paginatedResults, filtered.length, totalPages);
      setCurrentPage(page);
    } catch (error: any) {
      toast.error("Error searching users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users
  const fetchAllUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users`);
      const data: GetUsersResponseBody = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (error: any) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  return { fetchUsers, fetchAllUsers, searchUsers };
};

export default useGetUsers;
