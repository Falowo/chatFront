import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
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
import {
  selectCurrentUser,
  setCoverPictureAsync,
  setProfilePictureAsync,
  selectEditDescMode,
  setEditDescMode,
} from "../../app/slices/currentUserSlice";
import CreateIcon from "@mui/icons-material/Create";
import ProfileDescForm from "../../components/profileDescForm/ProfileDescForm";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { username } = useParams();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const selectedUser = useAppSelector(selectSelectedUser);
  const editDescMode = useAppSelector(selectEditDescMode);

  const isFetching = useAppSelector(selectPosts).isFetching;
  const [fileProfilePicture, setFileProfilePicture] =
    useState<File | undefined>();
  const [fileCoverPicture, setFileCoverPicture] = useState<
    File | undefined
  >();
  const [isCurrentUserPage, setIsCurrentUserPage] =
    useState<boolean>(
      !!(currentUser?._id === selectedUser?._id),
    );
  const changeProfilePicture = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    !!fileProfilePicture &&
      dispatch(setProfilePictureAsync(fileProfilePicture));
    setFileProfilePicture(undefined);
  };
  const changeCoverPicture = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    !!fileCoverPicture &&
      dispatch(setCoverPictureAsync(fileCoverPicture));
    setFileCoverPicture(undefined);
  };

  useEffect(() => {
    dispatch(setSelectedUserAsync(username));
  }, [dispatch, username]);

  useEffect(() => {
    !!currentUser?._id &&
      !!selectedUser?._id &&
      setIsCurrentUserPage(
        !!(currentUser?._id === selectedUser?._id),
      );
  }, [currentUser?._id, selectedUser?._id]);

  useEffect(() => {
    !!selectedUser?._id &&
      !isCurrentUserPage &&
      dispatch(
        getSelectedUserPostsAsync(selectedUser.username!),
      );
  }, [
    selectedUser?._id,
    dispatch,
    selectedUser?.username,
    isCurrentUserPage,
  ]);

  useEffect(() => {
    !!selectedUser?._id &&
      !isCurrentUserPage &&
      dispatch(
        getFriendsOfSelectedUserAsync(selectedUser._id),
      );
  }, [dispatch, isCurrentUserPage, selectedUser?._id]);

  useEffect(() => {
    !!selectedUser?._id &&
      !isCurrentUserPage &&
      dispatch(
        getFollowedBySelectedUserAsync(selectedUser._id),
      );
  }, [dispatch, isCurrentUserPage, selectedUser?._id]);

  useEffect(() => {
    dispatch(checkExp());
  }, [dispatch]);

  useEffect(() => {
    console.log({ isCurrentUserPage: isCurrentUserPage });
  }, [isCurrentUserPage]);

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
                      fileCoverPicture
                        ? URL.createObjectURL(
                            fileCoverPicture,
                          )
                        : !isCurrentUserPage
                        ? selectedUser?.coverPicture
                          ? PF + selectedUser.coverPicture
                          : PF + "person/noCover.png"
                        : currentUser?.coverPicture
                        ? PF + currentUser?.coverPicture
                        : PF + "person/noCover.png"
                    }
                    alt=""
                  />
                  <img
                    className="profileUserImg"
                    src={
                      fileProfilePicture
                        ? URL.createObjectURL(
                            fileProfilePicture,
                          )
                        : !isCurrentUserPage
                        ? selectedUser.profilePicture
                          ? PF + selectedUser.profilePicture
                          : PF + "person/noAvatar.webp"
                        : currentUser?.profilePicture
                        ? PF + currentUser?.profilePicture
                        : PF + "person/noAvatar.webp"
                    }
                    alt=""
                  />
                  {isCurrentUserPage && (
                    <>
                      <form
                        className="profilePictureForm"
                        onSubmit={changeProfilePicture}
                      >
                        <label
                          htmlFor="fileProfilePicture"
                          className="profilePictureLabel"
                        >
                          <PhotoCameraRoundedIcon className="photoCamera" />

                          <input
                            style={{ display: "none" }}
                            type="file"
                            id="fileProfilePicture"
                            accept=".png,.jpeg,.jpg"
                            onChange={(
                              e: React.ChangeEvent,
                            ) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const target =
                                e.target as HTMLInputElement;
                              console.log(target);

                              setFileProfilePicture(
                                (
                                  target.files as FileList
                                )[0],
                              );
                            }}
                          />
                        </label>
                        {!!fileProfilePicture && (
                          <button
                            className="profilePictureButton"
                            type="submit"
                          >
                            Use it as profile picture !
                          </button>
                        )}
                      </form>
                      <form
                        className="coverPictureForm"
                        onSubmit={changeCoverPicture}
                      >
                        <label
                          htmlFor="fileCoverPicture"
                          className="coverPictureLabel"
                        >
                          <PhotoCameraRoundedIcon className="photoCamera" />

                          <input
                            style={{ display: "none" }}
                            type="file"
                            id="fileCoverPicture"
                            accept=".png,.jpeg,.jpg"
                            onChange={(
                              e: React.ChangeEvent,
                            ) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const target =
                                e.target as HTMLInputElement;
                              console.log(target);

                              setFileCoverPicture(
                                (
                                  target.files as FileList
                                )[0],
                              );
                            }}
                          />
                        </label>
                        {!!fileCoverPicture && (
                          <button
                            className="coverPictureButton"
                            type="submit"
                          >
                            Use it as cover picture !
                          </button>
                        )}
                      </form>
                    </>
                  )}
                </div>
                <div className="profileInfo">
                  <h4 className="profileInfoName">
                    {!!isCurrentUserPage
                      ? currentUser?.username
                      : selectedUser?.username}
                  </h4>
                  <Box sx={{ display: "flex",
                        alignItems: "center"
                }} >
                    {!!editDescMode ? (
                      <ProfileDescForm />
                    ) : (
                      <span className="profileInfoDesc">
                        {!!isCurrentUserPage
                          ? currentUser?.desc ||
                            "Add a description to your profile"
                          : selectedUser.desc}
                      </span>
                    )}
                    {!!isCurrentUserPage && (
                      <button className="editInfoButton">
                        <CreateIcon
                          sx={{
                            border: 1,
                            borderRadius: "25%",
                            padding: 0.7,
                            marginRight: "0.5rem",
                            marginLeft: "2rem",
                            fontSize: "large",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            dispatch(
                              setEditDescMode(
                                !editDescMode,
                              ),
                            )
                          }
                        />
                      </button>
                    )}
                  </Box>
                </div>
              </div>
              <div className="profileRightBottom">
                {!isFetching ? (
                  <Feed username={username} />
                ) : (
                  <h1>Fetching...</h1>
                )}

                <Rightbar />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
