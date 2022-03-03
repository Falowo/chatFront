import React, { useState, useEffect } from "react";
import "./conversation.css";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import moment from "moment";
import { IPConversation } from "../../interfaces";
import { getUserByUserIdQuery } from "../../api/users.api";
import { selectCurrentUser } from "../../app/slices/authSlice";
import { useAppSelector } from "../../app/hooks";

export interface ConversationProps {
  conversation: IPConversation;
  selected: boolean;
}

const Conversation = (props: ConversationProps) => {
  const { conversation, selected } = props;
  const currentUser = useAppSelector(selectCurrentUser);
  const [conversationName, setConversationName] = useState<
    string | null
  >(null);
  const [conversationPicture, setConversationPicture] =
    useState<string | null>(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleSetConversationName = async (
    conversation: IPConversation,
  ) => {
    if (!!conversation && !conversation?.groupName) {
      // console.log("!conversation.groupName");

      const friendIdArray: string[] | undefined =
        conversation.membersId!.filter(
          (m: string | undefined) => m !== currentUser!._id,
        );
      const friendId = friendIdArray[0];

      const res = await getUserByUserIdQuery(friendId);
      const friend = res.data._doc;
      setConversationName(
        friendIdArray?.length === 1
          ? friend.username
          : `${friend.username} and ${
              friendIdArray.length - 1
            } more ... `,
      );
      setConversationPicture(
        friend.profilePicture
          ? PF + friend.profilePicture
          : PF + "person/noAvatar.png",
      );
    } else if (!!conversation) {
      // console.log("HASHTAG !!CONVERSATION");

      setConversationName(
        conversation.groupName || "Unnamed conversation",
      );
      setConversationPicture(
        conversation.groupPicture
          ? PF + conversation.groupPicture
          : PF + "person/noAvatar.png",
      );
    }
  };

  useEffect(() => {
    handleSetConversationName(conversation);
  });

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
              conversationPicture ||
              PF + "person/noAvatar.png"
            }
            alt="conversationName"
            className="conversationImg"
          />
          <div className="textWrapper">
            <div className="conversationNameWrapper">
              <span className="conversationName">
                {conversationName}
              </span>
              <span className="fromNow">
                {moment(
                  conversation.lastMessageId?.createdAt!,
                ).fromNow()}
              </span>
            </div>

            <div className="lastMessage">
              <div className="iconDiv">
                {conversation.lastMessageId?.status ===
                40 ? (
                  <DoneAllIcon
                    color={`${"primary"}`}
                    fontSize="small"
                  />
                ) : conversation.lastMessageId?.status ===
                  30 ? (
                  <DoneAllIcon fontSize="small" />
                ) : conversation.lastMessageId?.status ===
                  20 ? (
                  <DoneIcon fontSize="small" />
                ) : conversation.lastMessageId?._id ? (
                  <AccessTimeIcon fontSize="small" />
                ) : null}
              </div>

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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Conversation;
