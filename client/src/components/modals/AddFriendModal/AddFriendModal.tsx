import { FC, useEffect } from "react";
import SearchInput from "./SearchInput";
import useGetUsers from "@/hooks/users/useGetUsers";
import { useUsers, useUsersPagination } from "@/stores";
import AddFriendUser from "./AddFriendUser";
import Pagination from "@/components/ui/Pagination";
import { FaUserPlus, FaUsers } from "react-icons/fa";

const AddFriendModal: FC = () => {
  // API functions only
  const { fetchUsers, searchUsers } = useGetUsers();

  // State from stores
  const { users } = useUsers();
  const {
    currentPage,
    totalPages,
    total,
    isLoading,
    searchQuery,
    isSearching,
    searchResults,
    setSearchQuery,
    setCurrentPage,
  } = useUsersPagination();

  // Get current users (search results or regular users)
  const displayUsers = isSearching ? searchResults : users;

  // Initialize data when modal opens
  useEffect(() => {
    fetchUsers(1);
  }, []);

  // Handle search
  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    if (newSearch.length >= 3) {
      searchUsers(newSearch, 1);
    } else {
      fetchUsers(1);
    }
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (isSearching) {
      searchUsers(searchQuery, page);
    } else {
      fetchUsers(page);
    }
  };

  return (
    <>
      <dialog
        id="add_friend_modal"
        className="modal modal-bottom sm:modal-middle z-20"
      >
        <div className="modal-box w-full max-w-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-base-content flex items-center gap-2">
              <FaUserPlus className="text-primary" />
              Add Friends
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>

          {/* Search Input */}
          <SearchInput search={searchQuery} setSearch={handleSearchChange} />

          <div className="divider my-2"></div>

          {/* Content */}
          <div className="flex flex-col">
            {/* Users List */}
            <div className="flex-1 overflow-y-auto max-h-[50vh]">
              {isLoading ? (
                <div className="text-center py-8">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-base-content/70 font-medium mt-4">
                    Loading users...
                  </p>
                </div>
              ) : displayUsers.length > 0 ? (
                <div className="space-y-3">
                  {displayUsers.map((user, index) => (
                    <AddFriendUser user={user} key={user._id.toString()} />
                  ))}
                </div>
              ) : (
                /* No users found */
                <div className="text-center py-8">
                  <FaUsers className="text-6xl text-base-content/20 mx-auto mb-4" />
                  <p className="text-base-content/70 font-medium">
                    {isSearching
                      ? `No users found for "${searchQuery}"`
                      : "No users available"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {!isLoading && displayUsers.length > 0 && totalPages > 1 && (
            <>
              <div className="divider my-2"></div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </>
          )}
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default AddFriendModal;
