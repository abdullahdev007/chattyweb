import { SafeUser, UserDocument } from "@shared/types/models/user";

export default function toSafeUser(user: UserDocument): SafeUser {
  const { password, __v, ...safeUser } = user.toObject();
  return safeUser;
}

export function toSafeUsers(users: UserDocument[]): SafeUser[] {
  return users.map((user) => {
    const { password, __v, ...safeUser } = user.toObject();
    return safeUser;
  });
}
