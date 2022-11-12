import Share from "./Share";
import React from "react";
import { IPost } from "../../interfaces";
import "./share.css";
export default function SharePopup(props: { post: IPost }) {
  const { post } = props;
  return (
    <div className="sharePopup">
      <Share post={post} />
    </div>
  );
}
