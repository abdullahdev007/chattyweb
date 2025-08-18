import { FC, FormEvent, ChangeEvent, useEffect, useState } from "react";
import useChangePassword from "../../hooks/auth/useChangePassword";
import { FaLock, FaKey, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const ChangePassword: FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { loading, changePassword } = useChangePassword();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await changePassword({ password, confirmPassword });
  };

  useEffect(() => {
    document.title = "ChattyWeb: Change Password";
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[500px]">
      <div className="bg-base-200 shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-warning to-error p-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-warning-content">
            Change Password
          </h1>
          <p className="text-warning-content/80 mt-2">
            Update your account security
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-medium">
                  <FaLock className="inline mr-2" />
                  New Password
                </span>
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="input input-bordered w-full focus:input-warning transition-all duration-200"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-medium">
                  <FaLock className="inline mr-2" />
                  Confirm New Password
                </span>
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="input input-bordered w-full focus:input-warning transition-all duration-200"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setConfirmPassword(e.target.value);
                }}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                className={`btn btn-warning w-full transition-all duration-200 ${
                  loading ? "loading" : "hover:scale-105"
                }`}
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <FaKey className="mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </div>

            {/* Back to Home Link */}
            <div className="text-center mt-4">
              <Link
                to="/"
                className="link link-warning hover:link-error transition-colors duration-200 font-medium inline-flex items-center"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
