import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  RootState,
  //   AppThunk,
} from "../store";

// import { toast } from "react-toastify";
import { socket } from "../../config/config.socket";
import { IConversation, IPMessage } from "../../interfaces";
import { getMessagesArrayFromIds } from "../../api/messages.api";
import { signoutAsync } from "./authSlice";

// const position = {
//   position: toast.POSITION.BOTTOM_RIGHT,
// };

export interface UserSocket {
  userId: string;
  socketId: string;
}

export interface SocketState {
  addUserEmited: boolean;
  connectedUsers: UserSocket[];
  lastMessageSentId?: string;
  lastMessagesReceived: {
    messageId: string;
    receiverId: string;
  }[];
  lastMessagesChecked: {
    messageId: string;
    receiverId: string;
  }[];
  sentFriendRequestsIds: string[];
  rooms: any[];
  isFetching: boolean;
  error: any;
}

const initialState: SocketState = {
  addUserEmited: false,
  connectedUsers: [],
  lastMessageSentId: undefined,
  lastMessagesReceived: [],
  lastMessagesChecked: [],
  sentFriendRequestsIds: [],
  rooms: [],
  isFetching: false,
  error: false,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const socketCurrentUserCheckMessagesAsync =
  createAsyncThunk(
    "socket/socketCurrentUserCheckMessages",
    async (props: {
      messagesIds: string[];
      currentUserId: string;
    }) => {
      const { messagesIds, currentUserId } = props;

      const res = await getMessagesArrayFromIds(
        messagesIds,
      );

      const messages: IPMessage[] = res.data;
      // console.log({
      //   socketCurrentUserCheckMessagesAsyncMessages:
      //     messages,
      // });

      return { messages, receiverId: currentUserId };
    },
  );

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    // Use the PayloadAction type to declare the contents of `action.payload`
    socketAddUser: (
      state,
      action: PayloadAction<string>,
    ) => {
      const currentUserId = action.payload;
      socket.emit("addUser", currentUserId);
      state.addUserEmited = true;
    },
    setConnectedUsers: (
      state,
      action: PayloadAction<UserSocket[]>,
    ) => {
      state.connectedUsers = action.payload;
    },

    socketSendFriendRequest: (
      state,
      action: PayloadAction<{
        userId: string;
        currentUserId: string;
      }>,
    ) => {
      const { userId, currentUserId } = action.payload;

      if (
        state.connectedUsers.find(
          (c) => c.userId === userId,
        )
      ) {
        socket?.emit("sendFriendRequest", {
          receiverId: userId,
          senderId: currentUserId,
        });
        state.sentFriendRequestsIds = [
          ...(state.sentFriendRequestsIds.filter(
            (uId) => uId !== userId,
          ) || []),
          userId,
        ];
      }
    },

    socketSendMessage: (
      state,
      action: PayloadAction<{
        conversation: IConversation;
        message: IPMessage;
        currentUserId: string;
      }>,
    ) => {
      const { conversation, message, currentUserId } =
        action.payload;
      const receiversIds: string[] =
        conversation?.membersId!.filter(
          (mId: string) => mId !== currentUserId,
        );

      for (const receiverId of receiversIds!) {
        console.log({ receiverId });

        if (
          state.connectedUsers.find(
            (c) => c.userId === receiverId,
          )
        ) {
          console.log({ connectedReceiverId: receiverId });

          socket?.emit("sendMessage", {
            receiverId,
            conversation,
            message,
          });
        }
      }
      state.lastMessageSentId = action.payload.message._id!;
    },
    socketGotMessage: (
      state,
      action: PayloadAction<{
        message: IPMessage;
        receiverId: string;
      }>,
    ) => {
      const { message, receiverId } = action.payload;
      if (
        !state.lastMessagesReceived?.includes({
          messageId: message._id!,
          receiverId,
        }) &&
        (message.status
          ? message.status < 30
          : message.status === undefined)
      ) {
        socket?.emit("gotMessage", {
          message,
          receiverId,
        });
        state.lastMessagesReceived = [
          { messageId: message._id!, receiverId },
          ...(state.lastMessagesReceived || []),
        ];
      }
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(
        socketCurrentUserCheckMessagesAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        socketCurrentUserCheckMessagesAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            const { messages, receiverId } = action.payload;

            socket.emit("checkMessages", {
              messages,
              receiverId,
            });
          }
        },
      )
      .addCase(
        socketCurrentUserCheckMessagesAsync.rejected,
        (state) => {
          state.isFetching = false;
        },
      )
      .addCase(signoutAsync.fulfilled, (state) => {
        state.addUserEmited = false;
        state.connectedUsers = [];
        state.lastMessageSentId = undefined;
        state.lastMessagesReceived = [];
        state.lastMessagesChecked = [];
        state.sentFriendRequestsIds = [];
        state.rooms = [];
        state.isFetching = false;
        state.error = false;
      });
  },
});

export const {
  socketAddUser,
  setConnectedUsers,
  socketSendMessage,
  socketSendFriendRequest,
  socketGotMessage,
} = socketSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`

export const selectConnectedUsers = (state: RootState) =>
  state.socket.connectedUsers;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default socketSlice.reducer;
