import { Link, useNavigate } from "react-router-dom";
import GenderCheckbox from "../../components/ui/GenderCheckbox";
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import useSignup from "../../hooks/auth/useSignup";
import { SignupRequestBody, SignupResponseBody } from "@shared/types/http";
import { Gender } from "@shared/types/types";
import { FaUser, FaLock, FaUserPlus, FaIdCard } from "react-icons/fa";

type SignupInputs = SignupRequestBody;

const Signup: React.FC = () => {
  const [inputs, setInputs] = useState<SignupInputs>({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });

  const { signup, loading } = useSignup();

  const handleCheckboxChange = (gender: Gender) => {
    setInputs({ ...inputs, gender });
  };

  useEffect(() => {
    document.title = "ChattyWeb: Sign Up";
  }, []);

  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[600px]">
      <div className="bg-base-200 shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary to-accent p-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-content">
            Join ChattyWeb
          </h1>
          <p className="text-secondary-content/80 mt-2">
            Create your account to start chatting
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-medium">
                  <FaIdCard className="inline mr-2" />
                  Full Name
                </span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full focus:input-secondary transition-all duration-200"
                value={inputs.fullName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputs({ ...inputs, fullName: e.target.value })
                }
                required
              />
            </div>

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
                placeholder="johndoe"
                className="input input-bordered w-full focus:input-secondary transition-all duration-200"
                value={inputs.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
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
                placeholder="Create a strong password"
                className="input input-bordered w-full focus:input-secondary transition-all duration-200"
                value={inputs.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-medium">
                  <FaLock className="inline mr-2" />
                  Confirm Password
                </span>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="input input-bordered w-full focus:input-secondary transition-all duration-200"
                value={inputs.confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputs({ ...inputs, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            {/* Gender Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content font-medium">
                  Select Gender
                </span>
              </label>
              <GenderCheckbox
                onCheckboxChange={handleCheckboxChange}
                selectedGender={inputs.gender}
              />
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                className={`btn btn-secondary w-full transition-all duration-200 ${
                  loading ? "loading" : "hover:scale-105"
                }`}
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <FaUserPlus className="mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-4">
              <span className="text-base-content/70">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="link link-secondary hover:link-accent transition-colors duration-200 font-medium"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
