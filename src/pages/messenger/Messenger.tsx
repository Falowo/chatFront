import React, { useEffect, useRef, useState } from "react";
import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
// import ChatOnline from "../../components/chatOnline/ChatOnline";
// import { io, Socket } from "socket.io-client";
import { socket } from "../../config/config.socket";
import { IConversation, IPMessage } from "../../interfaces";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import { selectCurrentUser } from "../../app/slices/authSlice";
import {
  createNewMessageAsync,
  getConversationsAsync,
  getExisitingConversationOrCreateOneAsync,
  receiveNewMessage,
  selectConversations,
  selectCurrentChat,
  selectLastMessage,
  selectSelectedConversation,
  setCurrentChatAsync,
} from "../../app/slices/messengerSlice";
import { useParams } from "react-router-dom";
import {
  addFriendAsync,
  selectFriendsOfCurrentUser,
} from "../../app/slices/currentUserSlice";
import { socketSendMessage } from "../../app/slices/socketSlice";
export interface IChat {
  conversation: IConversation;
  messages: IPMessage[];
}

const Messenger = () => {
  const scrollSpan = useRef<any>();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserFriends = useAppSelector(
    selectFriendsOfCurrentUser,
  );
  const conversations = useAppSelector(selectConversations);
  const currentChat = useAppSelector(selectCurrentChat);
  const selectedConversation = useAppSelector(
    selectSelectedConversation,
  );
  const { userId } = useParams();
  const lastMessage = useAppSelector(selectLastMessage);
  // const isFetching = useAppSelector(selectMessengerIsfetching)
  const dispatch = useAppDispatch();

  const [newMessage, setNewMessage] = useState<string>("");
  // const [socket, setSocket] = useState<Socket | null>(null);

  const sendNewMessage = async (senderId: string) => {
    try {
      dispatch(
        createNewMessageAsync({
          senderId,
          conversationId: currentChat?.conversation?._id!,
          text: newMessage,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    

    if (
      !!lastMessage &&
      currentUser?._id! &&
      currentChat?.conversation?._id ===
        lastMessage.conversationId &&
      lastMessage.senderId?._id === currentUser?._id!
    ) {
      
      dispatch(
        socketSendMessage({
          conversation: currentChat?.conversation,
          message: lastMessage,
          currentUserId: currentUser?._id!,
        }),
      );
      console.log("socketSendMessage");

      setNewMessage("");
    }
  }, [
    currentChat?.conversation,
    currentUser?._id,
    dispatch,
    lastMessage,
  ]);

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
        !currentUserFriends
          .map((f) => f._id)
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
    !!currentUser && dispatch(getConversationsAsync());
  }, [currentUser, dispatch]);

  useEffect(() => {
    interface GetMessageProps {
      conversation: IConversation;
      message: IPMessage;
    }
    socket?.on("getMessage", (props: GetMessageProps) => {
      const { conversation, message } = props;
      console.log("getMessage");
      console.log({ message });

      dispatch(
        receiveNewMessage({ conversation, message }),
      );
    });
  }, [dispatch]);

  useEffect(() => {
    !!userId &&
      dispatch(
        getExisitingConversationOrCreateOneAsync({
          userId,
        }),
      );
  }, [dispatch, userId]);

  useEffect(() => {
    !!currentUser?._id &&
      dispatch(
        setCurrentChatAsync({
          selectedIConversation: selectedConversation,
        }),
      );
  }, [currentUser, dispatch, selectedConversation, userId]);

  useEffect(() => {
    scrollSpan.current.scrollIntoView();
  }, [currentChat, dispatch]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for friend"
              className="chatMenuInput"
            />
            <div className="chatMenuListConversationsWrapper">
              {conversations && conversations?.length ? (
                conversations.map((c) => (
                  <button
                    className="onClickButtonWrapper conversationItem"
                    key={c._id}
                    onClick={() =>
                      dispatch(
                        setCurrentChatAsync({
                          selectedIPConversation: c,
                        }),
                      )
                    }
                  >
                    <Conversation
                      conversation={c}
                      key={c._id}
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
        <div className="chatBox">
          <div className="chatBoxWrapper ">
            <div className="chatBoxTop">
              {!!currentChat && !!currentChat?.messages ? (
                currentChat?.messages?.map((m) => (
                  <Message
                    message={m}
                    own={
                      m.senderId._id === currentUser!._id
                    }
                    key={m._id}
                  />
                ))
              ) : (
                <span className="noConversationText">
                  Select or start a conversation
                </span>
              )}

              <span ref={scrollSpan}></span>
            </div>
            {!!currentChat?.conversation && (
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput"
                  placeholder="Write something"
                  onChange={(e) =>
                    setNewMessage(e.target.value)
                  }
                  value={newMessage}
                />
                <button
                  className="chatSubmitButton"
                  onClick={() =>
                    sendNewMessage(currentUser!._id!)
                  }
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <button className="onClickButtonWrapper">
              {/* <ChatOnline /> */}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;
