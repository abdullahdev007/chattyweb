export interface SignupRequestBody {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: "male" | "female";
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface ChangePasswordRequestBody {
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileRequestBody {
  username: string;
  fullName: string;
  gender: "male" | "female";
}
