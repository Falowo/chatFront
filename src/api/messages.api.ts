import { instance } from ".";
import { IMessage } from "../interfaces";

export const getMessagesByConversationIdParams = (
  conversationId: string,
) => {
  return instance.get(`messages/${conversationId}`);
};
export const getLastMessageByConversationIdParams = (
  conversationId: string,
) => {
  return instance.get(
    `messages/lastOneOf/${conversationId}`,
  );
};
export const getMessagesArrayFromIds = (
  messagesIds: string[],
) => {
  return instance.post(`messages/array/fromIds`, {
    messagesIds,
  });
};

export const createMessage = (message: IMessage) => {
  return instance.post(`messages/`, message);
};
export const messageReceivedByCurrentUser = (props: {
  messageId: string;
}) => {
  return instance.put(
    `messages/receivedBy/currentUser`,
    props,
  );
};
export const messagesCheckedByCurrentUser = (props: {
  conversationId: string;
}) => {
  return instance.put(
    `messages/checkedBy/currentUser`,
    props,
  );
};

export const getCurrentUserUncheckedMessagesByConversationIdParams =
  (conversationId: string) => {
    return instance.get(
      `messages/unchecked/currentUser/${conversationId}`,
    );
  };
