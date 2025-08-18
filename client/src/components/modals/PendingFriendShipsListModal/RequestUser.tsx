import { FC } from "react";
import { useSocketContext } from "@/context/socketContext";
import useResponseFriendRequest from "@/hooks/friends/useResponseFriendRequest";
import { SafeUser } from "@shared/types/models/user";
import { FaCheck, FaTimes } from "react-icons/fa";

interface RequestUserProps {
  user: SafeUser;
  lastIdx: boolean;
}

const RequestUser: FC<RequestUserProps> = ({ user, lastIdx }) => {
  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(user._id);
  const { responseFriendRequest, loading } = useResponseFriendRequest();

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

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <button
              className="btn btn-circle btn-success hover:btn-success transition-all duration-200"
              onClick={() =>
                responseFriendRequest(user._id.toString(), "accept")
              }
              disabled={loading}
              title="Accept request"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FaCheck className="text-lg" />
              )}
            </button>

            <button
              className="btn btn-circle btn-error hover:btn-error transition-all duration-200"
              onClick={() =>
                responseFriendRequest(user._id.toString(), "reject")
              }
              disabled={loading}
              title="Reject request"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FaTimes className="text-lg" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestUser;
