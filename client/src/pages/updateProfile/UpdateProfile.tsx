import { FC, useEffect, useState, FormEvent, ChangeEvent } from "react";
import GenderCheckbox from "@/components/GenderCheckbox/GenderCheckbox";
import useUpdateProfile from "@/hooks/auth/useUpdateProfile";
import { useAuthContext } from "@/context/AuthContext";
import { UpdateProfileRequestBody } from "@shared/types/http";
import { Gender } from "@shared/types/types";

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
    document.title = "ChattyWeb: update profile";
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
    <div className="flex flex-col item center justify-center min-w-96 mx-auto">
      <div
        className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding
       backdrop-filter backdrop-blur-lg bg-opacity-0"
      >
        <h1 className="text-3xl font-semibold text-center text-color-gray-300">
          Update <span className="text-blue-500">ChattyWeb</span> Profile
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text"> Full Name </span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full input input-bordered h-10"
              value={inputs.fullName}
              onChange={handleInputChange}
              name="fullName"
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text"> Username </span>
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full input input-bordered h-10"
              value={inputs.username}
              onChange={handleInputChange}
              name="username"
            />
          </div>

          <GenderCheckbox
            onCheckboxChange={handleCheckboxChange}
            selectedGender={inputs.gender}
          />

          <div>
            <button className="btn btn-block btn-sm mt-6" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
