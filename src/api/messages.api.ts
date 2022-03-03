import { instance } from ".";
import { IMessage } from "../interfaces";

export const getMessagesByConversationIdParams = (
  conversationId: string,
) => {
  return instance.get(`messages/${conversationId}`);
};

export const createMessage = (
    message: IMessage
) => {
  return instance.post(`messages/`, message);
};
