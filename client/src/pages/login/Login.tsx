import { useEffect, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../../hooks/auth/useLogin";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { loading, login } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ username, password });
    navigate("/");
  };

  useEffect(() => {
    document.title = "ChattyWeb: Login";
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[500px]">
      <div className="bg-base-200 shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-content">
            Welcome Back
          </h1>
          <p className="text-primary-content/80 mt-2">
            Sign in to continue to ChattyWeb
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-medium">
                  <FaUser className="inline mr-2" />
                  Username
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-medium">
                  <FaLock className="inline mr-2" />
                  Password
                </span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full focus:input-primary transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                className={`btn btn-primary w-full transition-all duration-200 ${
                  loading ? "loading" : "hover:scale-105"
                }`}
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <FaSignInAlt className="mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <span className="text-base-content/70">
                Don't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="link link-primary hover:link-secondary transition-colors duration-200 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
