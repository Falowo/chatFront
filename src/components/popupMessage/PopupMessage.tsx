import { Delete, Edit } from "@material-ui/icons";
import React from "react";
import { IPMessage } from "../../interfaces";

export default function PopupMessage({
  message,
  onEditClick,
  onDeleteClick,
}: {
  message: IPMessage;
  onEditClick: (e:React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onDeleteClick: (e:React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50px",
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
        onClick={onEditClick}
      />
      <Delete
        style={{ margin: "1rem" }}
        onClick={onDeleteClick}
      />
    </div>
  );
}
