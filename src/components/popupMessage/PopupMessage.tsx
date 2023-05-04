import { Delete, Edit } from "@material-ui/icons";
import React from "react";
import { IPMessage } from "../../interfaces";
import { useAppDispatch } from "../../app/hooks";
import { setMessageEditing } from "../../app/slices/messengerSlice";

export default function PopupMessage({message}:{message:IPMessage}) {
  const dispatch = useAppDispatch();
  return (
    <div
      style={{
        position: "absolute",
        top: "-75px",
        right: "8px",
        borderRadius: "3px",
        boxShadow: "0px 0px 16px -8px rgba(0, 0, 0, 0.68)",
        margin: "30px 0",
        display: "flex",
        justifyContent: "end",
        zIndex: 1,
        backgroundColor: "lightgray",
      }}
    >
      <Edit
        style={{ margin: "1rem" }}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setMessageEditing(message));

        }}
      />
      <Delete
        style={{ margin: "1rem" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
}
