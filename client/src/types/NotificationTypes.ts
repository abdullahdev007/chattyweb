export type NotificationType =
  | "NewFriendRequest"
  | "NewMessage"
  | "FriendRequestRejected"
  | "FriendRequestAccepted"
  | "RemoveFriendShip";

export const NotificationTypes = {
  NewFriendRequest: "NewFriendRequest" as const,
  NewMessage: "NewMessage" as const,
  FriendRequestRejected: "FriendRequestRejected" as const,
  FriendRequestAccepted: "FriendRequestAccepted" as const,
  RemoveFriendShip: "RemoveFriendShip" as const,
} as const;

export default NotificationTypes;
