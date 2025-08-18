import { FC } from "react";
import useGetFriendRequests from "@/hooks/friends/useFetchFriendRequests";
import RequestUser from "./RequestUser";
import { FaUserClock, FaUserFriends } from "react-icons/fa";

const PendingFriendShipsListModal: FC = () => {
  const { friendRequests } = useGetFriendRequests();

  return (
    <>
      <dialog
        id="pending_friendships_modal"
        className="modal modal-bottom sm:modal-middle z-20"
      >
        <div className="modal-box w-full max-w-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-base-content flex items-center gap-2">
              <FaUserClock className="text-warning" />
              Pending Friend Requests
              {friendRequests.length > 0 && (
                <div className="badge badge-warning badge-sm">
                  {friendRequests.length}
                </div>
              )}
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>

          <div className="divider my-4"></div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh]">
            {friendRequests.length > 0 ? (
              <div className="space-y-3">
                {friendRequests.map((user, index) => (
                  <RequestUser
                    user={user}
                    key={user._id.toString()}
                    lastIdx={index === friendRequests.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaUserFriends className="text-6xl text-base-content/20 mx-auto mb-4" />
                <p className="text-base-content/70 font-medium">
                  No pending friend requests
                </p>
                <p className="text-base-content/50 text-sm mt-2">
                  When someone sends you a friend request, it will appear here
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

export default PendingFriendShipsListModal;
