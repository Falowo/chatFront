import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  IConversation,
  IMessage,
  IPConversation,
  IPMessage,
} from "../../interfaces";
import {
  RootState,
  //  AppThunk
} from "../store";
import { toast } from "react-toastify";
import {
  createNewConversation,
  getCurrentUserConversations,
  getCurrentUserLastConversation,
  getPrivateConversationByFriendIdParams,
} from "../../api/conversations.api";
import {
  createMessage,
  getMessagesByConversationIdParams,
} from "../../api/messages.api";
// import { getUserByUserIdQuery } from "../../api/users.api";

const position = {
  position: toast.POSITION.BOTTOM_RIGHT,
};

export interface IChat {
  conversation: IConversation;
  messages: IPMessage[];
}

export interface MessengerState {
  conversations: IPConversation[];
  selectedConversation?: IConversation;
  currentChat?: IChat;
  lastMessage?: IPMessage;
  isFetching: boolean;
  error: any;
}

const initialState: MessengerState = {
  conversations: [],
  selectedConversation: undefined,
  currentChat: undefined,
  lastMessage: undefined,
  isFetching: false,
  error: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const getConversationsAsync = createAsyncThunk(
  "messenger/getConversations",
  async () => {
    const response = await getCurrentUserConversations();
    // The value we return becomes the `fulfilled` action payload
    const conversations: IPConversation[] = response.data;
    return conversations;
  },
);
export const createNewMessageAsync = createAsyncThunk(
  "messenger/createMessage",
  async (newMessage: IMessage) => {
    const response = await createMessage(newMessage);
    // The value we return becomes the `fulfilled` action payload
    const pMessage: IPMessage = response.data;
    return pMessage;
  },
);

export const setCurrentChatAsync = createAsyncThunk(
  "messenger/setCurrentChat",
  async (props: {
    selectedIPConversation?: IPConversation;
    selectedIConversation?: IConversation;
  }) => {
    let conversation: IConversation;

    const {
      selectedIPConversation,
      selectedIConversation,
    } = props;
    if (
      !!selectedIPConversation ||
      !!selectedIConversation
    ) {
      if (
        !!selectedIPConversation &&
        !selectedIConversation
      ) {
        conversation = {
          ...selectedIPConversation,
          lastMessageId:
            selectedIPConversation.lastMessageId?._id,
        };
      } else {
        conversation = {
          ...selectedIConversation,
        };
      }

      const res = await getMessagesByConversationIdParams(
        conversation._id!,
      );
      const messages: IPMessage[] = res.data;

      const currentChat: IChat = {
        conversation,
        messages,
      };
      return currentChat;
    } else {
      const response =
        await getCurrentUserLastConversation();
      // The value we return becomes the `fulfilled` action payload
      const lastConversations: IConversation[] =
        response.data;
      conversation = lastConversations[0];

      const res = await getMessagesByConversationIdParams(
        conversation._id!,
      );
      const messages: IPMessage[] = res.data;

      const currentChat: IChat = {
        conversation,
        messages,
      };
      return currentChat;
    }
  },
);

// export const setConversationNameAsync = createAsyncThunk(
//   "messenger/setConversationName",
//   async (props: {
//     currentUser: IUser;
//     conversation: IPConversation;
//     conversationName?: string;
//   }) => {
//     let { conversation } = props;
//     const { currentUser, conversationName } = props;
//     if (!!conversation && !conversation?.groupName) {
//       const friendIdArray: string[] | undefined =
//         conversation.membersId!.filter(
//           (m: string | undefined) => m !== currentUser!._id,
//         );

//       const friendId = friendIdArray[0];

//       const res = await getUserByUserIdQuery(friendId);
//       const friend = res.data._doc;
//       !!conversationName
//         ? (conversation = {
//             ...conversation,
//             groupName: conversationName,
//           })
//         : friendIdArray.length > 1
//         ? (conversation = {
//             ...conversation,
//             groupName: `${friend.username} and ${friendIdArray.length} others ...`,
//           })
//         : (conversation = {
//             ...conversation,
//             groupName: `${friend.username}`,
//           });

//       return conversation;
//     }
//   },
// );

export const getExisitingConversationOrCreateOneAsync =
  createAsyncThunk(
    "messenger/findExisitingConversationOrCreateOne",
    async (props: { userId: string }): Promise<any> => {
      const { userId } = props;

      const res =
        await getPrivateConversationByFriendIdParams(
          userId,
        );
      let conversation: IConversation = res.data;
      if (!!conversation) {
        return conversation;
      } else {
        const receiversId = [userId];
        const res = await createNewConversation(
          receiversId,
        );

        conversation = res.data;
        return conversation;
      }
    },
  );
export const messengerSlice = createSlice({
  name: "messenger",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    receiveNewMessage: (
      state,
      action: PayloadAction<{
        conversation: IConversation;
        message: IPMessage;
      }>,
    ) => {
      if (
        action.payload.message._id !==
        state.lastMessage?._id
      ) {
        const pConversation = {
          ...action.payload.conversation,
          lastMessageId: {
            ...action.payload.message,
            senderId: action.payload.message.senderId._id!,
          },
        };

        state.lastMessage = action.payload.message;
        state.conversations = [
          pConversation,
          ...state.conversations?.filter(
            (c) =>
              c._id !== action.payload.conversation._id,
          ),
        ];

        if (
          !!state.currentChat &&
          state.currentChat?.conversation?._id ===
            action.payload.conversation._id
        ) {
          state.currentChat = {
            ...state.currentChat,
            messages: [
              ...state.currentChat.messages,
              action.payload.message,
            ],
          };
        }
      }
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(getConversationsAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        getConversationsAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.conversations = action.payload;
          }
        },
      )
      .addCase(
        getConversationsAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(setCurrentChatAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        setCurrentChatAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.currentChat = action.payload;
          }
        },
      )
      .addCase(
        setCurrentChatAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          state.selectedConversation = undefined;
          toast(action.error.message, position);
        },
      )
      .addCase(createNewMessageAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(
        createNewMessageAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.currentChat = {
              ...state.currentChat!,
              messages: [
                ...(state.currentChat?.messages || []),
                action.payload,
              ],
            };
            const lastConversation = {
              ...state.currentChat.conversation,
              lastMessageId: {
                ...action.payload,
                senderId: action.payload.senderId._id!,
              },
            };
            state.conversations = [
              lastConversation,
              ...state.conversations.filter(
                (conv) => conv._id !== lastConversation._id,
              ),
            ];
            state.lastMessage = action.payload;
          }
        },
      )
      .addCase(
        createNewMessageAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          state.lastMessage = undefined;
          toast(action.error.message, position);
        },
      )
      .addCase(
        getExisitingConversationOrCreateOneAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getExisitingConversationOrCreateOneAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          state.selectedConversation = action.payload;
          console.log({
            action,
          });

          state.conversations = [
            action.payload,
            ...state.conversations.filter(
              (c) => c._id !== action.payload._id,
            ),
          ];
        },
      )
      .addCase(
        getExisitingConversationOrCreateOneAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          console.log(action);
          toast(action.error.message, position);
        },
      );
    // .addCase(
    //   setConversationNameAsync.pending,
    //   (state) => {
    //     state.isFetching = true;
    //   },
    // )
    // .addCase(
    //   setConversationNameAsync.fulfilled,
    //   (state, action) => {
    //     state.isFetching = false;
    //     if (!!action.payload) {
    //       state.conversations = [
    //         ...(state.conversations?.filter(
    //           (c) => c?._id !== action.payload?._id,
    //         ) || []),
    //         action.payload!,
    //       ];
    //     }
    //   },
    // )
    // .addCase(
    //   setConversationNameAsync.rejected,
    //   (state, action) => {
    //     state.isFetching = false;
    //     toast(action.error.message, position);
    //   },
    // );
  },
});

export const { receiveNewMessage } = messengerSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectMessenger = (state: RootState) =>
  state.messenger;
export const selectConversations = (state: RootState) =>
  state.messenger.conversations;
export const selectSelectedConversation = (
  state: RootState,
) => state.messenger.selectedConversation;
export const selectCurrentChat = (state: RootState) =>
  state.messenger.currentChat;
export const selectMessengerIsfetching = (
  state: RootState,
) => state.messenger.isFetching;
export const selectLastMessage = (state: RootState) =>
  state.messenger.lastMessage;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default messengerSlice.reducer;
