import { instance } from ".";

export const getCurrentUserConversations = (
) => {
  return instance.get(`conversations/allOfUser`);
};

export const getCurrentUserLastConversation = () => {
  return instance.get(`conversations/last`);
};

export const getPrivateConversationByFriendIdParams = (
  userId: string,
) => {
  return instance.get(`conversations/private/${userId}`);
};
export const createNewConversation = (
  receiversId: string[],
  groupName?: string,
) => {
  return instance.post(`conversations/`, {receiversId, groupName});
};
