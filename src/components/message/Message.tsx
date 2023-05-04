import "./message.css";
import moment from "moment";
import { IPMessage } from "../../interfaces";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import { useState } from "react";
import PopupMessage from "../popupMessage/PopupMessage";

export interface MessageProps {
  own: boolean;
  message: IPMessage;
}

const Message = (props: MessageProps) => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { own, message } = props;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { senderId } = message;
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const styles = {
    global: own
      ? {
          cursor: "pointer",
        }
      : {},
  };

  const handleClick = () => {
    own
      ? setIsOpenPopup(!isOpenPopup)
      : setIsOpenPopup(false);
  };

  return (
    <div
      className={own ? "message own" : "message"}
      style={{ ...styles.global, position: "relative" }}
      onClick={handleClick}
    >
      {isOpenPopup && <PopupMessage message={message} />}
      <div className="messageTop">  
        <img
          className="messageImg"
          src={
            senderId.profilePicture
              ? PF + senderId.profilePicture
              : PF + "/person/noAvatar.webp"
          }
          alt=""
        />
        <p className="messageText">{message.text}</p>
        {message?.senderId?._id! === currentUser?._id! && (
          <div>
            {message?.status === 40 ? (
              <DoneAllIcon
                color={`${"primary"}`}
                fontSize="small"
              />
            ) : message?.status === 30 ? (
              <DoneAllIcon fontSize="small" />
            ) : message?.status === 20 ? (
              <DoneIcon fontSize="small" />
            ) : (
              <AccessTimeIcon fontSize="small" />
            )}
          </div>
        )}
      </div>
      <div className="messageBottom">
        {moment(message.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default Message;
