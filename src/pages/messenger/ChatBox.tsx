import React, { useEffect, useRef, useState } from 'react'
import Message from '../../components/message/Message';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { conversationCheckedByCurrentUserAsync, createNewMessageAsync, selectCurrentChat, selectLastMessage, selectMessageEditing, setMessageEditing } from '../../app/slices/messengerSlice';
import { selectCurrentUser } from '../../app/slices/currentUserSlice';
import { socketSendMessage } from '../../app/slices/socketSlice';

export default function ChatBox() {
  const scrollSpan = useRef<any>();
  const currentUser = useAppSelector(selectCurrentUser);

  const [newMessage, setNewMessage] = useState<string>("");

  const dispatch = useAppDispatch();
  const lastMessage = useAppSelector(selectLastMessage);


  const messageEditing = useAppSelector(
    selectMessageEditing,
  );
  const currentChat = useAppSelector(selectCurrentChat);

  const sendNewMessage = async (senderId: string) => {
    try {
      dispatch(
        createNewMessageAsync({
          senderId,
          conversationId: currentChat?.conversation?._id!,
          text: newMessage,
          receivedByIds: [],
          checkedByIds: [],
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };


  const handleSubmit = () => {
    if (!messageEditing) {
      sendNewMessage(currentUser!._id!);
    } else {
      dispatch(
        setMessageEditing({
          ...messageEditing,
          text: newMessage,
        }),
      );
    }
  };

  useEffect(() => {
    scrollSpan.current.scrollIntoView();
  }, [currentChat, dispatch]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (!messageEditing) {
      setNewMessage(e.target.value);
    } else {
      dispatch(
        setMessageEditing({
          ...messageEditing,
          text: e.target.value,
        }),
      );
    }
  };
  return (
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
            onChange={(e) => handleChange(e)}
            onFocus={() => {
              !!currentUser?._id &&
                !!currentChat?.conversation?._id! &&
                dispatch(
                  conversationCheckedByCurrentUserAsync(
                    {
                      conversationId:
                        currentChat?.conversation
                          ?._id!,
                      currentUserId: currentUser._id!,
                    },
                  ),
                );
            }}
            value={
              !messageEditing
                ? newMessage
                : messageEditing.text
            }
          />
          <button
            className="chatSubmitButton"
            onClick={() => handleSubmit()}
          >
            {!messageEditing ? `Send` : `Edit`}
          </button>
        </div>
      )}
    </div>
  </div>
  )
}
