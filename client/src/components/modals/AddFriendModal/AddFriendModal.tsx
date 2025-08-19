import { FC, useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import useGetUsers from "@/hooks/users/useGetUsers";
import AddFriendUser from "./AddFriendUser";
import { SafeUser } from "@shared/types/models/user";
import { FaUserPlus, FaUsers } from "react-icons/fa";

const AddFriendModal: FC = () => {
  const [search, setSearch] = useState<string>("");
  const { users } = useGetUsers();
  const [filteredUsers, setFilteredUsers] = useState<SafeUser[]>([]);

  useEffect(() => {
    if (search.length < 3) return setFilteredUsers(users);

    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().startsWith(search.toLowerCase()),
      ) as SafeUser[],
    );
  }, [users, search]);

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
          <SearchInput search={search} setSearch={setSearch} />

          <div className="divider my-4"></div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh]">
            {filteredUsers.length > 0 ? (
              <div className="space-y-3">
                {filteredUsers.map((user, index) => (
                  <AddFriendUser
                    user={user}
                    key={user._id.toString()}
                    lastIdx={index === users.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaUsers className="text-6xl text-base-content/20 mx-auto mb-4" />
                <p className="text-base-content/70 font-medium">
                  {users.length <= 0
                    ? "You don't have any friends"
                    : `No users found starting with "${search}"`}
                </p>
              </div>
            )}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default AddFriendModal;
