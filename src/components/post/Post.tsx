import "./post.css";
import { MoreVert, ThumbUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { IPost, IUser } from "../../interfaces";
import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";
import {
  selectFollowedByCurrentUser,
  selectFriendsOfCurrentUser,
} from "../../app/slices/currentUserSlice";
import { likePostAsync } from "../../app/slices/postsSlice";

export interface PostProps {
  post: IPost;
}

export default function Post(props: PostProps) {
  const { post } = props;
  const [like, setLike] = useState(
    post.likersId?.length || 0,
  );
  const friendsOfCurrentUser = useAppSelector(
    selectFriendsOfCurrentUser,
  );
  const followedByCurrentUser = useAppSelector(
    selectFollowedByCurrentUser,
  );
  const [user, setUser] = useState<IUser>();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const [isLiked, setIsLiked] = useState(
    !!post.likersId?.includes(currentUser?._id!),
  );

  useEffect(() => {
    !!currentUser &&
      setIsLiked(
        !!post.likersId?.includes(currentUser._id!),
      );
  }, [currentUser, post.likersId]);

  useEffect(() => {
    const fetchUser = () => {
      if (post.userId !== currentUser?._id) {
        let usR = friendsOfCurrentUser.find(
          (f) => f._id! === post.userId,
        );
        if (!usR) {
          usR = followedByCurrentUser.find(
            (f) => f._id === post.userId,
          );
        }
        setUser(usR);
      } else {
        setUser(currentUser);
      }
    };

    !!post?.userId && !user && fetchUser();
  }, [
    currentUser,
    followedByCurrentUser,
    friendsOfCurrentUser,
    post.userId,
    user,
  ]);

  const likeHandler = async () => {
    if (!!currentUser?._id) {
      try {
        dispatch(likePostAsync(post._id!));
      } catch (err) {}
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user?.username}`}>
              <img
                className="postProfileImg"
                src={
                  user?.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">
              {user?.username}
            </span>
            <span className="postDate">
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post?.img && (
            <img
              className="postImg"
              src={PF! + post.img}
              alt=""
            />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <ThumbUp
              onClick={likeHandler}
              color="primary"
              style={{ cursor: "pointer" }}
            />

            <span className="postLikeCounter">
              {like} people like it
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              3 comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
