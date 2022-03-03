import "./post.css";
import { MoreVert } from "@mui/icons-material";
import { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { IPost, IUser } from "../../interfaces";
import { getUserByUserIdQuery } from "../../api/users.api";
import { likePost } from "../../api/posts.api";
import { selectCurrentUser } from "../../app/slices/authSlice";
import { useAppSelector } from "../../app/hooks";

export interface PostProps {
  post: IPost;
}

export default function Post(props: PostProps) {
  const { post } = props;
  const [like, setLike] = useState(
    post.likersId?.length || 0,
  );
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState<IUser>();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const currentUser = useAppSelector(
    selectCurrentUser,
  );
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const currentUserId = currentUser?._id;
    setIsLiked(
      post.likersId?.includes(currentUserId!) || false,
    );
  }, [currentUser, post.likersId]);

  useEffect(() => {
    const fetchUser = async () => {
      
      const res = await getUserByUserIdQuery(post?.userId)
      console.log(res?.data?._doc?.username);
      setUser(res.data._doc);
    };
    fetchUser();
  }, [post.userId, url]);

  const likeHandler = async () => {
    if (currentUser?._id) {
      try {
        await likePost(post._id!, currentUser?._id!)
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
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
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
