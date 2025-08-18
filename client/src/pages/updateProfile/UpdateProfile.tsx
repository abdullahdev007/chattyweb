import { FC, useEffect, useState, FormEvent, ChangeEvent } from "react";
import GenderCheckbox from "@/components/GenderCheckbox/GenderCheckbox";
import useUpdateProfile from "@/hooks/auth/useUpdateProfile";
import { useAuthContext } from "@/context/AuthContext";
import { UpdateProfileRequestBody } from "@shared/types/http";
import { Gender } from "@shared/types/types";
import { FaUser, FaIdCard, FaUserEdit, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

interface FormInputs {
  fullName: string;
  username: string;
  gender: Gender;
}

const UpdateProfile: FC = () => {
  const { authUser } = useAuthContext();

  const [inputs, setInputs] = useState<FormInputs>({
    fullName: authUser!.fullName,
    username: authUser!.username,
    gender: authUser!.gender,
  });

  const { updateProfile, loading } = useUpdateProfile();

  const handleCheckboxChange = (gender: Gender) => {
    setInputs({ ...inputs, gender });
  };

  useEffect(() => {
    document.title = "ChattyWeb: Update Profile";
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(inputs);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[500px]">
      <div className="bg-base-200 shadow-lg rounded-lg overflow-hidden w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-primary p-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-accent-content">
            Update Profile
          </h1>
          <p className="text-accent-content/80 mt-2">
            Modify your account information
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
                className="input input-bordered w-full focus:input-accent transition-all duration-200"
                value={inputs.fullName}
                onChange={handleInputChange}
                name="fullName"
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
                className="input input-bordered w-full focus:input-accent transition-all duration-200"
                value={inputs.username}
                onChange={handleInputChange}
                name="username"
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
                className={`btn btn-accent w-full transition-all duration-200 ${
                  loading ? "loading" : "hover:scale-105"
                }`}
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <FaUserEdit className="mr-2" />
                    Update Profile
                  </>
                )}
              </button>
            </div>

            {/* Back to Home Link */}
            <div className="text-center mt-4">
              <Link
                to="/"
                className="link link-accent hover:link-primary transition-colors duration-200 font-medium inline-flex items-center"
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

export default UpdateProfile;
