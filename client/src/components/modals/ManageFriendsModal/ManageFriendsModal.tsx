import { FC, useEffect, useState } from "react";
import SearchInput from "@/components/modals/AddFriendModal/SearchInput";
import FriendUser from "./FriendUser";
import useGetFriends from "@/hooks/friends/useFetchFriends";
import { SafeUser } from "@shared/types/models/user";
import { FaUsers, FaUserFriends } from "react-icons/fa";

const ManageFriendsModal: FC = () => {
  const [search, setSearch] = useState<string>("");
  const { friends } = useGetFriends();
  const [filteredFriends, setfilteredFriends] = useState<SafeUser[]>([]);

  useEffect(() => {
    if (search.length < 3) {
      setfilteredFriends(friends);
      return;
    }

    setfilteredFriends(
      friends.filter((friend) =>
        friend.username.toLowerCase().startsWith(search.toLowerCase())
      )
    );
  }, [friends, search]);

  return (
    <dialog
      id="manage_friends_modal"
      className="modal modal-bottom sm:modal-middle z-20"
    >
      <div className="modal-box w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-base-content flex items-center gap-2">
            <FaUserFriends className="text-secondary" />
            Manage Friends
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
          {filteredFriends.length > 0 ? (
            <div className="space-y-3">
              {filteredFriends.map((friend, index) => (
                <FriendUser
                  friend={friend}
                  key={index}
                  lastIdx={index === friends.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaUsers className="text-6xl text-base-content/20 mx-auto mb-4" />
              <p className="text-base-content/70 font-medium">
                {friends.length <= 0
                  ? "You don't have any friends yet"
                  : `No friends found starting with "${search}"`}
              </p>
            </div>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ManageFriendsModal;
