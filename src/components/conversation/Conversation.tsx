import React, { useState, useEffect } from "react";
import "./conversation.css";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import moment from "moment";
import { IPConversation } from "../../interfaces";
import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  selectUncheckedByCurrentUser,
  getConversationNameAndPictureAsync,
} from "../../app/slices/messengerSlice";

export interface ConversationProps {
  conversation: IPConversation;
  selected: boolean;
}

const Conversation = (props: ConversationProps) => {
  const { conversation, selected } = props;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const uncheckedByCurrentUser = useAppSelector(
    selectUncheckedByCurrentUser,
  );

  const [
    uncheckedByCurrentUserForThisConversation,
    setUncheckedByCurrentUserForThisConversation,
  ] = useState<string[] | undefined>([]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    !conversation.groupName &&
      dispatch(
        getConversationNameAndPictureAsync(conversation),
      );
  }, [conversation, dispatch]);

  useEffect(() => {
    if (!!uncheckedByCurrentUser) {
      const obj:
        | { messagesIds: string[]; conversationId: string }
        | undefined = uncheckedByCurrentUser.find(
        (u) => u.conversationId === conversation._id,
      );
      setUncheckedByCurrentUserForThisConversation(
        obj?.messagesIds,
      );
    }
  }, [conversation._id, uncheckedByCurrentUser]);

  return (
    <>
      {conversation && (
        <div
          className={`${
            !!selected && "lightgray"
          } conversation`}
        >
          <img
            src={
              conversation.groupPicture
                ? `${PF + conversation.groupPicture}`
                : `${PF + "person/noAvatar.webp"}`
            }
            alt="conversationName"
            className="conversationImg"
          />
          <div className="textWrapper">
            <div className="conversationNameWrapper">
              <span className="conversationName">
                {conversation.groupName}
              </span>

              <span
                className={`fromNow ${
                  !!uncheckedByCurrentUserForThisConversation &&
                  !!uncheckedByCurrentUserForThisConversation.length &&
                  "text-green"
                }`}
              >
                {moment(
                  conversation.lastMessageId?.createdAt!,
                ).fromNow()}
              </span>
            </div>

            <div className="lastMessage">
              <>
                {conversation.lastMessageId?.senderId ===
                  currentUser?._id && (
                  <div className="iconDiv">
                    {conversation.lastMessageId?.status ===
                    40 ? (
                      <DoneAllIcon
                        color={`${"primary"}`}
                        fontSize="small"
                      />
                    ) : conversation.lastMessageId
                        ?.status === 30 ? (
                      <DoneAllIcon fontSize="small" />
                    ) : conversation.lastMessageId
                        ?.status === 20 ? (
                      <DoneIcon fontSize="small" />
                    ) : conversation.lastMessageId?._id ? (
                      <AccessTimeIcon fontSize="small" />
                    ) : null}
                  </div>
                )}
              </>
              <>
                {!!conversation?.lastMessageId?.text &&
                conversation.lastMessageId.text.length >
                  30 ? (
                  <div className="longTextWrapper">
                    <span className="lastMessageText">
                      `$
                      {conversation.lastMessageId.text.substring(
                        0,
                        20,
                      )}{" "}
                      ...`
                    </span>
                  </div>
                ) : (
                  <span className="lastMessageText">
                    {conversation.lastMessageId?.text}
                  </span>
                )}

                {!!uncheckedByCurrentUserForThisConversation &&
                  !!uncheckedByCurrentUserForThisConversation.length && (
                    <span className="uncheckedMessages">
                      {
                        uncheckedByCurrentUserForThisConversation?.length
                      }
                    </span>
                  )}
              </>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Conversation;
