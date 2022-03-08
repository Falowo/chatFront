import React, { useEffect } from "react";
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
  setNotCheckedFriendsRequestIds,
  socketAddUser,
} from "./app/slices/socketSlice";
import { socket } from "./config/config.socket";
import { getFriendsOfCurrentUserAsync } from "./app/slices/currentUserSlice";
// import { getBothFollowedByAndFollowersOfCurrentUserAsync } from "./app/slices/currentUserSlice";

const useStyles = makeStyles({
  contentStyle: {
    margin: "0 auto",
  },
});

const App = () => {
  const classes = useStyles();
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const connectedUsers = useAppSelector(
    selectConnectedUsers,
  );

  useEffect(() => {
    !!currentUser?._id &&
      dispatch(socketAddUser(currentUser._id!));
  }, [currentUser?._id, dispatch]);

  useEffect(() => {
    !!currentUser &&
      dispatch(
        setNotCheckedFriendsRequestIds({
          userIds:
            currentUser?.notCheckedFriendRequestsFrom || [],
        }),
      );
  }, [currentUser, currentUser?._id, dispatch]);

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
    console.log({ connectedUsers });
  }, [connectedUsers]);

  useEffect(() => {
    !!currentUser &&
      dispatch(
        getFriendsOfCurrentUserAsync(currentUser._id!),
      );
  }, [dispatch, currentUser]);

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
            <Route path="/signup" element={<SignUp />} />
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
