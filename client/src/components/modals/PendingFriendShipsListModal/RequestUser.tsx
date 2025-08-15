import { FC } from "react";
import { useSocketContext } from "@/context/socketContext";
import useResponseFriendRequest from "@/hooks/friends/useResponseFriendRequest";
import { SafeUser } from "@shared/types/models/user";

interface RequestUserProps {
  user: SafeUser;
  lastIdx: boolean;
}

const RequestUser: FC<RequestUserProps> = ({ user, lastIdx }) => {
  const { onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(user._id);
  const { responseFriendRequest, loading } = useResponseFriendRequest();

  return (
    <div>
      <div
        className={`flex gap-2 items-center rounded p-2 py-1 ${lastIdx && "my-4"} max-xs:flex-col max-xs:text-center`}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-14 rounded-full">
            <img
              src={user.profilePic}
              onError={(e) => {
                e.currentTarget.src = `/avatars/${user.gender}.png`;
              }}
              alt=" user avatar"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-400 text-2xl">{user.fullName}</p>
          </div>
          <p className="font-bold text-gray-200">{user.username}</p>
        </div>

        <div className="join ">
          <button
            className="btn max-xs:w-auto join-item btn-accent"
            onClick={() => responseFriendRequest(user._id.toString(), "accept")}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Aceppt"
            )}
          </button>

          <button
            className="btn max-xs:w-auto join-item btn-error"
            onClick={() => responseFriendRequest(user._id.toString(), "reject")}
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Reject"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestUser;
