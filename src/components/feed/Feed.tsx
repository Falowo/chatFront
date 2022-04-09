import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";

import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import { useAppSelector } from "../../app/hooks";

import {
  selectCurrentUserPosts,
  selectPosts,
  selectTimeline,
} from "../../app/slices/postsSlice";

export interface FeedProps {
  username?: string;
}

export default function Feed(props: FeedProps) {
  const { username } = props;

  const currentUser = useAppSelector(selectCurrentUser);

  const currentUserPosts = useAppSelector(
    selectCurrentUserPosts,
  );

  const postsState = useAppSelector(selectPosts);
  const selectedUserPosts = postsState.selectedUserPosts;
  const timeline = useAppSelector(selectTimeline);

  // const url = process.env.REACT_APP_API_URL;

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />

        {!!username
          ? username === currentUser?.username
            ?  !!currentUserPosts.length && currentUserPosts.map((p) => (
                <Post key={p._id} post={p} />
              ))
            : !!selectedUserPosts.length && selectedUserPosts!.map((p) => (
                <Post key={p._id} post={p} />
              ))
          : !!timeline.length && timeline?.map((p) => (
              <Post key={p._id} post={p} />
            ))}
      </div>
    </div>
  );
}
