export const NotificationTypes = {
  NewFriendRequest: "NewFriendRequest",
  FriendRequestRejected: "FriendRequestRejected",
  FriendRequestAccepted: "FriendRequestAccepted",
  RemoveFriendShip: "RemoveFriendShip",
} as const;

export type NotificationType =
  (typeof NotificationTypes)[keyof typeof NotificationTypes];
