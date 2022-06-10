import { io, Socket } from "socket.io-client";
import { IConversation, IPMessage } from "../interfaces";
import { useAppDispatch } from "../app/hooks";
import { receiveNewMessage } from "../app/slices/messengerSlice";

export const socket: Socket = io("ws://localhost:8800");

export const socketAddUser = (currentUserId: string) =>
  socket?.emit("addUser", currentUserId);

export const socketGetUsers = (action:Function) => 
  socket?.on(
    "getUsers",
    (
      users: Array<{ socketId: string; userId: string }>,
    ) => {
        console.log({users})
      return  action() ;
    },
  );

export const socketSendMessage = (props: {
  receiverId: string;
  conversation: IConversation;
  message: IPMessage;
}) =>
  socket?.emit("sendMessage", {
    receiverId: props.receiverId,
    conversation: props.conversation,
    message: props.message,
  });

export const SocketGetMessage = (action:Function) => {
  const dispatch = useAppDispatch();
  return socket?.on(
    "getMessage",
    (props: {
      conversation: IConversation;
      message: IPMessage;
    }) => {
      const { conversation, message } = props;
      console.log("getMessage");
      console.log({ message });

      dispatch(
        receiveNewMessage({ conversation, message }),
      );
    },
  );
};
