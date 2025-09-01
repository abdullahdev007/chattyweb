import { GetUnreadCountResponse } from "@shared/types/http";
import { IConversation } from "@shared/types/models/conversation";

const getUnReadedMessageCount = async (conversation: IConversation) => {
  try {
    const res = await fetch(
      `/api/conversations/unreadCount/${conversation._id}`
    );
    const data: GetUnreadCountResponse = await res.json();

    if (!data.success) throw new Error(data.message);

    return data.unreadCount;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
};

export default getUnReadedMessageCount;
