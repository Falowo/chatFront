import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Home from "./pages/home/Home";
import SignIn from "./pages/login/Login";
import SignUp from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import Profile from "./pages/profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useAppSelector,
  useAppDispatch,
} from "./app/hooks";
import { selectAuthUser } from "./app/slices/authSlice";
import Search from "./pages/search/Search";
import {
  selectConnectedUsers,
  setConnectedUsers,
  socketAddUser,
} from "./app/slices/socketSlice";
import { socket } from "./config/config.socket";
import {
  addFriendRequestFromAsync,
  getCurrentUserAsync,
  getFriendRequestsFromAsync,
  getFriendsOfCurrentUserAsync,
  selectCurrentUser,
  selectFriendsOfCurrentUser,
  setFriendRequestsTo,
  setNotCheckedAcceptedFriendRequestsBy,
  setNotCheckedFriendRequests,
} from "./app/slices/currentUserSlice";
import {
  getConversationsAsync,
  getUncheckedByCurrentUserAsync,
  selectConversations,
} from "./app/slices/messengerSlice";
import useDeepCompareEffect from "use-deep-compare-effect";
import FriendRequests from "./pages/friendRequests/FriendRequests";
// import { getBothFollowedByAndFollowersOfCurrentUserAsync } from "./app/slices/currentUserSlice";

const useStyles = makeStyles({
  contentStyle: {
    margin: "0 auto",
  },
});

const App = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectAuthUser);
  const currentUser = useAppSelector(selectCurrentUser);
  const friendsOfCurrentUser = useAppSelector(
    selectFriendsOfCurrentUser,
  );
  const conversations = useAppSelector(selectConversations);
  const connectedUsers = useAppSelector(
    selectConnectedUsers,
  );
  const [conversationsIdsSet, setConversationsIdsSet] =
    useState<Set<string> | undefined>(undefined);

  useEffect(() => {
    !!authUser?._id &&
      dispatch(getCurrentUserAsync(authUser._id!));
  }, [authUser?._id]);

  useEffect(() => {
    !!authUser?._id && dispatch(getConversationsAsync());
  }, [authUser?._id, dispatch]);

  useEffect(() => {
    conversations &&
      !!conversations?.length &&
      setConversationsIdsSet(
        new Set(conversations?.map((c) => c._id!)),
      );
  }, [conversations]);

  useDeepCompareEffect(() => {
    !!conversationsIdsSet &&
      dispatch(
        getUncheckedByCurrentUserAsync(conversationsIdsSet),
      );
  }, [conversationsIdsSet, dispatch]);

  useEffect(() => {
    !!authUser?._id &&
      dispatch(socketAddUser(authUser._id!));
  }, [authUser?._id, dispatch]);

  useEffect(() => {
    !!authUser?._id &&
      dispatch(
        setNotCheckedFriendRequests({
          userIds:
            authUser?.notCheckedFriendRequestsFrom || [],
        }),
      );
  }, [
    authUser?._id,
    currentUser?.notCheckedFriendRequestsFrom,
    dispatch,
  ]);

  useEffect(() => {
    !!authUser?._id &&
      dispatch(
        setNotCheckedAcceptedFriendRequestsBy({
          userIds:
            currentUser?.notCheckedAcceptedFriendRequestsBy ||
            [],
        }),
      );
  }, [
    authUser?._id,
    currentUser?.notCheckedAcceptedFriendRequestsBy,
    dispatch,
  ]);
  useEffect(() => {
    !!authUser?._id &&
      dispatch(
        setFriendRequestsTo({
          userIds: currentUser?.friendRequestsTo || [],
        }),
      );
  }, [
    authUser?._id,
    currentUser?.notCheckedFriendRequestsFrom,
    dispatch,
  ]);

  useEffect(() => {
    !!authUser?._id &&
      socket?.on(
        "getUsers",
        (
          users: Array<{
            socketId: string;
            userId: string;
          }>,
        ) => {
          dispatch(setConnectedUsers(users));
        },
      );
  }, [connectedUsers, dispatch, authUser?._id]);

  useEffect(() => {
    !!authUser?._id &&
      socket?.on("getFriendRequest", (senderId: string) => {
        dispatch(addFriendRequestFromAsync(senderId));
      });
  }, [dispatch, authUser?._id]);

  useEffect(() => {
    console.log({ connectedUsers });
  }, [connectedUsers]);

  useEffect(() => {
    !!authUser?._id &&
      dispatch(
        getFriendsOfCurrentUserAsync(authUser?._id!),
      );
  }, [dispatch, authUser?._id]);

  useEffect(() => {
    !!authUser?._id! &&
      dispatch(getFriendRequestsFromAsync());
  }, [dispatch, authUser?._id!]);

  return (
    <>
      <Container maxWidth="xl">
        <ToastContainer />
        <Container
          className={classes.contentStyle}
          maxWidth="xl"
        >
          <Routes>
            <Route
              path="/signin"
              element={!authUser ? <SignIn /> : <Home />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignUp /> : <Home />}
            />
            <Route
              path="/messenger/:userId"
              element={
                !!authUser ? <Messenger /> : <SignIn />
              }
            />
            <Route
              path="/messenger"
              element={
                !!authUser ? <Messenger /> : <SignIn />
              }
            />
            <Route
              path="/profile/:username"
              element={
                !!authUser ? <Profile /> : <SignIn />
              }
            />
            <Route
              path="/search"
              element={!!authUser ? <Search /> : <SignIn />}
            />
            <Route
              path="/friend/requests"
              element={
                !!authUser ? <FriendRequests /> : <SignIn />
              }
            />
            <Route
              path="/"
              element={!!authUser ? <Home /> : <SignIn />}
            />
            <Route
              path="*"
              element={!!authUser ? <Home /> : <SignUp />}
            />
          </Routes>
        </Container>
      </Container>
    </>
  );
};

export default App;
