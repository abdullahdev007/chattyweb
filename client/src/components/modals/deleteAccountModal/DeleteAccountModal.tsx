import { FC, MouseEvent } from "react";
import useDeleteAccount from "@/hooks/auth/useDeleteAccount";
import { FaExclamationTriangle, FaTrash, FaTimes } from "react-icons/fa";

const DeleteAccountModal: FC = () => {
  const { deleteAccount, loading } = useDeleteAccount();

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await deleteAccount();
  };

  return (
    <dialog
      id="delete-account-modal"
      className="modal modal-bottom sm:modal-middle z-20"
    >
      <div className="modal-box w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-base-content flex items-center gap-2">
            <FaExclamationTriangle className="text-error" />
            Delete Account
          </h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>

        {/* Warning Icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="text-2xl text-error" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h4 className="font-bold text-lg text-base-content mb-2">
            Are you absolutely sure?
          </h4>
          <p className="text-base-content/70 text-sm leading-relaxed">
            This action cannot be undone. This will permanently delete your
            ChattyWeb account and remove all your data from our servers.
          </p>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <form method="dialog" className="flex gap-2 w-full">
            <button className="btn btn-outline flex-1">
              <FaTimes className="mr-2" />
              Cancel
            </button>
            <button
              className="btn btn-error flex-1"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <FaTrash className="mr-2" />
                  Delete Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteAccountModal;
