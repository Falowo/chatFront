import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { createPost } from "../../api/posts.api";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import {
  createPostAsync,
  updatePostAsync,
  selectIsEditing,
  selectPostEditing,
  setIsEditing,
} from "../../app/slices/postsSlice";
import { useParams } from "react-router-dom";
import { selectSelectedUser } from "../../app/slices/selectedUserSlice";
// import { IPost } from "../../interfaces";
// import SharePopup from "./SharePopup";

export default function Share() {
  const currentUser = useAppSelector(selectCurrentUser);
  const selectedUser = useAppSelector(selectSelectedUser);
  const isEditing = useAppSelector(selectIsEditing);
  const postEditing = useAppSelector(selectPostEditing);
  const { username } = useParams();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc: any = useRef();
  // const refToTop: any = useRef();
  const [file, setFile] = useState<File | undefined>();
  const dispatch = useAppDispatch();
  let onTheWallOf: string;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!!username && !!selectedUser) {
      onTheWallOf = selectedUser._id!;
    }

    if (!!currentUser && !isEditing) {
      dispatch(
        createPostAsync({
          currentUserId: currentUser._id!,
          desc: desc.current.value,
          onTheWallOf,
          file,
        }),
      );
    } else if (
      !!isEditing &&
      !!postEditing &&
      !!currentUser
    ) {
      const newPost = {
        ...postEditing,
        desc: desc.current.value,
      };
      console.log({ file, newPost });

      dispatch(
        updatePostAsync({
          newPost,
          file,
        }),
      );
      dispatch(setIsEditing(false));
    }
    desc.current.value = "";
    setFile(undefined);
  };
  useEffect(() => {
    console.log(file);
  }, [file]);
  useEffect(() => {
    !!isEditing &&
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
  }, [isEditing]);

  return (
    <div
      className="share"
      // ref={refToTop}
    >
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              currentUser?.profilePicture
                ? PF + currentUser?.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={
              selectedUser?._id === currentUser?._id ||
              !selectedUser
                ? "What's in your mind " +
                  currentUser?.username +
                  "?"
                : `Write something on ${selectedUser?.username}'s wall `
            }
            className="shareInput"
            ref={desc}
            defaultValue={postEditing?.desc}
          />
        </div>
        <hr className="shareHr" />
        <div className="shareImgContainer">
          {file ? (
            <img
              className="shareImg"
              src={URL.createObjectURL(file)}
              alt=""
            />
          ) : !!isEditing &&
            !!postEditing &&
            postEditing.img ? (
            <img
              className="shareImg"
              src={PF! + postEditing.img}
              alt=""
            />
          ) : null}
          <Cancel
            className="shareCancelImg"
            onClick={() => setFile(undefined)}
          />
        </div>
        <form
          className="shareBottom"
          onSubmit={submitHandler}
        >
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia
                htmlColor="tomato"
                className="shareIcon"
              />
              <span className="shareOptionText">
                Photo or Video
              </span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e: React.ChangeEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const target =
                    e.target as HTMLInputElement;
                  setFile((target.files as FileList)[0]);
                }}
              />
            </label>
            <div className="shareOption">
              <Label
                htmlColor="blue"
                className="shareIcon"
              />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room
                htmlColor="green"
                className="shareIcon"
              />
              <span className="shareOptionText">
                Location
              </span>
            </div>
            <div className="shareOption">
              <EmojiEmotions
                htmlColor="goldenrod"
                className="shareIcon"
              />
              <span className="shareOptionText">
                Feelings
              </span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            {!isEditing ? `Share` : `Edit`}
          </button>
        </form>
      </div>
    </div>
  );
}
