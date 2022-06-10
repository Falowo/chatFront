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
  const conversations = useAppSelector(selectConversations);
  const connectedUsers = useAppSelector(
    selectConnectedUsers,
  );
  const [conversationsIdsSet, setConversationsIdsSet] =
    useState<Set<string> | undefined>(undefined);

  
    useEffect(() => {
      !!authUser &&
        dispatch(getCurrentUserAsync(authUser._id!));
    }, [dispatch, authUser]);

    useEffect(() => {
      !!authUser && dispatch(getConversationsAsync());
    }, [authUser, dispatch]);

    useEffect(() => {
      !!authUser &&
        dispatch(socketAddUser(authUser._id!));
    }, [authUser, dispatch]);

    useEffect(() => {
      !!authUser  &&
        dispatch(
          setNotCheckedFriendRequests({
            userIds:
              authUser?.notCheckedFriendRequestsFrom || [],
          }),
        );
    }, [
      authUser,
      currentUser?.notCheckedFriendRequestsFrom,
      dispatch,
    ]);

    useEffect(() => {
      !!authUser  &&
        dispatch(
          setNotCheckedAcceptedFriendRequestsBy({
            userIds:
              currentUser?.notCheckedAcceptedFriendRequestsBy ||
              [],
          }),
        );
    }, [
      authUser,
      currentUser?.notCheckedAcceptedFriendRequestsBy,
      dispatch,
    ]);
    useEffect(() => {
      !!authUser  &&
        dispatch(
          setFriendRequestsTo({
            userIds: currentUser?.friendRequestsTo || [],
          }),
        );
    }, [authUser, currentUser?.friendRequestsTo, currentUser?.notCheckedFriendRequestsFrom, dispatch]);

    useEffect(() => {
      !!authUser  &&
        dispatch(
          getFriendsOfCurrentUserAsync(authUser._id!),
        );
    }, [dispatch, authUser]);

    useEffect(() => {
      !!authUser &&
        dispatch(getFriendRequestsFromAsync());
    }, [dispatch, authUser]);

    useEffect(() => {
      !!conversations &&
        !!conversations?.length &&
        setConversationsIdsSet(
          new Set(conversations?.map((c) => c._id!)),
        );
    }, [conversations]);

    useDeepCompareEffect(() => {
      !!conversationsIdsSet &&
        dispatch(
          getUncheckedByCurrentUserAsync(
            conversationsIdsSet,
          ),
        );
    }, [conversationsIdsSet, dispatch]);

    useEffect(() => {
      !!authUser &&
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
    }, [connectedUsers, dispatch, authUser]);

    useEffect(() => {
      !!authUser &&
        socket?.on("getFriendRequest", (senderId: string) => {
          dispatch(addFriendRequestFromAsync(senderId));
        });
    }, [dispatch, authUser]);

    useEffect(() => {
      console.log({ connectedUsers });
    }, [connectedUsers]);
  

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
