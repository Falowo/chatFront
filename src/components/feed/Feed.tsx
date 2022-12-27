import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";

import { selectCurrentUser } from "../../app/slices/currentUserSlice";
import { useAppSelector } from "../../app/hooks";

import {
  selectCurrentUserPosts,
  selectSelectedUserPosts,
  selectTimeline,
  // getTimelineAsync
} from "../../app/slices/postsSlice";
import { useEffect } from "react";

export interface FeedProps {
  username?: string;
}

export default function Feed(props: FeedProps) {
  const { username } = props;

  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserPosts = useAppSelector(
    selectCurrentUserPosts,
  );

  const selectedUserPosts = useAppSelector(
    selectSelectedUserPosts,
  );

  const timeline = useAppSelector(selectTimeline);

  useEffect(() => {
    !!username
      ? username === currentUser?.username
        ? !!currentUserPosts.length &&
          console.log({ currentUserPosts })
        : !!selectedUserPosts.length &&
          console.log({ selectedUserPosts })
      : !!timeline.length && console.log({ timeline });
  }, [
    currentUser?.username,
    currentUserPosts,
    selectedUserPosts,
    timeline,
    username,
  ]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />

        {!!username
          ? username === currentUser?.username
            ? !!currentUserPosts.length &&
              currentUserPosts.map((p) => (
                <Post key={p._id} post={p} />
              ))
            : !!selectedUserPosts.length &&
              selectedUserPosts!.map((p) => (
                <Post key={p._id} post={p} />
              ))
          : !!timeline.length &&
            timeline?.map((p) => (
              <Post key={p._id} post={p} />
            ))}
      </div>
    </div>
  );
}
