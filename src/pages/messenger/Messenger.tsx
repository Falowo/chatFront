import React, { useEffect, useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import "./messenger.css";
import Conversation from "../../components/conversation/Conversation";
// import { io, Socket } from "socket.io-client";
import { socket } from "../../config/config.socket";
import { IConversation, IPMessage } from "../../interfaces";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  conversationCheckedByCurrentUserAsync,
  getExisitingConversationOrCreateOneAsync,
  messageCheckedByRemoteUser,
  messageReceivedByCurrentUserAsync,
  messageReceivedByRemoteUser,
  selectConversations,
  selectCurrentChat,
  selectLastMessage,
  selectLastMessagesCheckedByCurrentUser,
  selectSelectedConversation,
  setCurrentChatAsync,
} from "../../app/slices/messengerSlice";
import { useParams } from "react-router-dom";
import {
  addFriendAsync,
  selectCurrentUser,
  selectFriendsOfCurrentUser,
} from "../../app/slices/currentUserSlice";
import {
  socketCurrentUserCheckMessagesAsync,
  socketGotMessage,
} from "../../app/slices/socketSlice";
import ChatBox from "./ChatBox";
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

const Messenger = () => {
  const currentUser = useAppSelector(selectCurrentUser);

  const currentUserFriends = useAppSelector(
    selectFriendsOfCurrentUser,
  );
  const conversations = useAppSelector(selectConversations);

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
 
  const { userId } = useParams();
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
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <h3>Conversations</h3>
            <div className="chatMenuListConversationsWrapper">
              {conversations && conversations?.length ? (
                conversations?.map((c) => (
                  <button
                    className="onClickButtonWrapper conversationItem"
                    key={c._id!}
                    onClick={() => {
                      dispatch(
                        setCurrentChatAsync({
                          selectedIPConversation: c,
                        }),
                      );
                      dispatch(
                        conversationCheckedByCurrentUserAsync(
                          {
                            conversationId: c._id!,
                            currentUserId:
                              currentUser?._id!,
                          },
                        ),
                      );
                    }}
                  >
                    <Conversation
                      conversation={c}
                      key={c._id!}
                      selected={
                        currentChat?.conversation._id ===
                        c._id
                      }
                    />
                  </button>
                ))
              ) : (
                <span>No conversations</span>
              )}
            </div>
          </div>
        </div>
        <ChatBox/>
      </div>
    </>
  );
};

export default Messenger;
