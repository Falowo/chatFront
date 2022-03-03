import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect } from "react";
import { useParams } from "react-router";
import {
  useAppSelector,
  useAppDispatch,
} from "../../app/hooks";
import {
  getFollowedBySelectedUserAsync,
  getFriendsOfSelectedUserAsync,
  selectSelectedUser,
  setSelectedUserAsync,
} from "../../app/slices/selectedUserSlice";
import {
  getSelectedUserPostsAsync,
  selectPosts,
} from "../../app/slices/postsSlice";
import { checkExp } from "../../app/slices/authSlice";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector(selectSelectedUser);
  const isFetching = useAppSelector(selectPosts).isFetching;

  useEffect(() => {
    dispatch(setSelectedUserAsync(username));
  }, [dispatch, username]);

  useEffect(() => {
    !!selectedUser?._id &&
      dispatch(
        getSelectedUserPostsAsync(selectedUser.username!),
      );
  }, [selectedUser?._id, dispatch]);

  useEffect(() => {
    !!selectedUser?._id &&
      dispatch(
        getFriendsOfSelectedUserAsync(
          selectedUser._id,
        ),
      );
  }, [dispatch, selectedUser?._id]);

  useEffect(() => {
    !!selectedUser?._id &&
      dispatch(
        getFollowedBySelectedUserAsync(
          selectedUser._id,
        ),
      );
  }, [dispatch, selectedUser?._id]);
  
  useEffect(() => {
    dispatch(checkExp());
}, [dispatch]);

  return (
    <>
      {!!selectedUser && (
        <>
          <Topbar />
          <div className="profile">
            <Sidebar />
            <div className="profileRight">
              <div className="profileRightTop">
                <div className="profileCover">
                  <img
                    className="profileCoverImg"
                    src={
                      selectedUser.coverPicture
                        ? PF + selectedUser.coverPicture
                        : PF + "person/noCover.png"
                    }
                    alt=""
                  />
                  <img
                    className="profileUserImg"
                    src={
                      selectedUser.profilePicture
                        ? PF + selectedUser.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                  />
                </div>
                <div className="profileInfo">
                  <h4 className="profileInfoName">
                    {selectedUser.username}
                  </h4>
                  <span className="profileInfoDesc">
                    {selectedUser.desc}
                  </span>
                </div>
              </div>
              <div className="profileRightBottom">

                {!isFetching ? (<Feed username={username} />):(<h1>Fetching...</h1>)} 
                
                <Rightbar />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
