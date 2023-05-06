import React, { useEffect, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import "./messenger.css";
// import { io, Socket } from "socket.io-client";
import { socket } from "../../config/config.socket";
import { IConversation, IPMessage } from "../../interfaces";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  getExisitingConversationOrCreateOneAsync,
  messageCheckedByRemoteUser,
  messageReceivedByCurrentUserAsync,
  messageReceivedByRemoteUser,
  selectCurrentChat,
  selectLastMessage,
  selectLastMessagesCheckedByCurrentUser,
  selectSelectedConversation,
  setCurrentChatAsync,
} from "../../app/slices/messengerSlice";
import {
  addFriendAsync,
  selectCurrentUser,
  selectFriendsOfCurrentUser,
} from "../../app/slices/currentUserSlice";
import {
  socketCurrentUserCheckMessagesAsync,
  socketGotMessage,
} from "../../app/slices/socketSlice";
import ChatBox from "../chatBox/ChatBox";
import ChatMenu from "../chatMenu/ChatMenu";
export interface IChat {
  conversation: IConversation;
  messages: IPMessage[];
}

export interface SocketGetMessageProps {
  conversation: IConversation;
  message: IPMessage;
}
export interface SocketReceivedMessage {
  message: IPMessage;
  receiverId: string;
}

const Messenger = ({ userId }: { userId?: string }) => {
  const currentUser = useAppSelector(selectCurrentUser);

  const currentUserFriends = useAppSelector(
    selectFriendsOfCurrentUser,
  );
 

  const [getMessageFromSocket, setGetMessageFromSocket] =
    useState<SocketGetMessageProps | undefined>(undefined);
  const [
    receivedMessageFromSocket,
    setReceivedMessageFromSocket,
  ] = useState<SocketReceivedMessage | undefined>(
    undefined,
  );
  const [
    checkedMessageFromSocket,
    setCheckedMessageFromSocket,
  ] = useState<SocketReceivedMessage | undefined>(
    undefined,
  );
  const currentChat = useAppSelector(selectCurrentChat);
  const selectedConversation = useAppSelector(
    selectSelectedConversation,
  );

  const lastMessage = useAppSelector(selectLastMessage);
  const lastMessagesCheckedByCurrentUser = useAppSelector(
    selectLastMessagesCheckedByCurrentUser,
  );

  // const isFetching = useAppSelector(selectMessengerIsfetching)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      currentChat &&
      !!currentUser &&
      currentChat?.conversation?.membersId?.length === 2
    ) {
      const receiverId =
        currentChat.conversation.membersId.find(
          (id) => id !== currentUser?._id,
        );

      if (
        !!receiverId &&
        !!currentUserFriends &&
        !currentUserFriends
          ?.map((f) => f._id)
          .includes(receiverId)
      ) {
        dispatch(addFriendAsync({ userId: receiverId }));
      }
    }
  }, [
    currentChat,
    currentChat?.conversation.membersId,
    currentUser,
    currentUser?._id,
    currentUserFriends,
    dispatch,
  ]);

  useEffect(() => {
    socket?.on(
      "getMessage",
      (props: SocketGetMessageProps) => {
        setGetMessageFromSocket(props);
      },
    );
  }, [currentUser?._id, dispatch, lastMessage?._id]);

  useEffect(() => {
    if (!!getMessageFromSocket && !!currentUser?._id) {
      const { conversation, message } =
        getMessageFromSocket;

      dispatch(
        messageReceivedByCurrentUserAsync({
          conversation,
          messageId: message._id!,
        }),
      );

      dispatch(
        socketGotMessage({
          message,
          receiverId: currentUser._id!,
        }),
      );
    }
  }, [getMessageFromSocket, currentUser?._id, dispatch]);

  useEffect(() => {
    socket?.on(
      "receivedMessage",
      (props: SocketReceivedMessage) => {
        // const { receiverId, message } = props;
        setReceivedMessageFromSocket(props);
      },
    );
  }, [dispatch]);

  useEffect(() => {
    !!receivedMessageFromSocket &&
      dispatch(
        messageReceivedByRemoteUser(
          receivedMessageFromSocket,
        ),
      );
  }, [
    dispatch,
    receivedMessageFromSocket,
    receivedMessageFromSocket?.message._id,
  ]);

  useEffect(() => {
    socket?.on(
      "checkedMessage",
      (props: SocketReceivedMessage) => {
        setCheckedMessageFromSocket(props);
      },
    );
  }, []);

  useDeepCompareEffect(() => {
    if (!!checkedMessageFromSocket) {
      const { receiverId, message } =
        checkedMessageFromSocket;

      dispatch(
        messageCheckedByRemoteUser({
          checkedMessageId: message._id!,
          conversationId: message.conversationId,
          userId: receiverId,
        }),
      );
    }
  }, [checkedMessageFromSocket, dispatch]);

  useEffect(() => {
    !!userId &&
      dispatch(
        getExisitingConversationOrCreateOneAsync({
          userId,
        }),
      );
  }, [dispatch, userId]);

  useDeepCompareEffect(() => {
    if (currentUser?._id) {
      !!lastMessagesCheckedByCurrentUser.length &&
        dispatch(
          socketCurrentUserCheckMessagesAsync({
            messagesIds: lastMessagesCheckedByCurrentUser,
            currentUserId: currentUser?._id!,
          }),
        );
      console.log({ lastMessagesCheckedByCurrentUser });
    }
  }, [
    currentUser?._id,
    dispatch,
    lastMessagesCheckedByCurrentUser,
  ]);

  useEffect(() => {
    !!currentUser?._id &&
      dispatch(
        setCurrentChatAsync({
          selectedIConversation: selectedConversation,
        }),
      );
  }, [currentUser, dispatch, selectedConversation, userId]);

  return (
    <>
      <div className="messenger">
        <ChatMenu/>
        <ChatBox />
      </div>
    </>
  );
};

export default Messenger;
