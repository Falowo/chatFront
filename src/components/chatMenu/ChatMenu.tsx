import React from "react";
import "./chatMenu.css";
import Conversation from "../conversation/Conversation";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  conversationCheckedByCurrentUserAsync,
  selectConversations,
  selectCurrentChat,
  setCurrentChatAsync,
} from "../../app/slices/messengerSlice";
import { selectCurrentUser } from "../../app/slices/currentUserSlice";

export default function ChatMenu() {
  const conversations = useAppSelector(selectConversations);
  const currentUser = useAppSelector(selectCurrentUser);
  const currentChat = useAppSelector(selectCurrentChat);
  const dispatch = useAppDispatch();
  return (
    <div>
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
                          currentUserId: currentUser?._id!,
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
    </div>
  );
}
