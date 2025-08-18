import { FC } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useSocketContext } from "@/context/socketContext";
import { BsPersonFillAdd } from "react-icons/bs";
import { FaUserFriends, FaCheck } from "react-icons/fa";
import useSendFriendRequest from "@/hooks/friends/useSendFriendRequest";
import useGetUsers from "@/hooks/users/useGetUsers";
import { SafeUser } from "@shared/types/models/user";

interface AddFriendUserProps {
  user: SafeUser;
  lastIdx: boolean;
}

const AddFriendUser: FC<AddFriendUserProps> = ({ user, lastIdx }) => {
  const { authUser } = useAuthContext();
  const { onlineUsers } = useSocketContext();
  const { sendFriendRequest, loading } = useSendFriendRequest();
  const { fetchUsers } = useGetUsers();

  const isOnline = onlineUsers.includes(user._id);
  const inFriendRequests = user.pendingFriendships.includes(authUser?._id);
  const waitingAcceptRequst = authUser?.pendingFriendships.includes(user._id);
  const inFriends = user.friends.includes(authUser?._id);

  const handleAddFriend = async (friendId: string) => {
    await sendFriendRequest(friendId);
    await fetchUsers();
  };

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-full ring-2 ${isOnline ? "ring-success" : "ring-base-300"}`}
            >
              <img
                src={user.profilePic}
                onError={(e) => {
                  e.currentTarget.src = `/avatars/${user.gender}.png`;
                }}
                alt={`${user.fullName} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base-content text-lg truncate">
              {user.fullName}
            </h3>
            <p className="text-base-content/60 text-sm truncate">
              @{user.username}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            {inFriendRequests || waitingAcceptRequst ? (
              <div className="badge badge-warning gap-2">
                <span className="loading loading-spinner loading-xs"></span>
                Pending
              </div>
            ) : inFriends ? (
              <div className="badge badge-success gap-2">
                <FaUserFriends className="text-xs" />
                Friends
              </div>
            ) : loading ? (
              <button className="btn btn-circle btn-ghost" disabled>
                <span className="loading loading-spinner loading-sm"></span>
              </button>
            ) : (
              <button
                className="btn btn-circle btn-primary hover:btn-secondary transition-all duration-200"
                onClick={() => handleAddFriend(user._id)}
                title="Add friend"
              >
                <BsPersonFillAdd className="text-lg" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriendUser;
