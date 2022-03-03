import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useRef, useState } from "react";
// import axios from "axios";
// import { createPost } from "../../api/posts.api";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import { selectCurrentUser } from "../../app/slices/authSlice";
import {
  createPostAsync,
} from "../../app/slices/postsSlice";
import { useParams } from "react-router-dom";
import { selectSelectedUser } from "../../app/slices/selectedUserSlice";
// interface NewPost {
//   userId: string;
//   desc?: string;
//   img?: string;
// }

export default function Share() {
  const currentUser = useAppSelector(selectCurrentUser);
  const selectedUser = useAppSelector(selectSelectedUser);
  const { username } = useParams();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc: any = useRef();
  const [file, setFile] = useState<File | undefined>();
  const dispatch = useAppDispatch();
  let onTheWallOf: string;

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!!username && !!selectedUser) {
      onTheWallOf = selectedUser._id!;
    }

    !!currentUser &&
      dispatch(
        createPostAsync({
          currentUserId: currentUser._id!,
          desc: desc.current.value,
          onTheWallOf,
          file,
        }),
      );

    setFile(undefined);
    desc.current.value = "";
  };

  return (
    <div className="share">
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
              "What's in your mind " +
              currentUser?.username +
              "?"
            }
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img
              className="shareImg"
              src={URL.createObjectURL(file)}
              alt=""
            />
            <Cancel
              className="shareCancelImg"
              onClick={() => setFile(undefined)}
            />
          </div>
        )}
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
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
