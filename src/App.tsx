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
import { selectCurrentUser } from "./app/slices/authSlice";
import Search from "./pages/search/Search";
import {
  selectConnectedUsers,
  setConnectedUsers,
  socketAddUser,
} from "./app/slices/socketSlice";
import { socket } from "./config/config.socket";
import {
  addFriendRequestFromAsync,
  getFriendRequestsFromAsync,
  getFriendsOfCurrentUserAsync,
  setFriendRequestsTo,
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
  const currentUser = useAppSelector(selectCurrentUser);
  const conversations = useAppSelector(selectConversations);
  const connectedUsers = useAppSelector(
    selectConnectedUsers,
  );
  const [conversationsIdsSet, setConversationsIdsSet] =
    useState<Set<string> | undefined>(undefined);

  useEffect(() => {
    !!currentUser?._id && dispatch(getConversationsAsync());
  }, [currentUser?._id, dispatch]);

  useEffect(() => {
    conversations &&
      !!conversations?.length &&
      setConversationsIdsSet(
        new Set(conversations?.map((c) => c._id!)),
      );
    console.log("conversationsIdsSetSetted");
  }, [conversations]);

  useDeepCompareEffect(() => {
    !!conversationsIdsSet &&
      dispatch(
        getUncheckedByCurrentUserAsync(conversationsIdsSet),
      );
  }, [conversationsIdsSet, dispatch]);

  useEffect(() => {
    !!currentUser?._id &&
      dispatch(socketAddUser(currentUser._id!));
  }, [currentUser?._id, dispatch]);

  useEffect(() => {
    !!currentUser?._id &&
      dispatch(
        setNotCheckedFriendRequests({
          userIds:
            currentUser?.notCheckedFriendRequestsFrom || [],
        }),
      );
  }, [
    currentUser?._id,
    currentUser?.notCheckedFriendRequestsFrom,
    dispatch,
  ]);
  useEffect(() => {
    !!currentUser?._id &&
      dispatch(
        setFriendRequestsTo({
          userIds: currentUser?.friendRequestsTo || [],
        }),
      );
  }, [
    currentUser?._id,
    currentUser?.notCheckedFriendRequestsFrom,
    dispatch,
  ]);

  useEffect(() => {
    !!currentUser?._id &&
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
  }, [connectedUsers, dispatch, currentUser?._id]);

  useEffect(() => {
    !!currentUser?._id &&
      socket?.on("getFriendRequest", (senderId: string) => {
        console.log({"getFriendRequest":senderId});
        console.log(senderId);
        
        dispatch(addFriendRequestFromAsync(senderId));
      });
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    console.log({ connectedUsers });
  }, [connectedUsers]);

  useEffect(() => {
    !!currentUser?._id! && 
      dispatch(
        getFriendsOfCurrentUserAsync(currentUser?._id!),
      );
  }, [dispatch, currentUser?._id!]);

  useEffect(() => {
    !!currentUser?._id! &&
      dispatch(getFriendRequestsFromAsync());
  }, [dispatch, currentUser?._id!]);

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
              element={!currentUser ? <SignIn /> : <Home />}
            />
            <Route
              path="/signup"
              element={!currentUser ? <SignUp /> : <Home />}
            />
            <Route
              path="/messenger/:userId"
              element={
                !!currentUser ? <Messenger /> : <SignIn />
              }
            />
            <Route
              path="/messenger"
              element={
                !!currentUser ? <Messenger /> : <SignIn />
              }
            />
            <Route
              path="/profile/:username"
              element={
                !!currentUser ? <Profile /> : <SignIn />
              }
            />
            <Route
              path="/search"
              element={
                !!currentUser ? <Search /> : <SignIn />
              }
            />
            <Route
              path="/friend/requests"
              element={
                !!currentUser ? (
                  <FriendRequests />
                ) : (
                  <SignIn />
                )
              }
            />
            <Route
              path="/"
              element={
                !!currentUser ? <Home /> : <SignIn />
              }
            />
            <Route
              path="*"
              element={
                !!currentUser ? <Home /> : <SignUp />
              }
            />
          </Routes>
        </Container>
      </Container>
    </>
  );
};

export default App;
