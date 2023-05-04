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
  IUser,
  Status,
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
  getCurrentUserUncheckedMessagesByConversationIdParams,
  getLastMessageByConversationIdParams,
  getMessagesByConversationIdParams,
  messageReceivedByCurrentUser,
  messagesCheckedByCurrentUser,
} from "../../api/messages.api";
import { selectCurrentUser } from "./currentUserSlice";
import { getUserByUserIdQuery } from "../../api/users.api";
import { signoutAsync } from "./authSlice";
// import { socket } from "../../config/config.socket";
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
  uncheckedByCurrentUser?: {
    conversationId: string;
    messagesIds: string[];
  }[];
  lastMessagesCheckedByCurrentUser: string[];
  currentChat?: IChat;
  lastMessage?: IPMessage;
  messageEditing?: IPMessage;
  isFetching: boolean;
  error: any;
}

const initialState: MessengerState = {
  conversations: [],
  selectedConversation: undefined,
  uncheckedByCurrentUser: [],
  lastMessagesCheckedByCurrentUser: [],
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
export const getConversationNameAndPictureAsync =
  createAsyncThunk<
    {
      groupName: string;
      groupPicture: string | undefined;
      conversationId: string;
    },
    IPConversation,
    { state: RootState }
  >(
    "messenger/getConversationName",
    async (conversation, { getState }) => {
      // console.log("!conversation.groupName");
      const currentUser = selectCurrentUser(getState());
      const friendIdArray: string[] | undefined =
        conversation.membersId!.filter(
          (m: string) => m !== currentUser?._id!,
        );
      const friendId = friendIdArray[0];

      const res = await getUserByUserIdQuery(friendId);
      const friend: IUser = res.data._doc;
      let groupName: string;
      let groupPicture: string | undefined;
      if (friendIdArray?.length === 1) {
        groupName = friend.username;
        groupPicture = !!friend.profilePicture
          ? `${friend.profilePicture}`
          : undefined;
      } else {
        groupName = `${friend.username} and ${
          friendIdArray.length - 1
        } more ... `;
        groupPicture = !!conversation.groupPicture
          ? `${conversation.groupPicture}`
          : undefined;
      }

      return {
        groupName,
        groupPicture,
        conversationId: conversation._id!,
      };
    },
  );
export const getUncheckedByCurrentUserAsync =
  createAsyncThunk(
    "messenger/getUncheckedByCurrentUser",
    async (conversationsIds: Set<string>) => {
      const arrayIds = Array.from(conversationsIds);

      const payload = await Promise.all(
        arrayIds?.map(async (cId) => {
          const response =
            await getCurrentUserUncheckedMessagesByConversationIdParams(
              cId,
            );
          const messagesIds: string[] = response.data;

          return { messagesIds, conversationId: cId };
        }),
      );

      return payload;
    },
  );
export const createNewMessageAsync = createAsyncThunk(
  "messenger/createNewMessage",
  async (newMessage: IMessage) => {
    const response = await createMessage(newMessage);
    // The value we return becomes the `fulfilled` action payload
    const pMessage: IPMessage = response.data;
    return pMessage;
  },
);
export const updateMessageAsync = createAsyncThunk(
  "messenger/createNewMessage",
  async (newMessage: IMessage) => {
    const response = await createMessage(newMessage);
    // The value we return becomes the `fulfilled` action payload
    const pMessage: IPMessage = response.data;
    return pMessage;
  },
);

export const messageReceivedByCurrentUserAsync =
  createAsyncThunk(
    "messenger/messageReceivedByCurrentUser",
    async (props: {
      messageId: string;
      conversation: IConversation;
    }) => {
      const response = await messageReceivedByCurrentUser(
        props,
      );
      // The value we return becomes the `fulfilled` action payload
      const message: IPMessage =
        response.data.updatedMessage;
      const conversation: IConversation =
        response.data.conversation;
      return { message, conversation };
    },
  );

export const conversationCheckedByCurrentUserAsync =
  createAsyncThunk(
    "messenger/conversationCheckedByCurrentUser",
    async (props: {
      conversationId: string;
      currentUserId: string;
    }) => {
      const { conversationId, currentUserId } = props;
      const response = await messagesCheckedByCurrentUser(
        props,
      );
      // The value we return becomes the `fulfilled` action payload
      const checkedMessagesIds: string[] = response.data;

      return {
        checkedMessagesIds,
        conversationId,
        currentUserId,
      };
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

export const getExisitingConversationOrCreateOneAsync =
  createAsyncThunk(
    "messenger/findExisitingConversationOrCreateOne",
    async (props: { userId: string }): Promise<any> => {
      const { userId } = props;

      const res =
        await getPrivateConversationByFriendIdParams(
          userId,
        );
      let conversation = res?.data;
      if (!!conversation) {
        const res =
          await getLastMessageByConversationIdParams(
            conversation._id!,
          );
        conversation = {
          ...conversation,
          lastMessageId: res.data,
        };
      } else {
        const receiversId = [userId];
        const res = await createNewConversation(
          receiversId,
        );

        conversation = res.data;
      }
      return conversation;
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
    messageReceivedByRemoteUser: (
      state,
      action: PayloadAction<{
        message: IPMessage;
        receiverId: string;
      }>,
    ) => {
      const { message, receiverId } = action.payload;

      if (
        state.currentChat?.conversation?._id ===
        message.conversationId
      ) {
        let status: Status;

        const conversationMembers =
          state.currentChat.conversation.membersId;

        if (
          (
            conversationMembers?.filter(
              (mId) =>
                mId !== receiverId &&
                mId !== message.senderId._id &&
                !message?.receivedByIds?.includes(mId),
            ) || []
          ).length === 0
        ) {
          status = 30;
        } else {
          status = message?.status || 20;
        }
        state.currentChat = {
          ...state.currentChat,
          messages:
            state.currentChat?.messages?.map((m) => {
              if (m._id === message._id) {
                return {
                  ...message,
                  status,
                  receivedByIds: [
                    ...(message.receivedByIds?.filter(
                      (rId) => rId !== receiverId,
                    ) || []),
                    receiverId,
                  ],
                };
              } else {
                return m;
              }
            }) || [],
        };
      }

      if (
        state.conversations.find(
          (c) => c.lastMessageId?._id === message._id,
        )
      ) {
        let status: Status;
        const conversation = state.conversations.find(
          (c) => c.lastMessageId?._id === message._id,
        );
        const conversationMembers = conversation?.membersId;

        if (
          (
            conversationMembers?.filter(
              (mId) =>
                mId !== receiverId &&
                mId !== message.senderId._id &&
                !message?.receivedByIds?.includes(mId),
            ) || []
          ).length === 0
        ) {
          status = 30;
        } else {
          status = message?.status || 20;
        }
        state.conversations = state.conversations?.map(
          (c) => {
            if (c.lastMessageId?._id === message._id) {
              return {
                ...c,
                lastMessageId: {
                  ...message,
                  status,
                  senderId: message.senderId._id!,
                  receivedByIds: [
                    ...(message.receivedByIds?.filter(
                      (rId) => rId !== receiverId,
                    ) || []),
                    receiverId,
                  ],
                },
              };
            } else return { ...c };
          },
        );
      }
    },
    messageCheckedByRemoteUser: (
      state,
      action: PayloadAction<{
        checkedMessageId: string;
        conversationId: string;
        userId: string;
      }>,
    ) => {
      if (!!action.payload) {
        const { checkedMessageId, conversationId, userId } =
          action.payload;

        let status: Status;
        const conversation = state.conversations?.find(
          (c) => c._id! === conversationId,
        );
        const conversationMembers = conversation?.membersId;
        const message = conversation?.lastMessageId;
        if (!!message) {
          if (
            (
              conversationMembers?.filter(
                (mId) =>
                  mId !== userId &&
                  mId !== message?.senderId &&
                  !message?.checkedByIds?.includes(mId),
              ) || []
            ).length === 0
          ) {
            status = 40;
          } else {
            status = message?.status || 30;
          }
          console.log({ status });

          if (!!message && !message?.checkedByIds?.length) {
            state.conversations = state.conversations.map(
              (c) => {
                if (c?._id === conversationId) {
                  if (
                    !!c.lastMessageId?._id &&
                    checkedMessageId ===
                      c.lastMessageId?._id
                  ) {
                    return {
                      ...c,
                      lastMessageId: {
                        ...c.lastMessageId,
                        status,
                        checkedByIds: [userId],
                      },
                    };
                  } else {
                    return { ...c };
                  }
                } else return c;
              },
            );
          } else if (
            !!message &&
            !!message?.checkedByIds?.length &&
            !message.checkedByIds?.includes(userId)
          ) {
            state.conversations = state.conversations.map(
              (c) => {
                if (c?._id === conversationId) {
                  if (
                    !!c.lastMessageId?._id &&
                    checkedMessageId ===
                      c.lastMessageId?._id
                  ) {
                    return {
                      ...c,
                      lastMessageId: {
                        ...c.lastMessageId,
                        status,
                        checkedByIds: [
                          ...c.lastMessageId.checkedByIds,
                          userId,
                        ],
                      },
                    };
                  } else {
                    return { ...c };
                  }
                } else return c;
              },
            );
          }
          if (
            conversationId ===
            state.currentChat?.conversation._id
          ) {
            state.currentChat.messages = [
              ...(state.currentChat?.messages?.map((m) => {
                if (m._id === checkedMessageId) {
                  return {
                    ...m,
                    status,
                    checkedByIds: {
                      // ...(m.checkedByIds?.filter(
                      //   (uId) => uId !== userId,
                      // ) || []),
                      ...(m.checkedByIds || []),
                      userId,
                    },
                  };
                } else {
                  return { ...m };
                }
              }) || []),
            ];
          }
        }
      }
    },
    setConversationName: (
      state,
      action: PayloadAction<{
        groupName: string;
        conversationId: string;
      }>,
    ) => {
      const { groupName, conversationId } = action.payload;
      state.conversations = state.conversations.map((c) => {
        if (c._id === conversationId) {
          return {
            ...c,
            groupName,
          };
        } else {
          return { ...c };
        }
      });
    },
    setMessageEditing: (
      state,
      action: PayloadAction<IPMessage | undefined>,
    ) => {
      state.messageEditing = action.payload;
    },
    // setConversationPicture: (
    //   state,
    //   action: PayloadAction<{
    //     conversationId: string;
    //     groupPicture: string;
    //   }>,
    // ) => {
    //   const { conversationId, groupPicture } =
    //     action.payload;
    //   state.conversations = state.conversations.map((c) => {
    //     if (c._id === conversationId) {
    //       return {
    //         ...c,
    //         groupPicture,
    //       };
    //     } else {
    //       return { ...c };
    //     }
    //   });
    // },
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
      .addCase(
        getConversationNameAndPictureAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getConversationNameAndPictureAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          const {
            groupName,
            groupPicture,
            conversationId,
          } = action.payload;
          state.conversations = state.conversations.map(
            (c) => {
              if (c._id === conversationId) {
                return {
                  ...c,
                  groupName,
                  groupPicture,
                };
              } else {
                return { ...c };
              }
            },
          );
        },
      )
      .addCase(
        getConversationNameAndPictureAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )
      .addCase(
        getUncheckedByCurrentUserAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        getUncheckedByCurrentUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;
          if (!!action.payload) {
            state.uncheckedByCurrentUser = action.payload;
          }
        },
      )
      .addCase(
        getUncheckedByCurrentUserAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )

      .addCase(
        messageReceivedByCurrentUserAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        messageReceivedByCurrentUserAsync.fulfilled,
        (state, action) => {
          const { message, conversation } = action.payload;
          state.isFetching = false;
          if (message._id !== state.lastMessage?._id) {
            const pConversation = {
              ...action.payload.conversation,
              lastMessageId: {
                ...action.payload.message,
                senderId:
                  action.payload.message.senderId._id!,
              },
            };

            state.lastMessage = message;
            state.conversations = [
              pConversation,
              ...state.conversations?.filter(
                (c) => c._id !== conversation._id,
              ),
            ];

            if (
              !!state.currentChat &&
              state.currentChat?.conversation?._id ===
                conversation._id
            ) {
              state.currentChat = {
                ...state.currentChat,
                messages: [
                  ...state.currentChat.messages,
                  message,
                ],
              };
            }

            if (
              !!state.uncheckedByCurrentUser &&
              !!state.uncheckedByCurrentUser?.find(
                (u) =>
                  u.conversationId === conversation._id,
              )
            ) {
              state.uncheckedByCurrentUser =
                state.uncheckedByCurrentUser?.map((u) => {
                  if (
                    u.conversationId ===
                    message.conversationId
                  ) {
                    return {
                      ...u,
                      messagesIds: [
                        ...(u.messagesIds?.filter(
                          (mIds) => mIds !== message._id,
                        ) || []),
                        message._id!,
                      ],
                    };
                  } else {
                    return { ...u };
                  }
                }) || [];
            } else {
              state.uncheckedByCurrentUser = [
                ...(state.uncheckedByCurrentUser || []),
                {
                  conversationId: conversation._id!,
                  messagesIds: [message._id!],
                },
              ];
            }
          }
        },
      )
      .addCase(
        messageReceivedByCurrentUserAsync.rejected,
        (state, action) => {
          state.isFetching = false;
          toast(action.error.message, position);
        },
      )

      .addCase(
        conversationCheckedByCurrentUserAsync.pending,
        (state) => {
          state.isFetching = true;
        },
      )
      .addCase(
        conversationCheckedByCurrentUserAsync.fulfilled,
        (state, action) => {
          state.isFetching = false;

          const {
            conversationId,
            checkedMessagesIds,
            currentUserId,
          } = action.payload;

          if (
            !!state.uncheckedByCurrentUser?.find(
              (u) => u.conversationId === conversationId,
            )?.messagesIds.length
          ) {
            const conversation = state.conversations.find(
              (c) => c._id === conversationId,
            );
            let status: Status;
            const conversationMembers =
              conversation?.membersId;
            const lastMessage: IMessage | undefined =
              conversation?.lastMessageId;

            if (!!lastMessage) {
              const checkedByIds = lastMessage.checkedByIds;
              // const conversationMembersNotIncludedInCheckedByIds=
              if (
                (
                  conversationMembers?.filter(
                    (mId) =>
                      mId !== currentUserId &&
                      mId !== lastMessage?.senderId &&
                      (!!checkedByIds
                        ? !checkedByIds.includes(mId)
                        : true),
                  ) || []
                ).length === 0
              ) {
                status = 40;
              } else {
                status = lastMessage?.status || 30;
              }

              state.conversations =
                state.conversations?.map((c) => {
                  if (c._id === conversationId) {
                    return {
                      ...c,
                      lastMessageId: {
                        ...lastMessage,
                        status,
                        checkedByIds: {
                          // ...(checkedByIds || []),
                          ...(c.lastMessageId?.checkedByIds?.filter(
                            (cId) => cId !== currentUserId,
                          ) || []),
                          currentUserId,
                        },
                      },
                    };
                  } else return { ...c };
                }) || [];
            }
            if (
              !!state.currentChat &&
              state.currentChat?.conversation?._id ===
                conversationId
            ) {
              state.currentChat = {
                ...state.currentChat,
                messages: [
                  ...state.currentChat.messages.map((m) => {
                    if (
                      checkedMessagesIds.includes(m._id!)
                    ) {
                      return {
                        ...m,
                        status,
                        checkedByIds: [
                          ...(m.checkedByIds?.filter(
                            (cId) => cId !== currentUserId,
                          ) || []),
                          currentUserId,
                        ],
                      };
                    } else return { ...m };
                  }),
                ],
              };
            }

            state.uncheckedByCurrentUser =
              state.uncheckedByCurrentUser?.map((u) => {
                if (u.conversationId === conversationId) {
                  return {
                    conversationId: u.conversationId,
                    messagesIds: [],
                  };
                } else {
                  return { ...u };
                }
              });

            state.lastMessagesCheckedByCurrentUser =
              checkedMessagesIds;
          }
        },
      )
      .addCase(
        conversationCheckedByCurrentUserAsync.rejected,
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
      )
      .addCase(signoutAsync.fulfilled, (state) => {
        state.conversations = [];
        state.selectedConversation = undefined;
        state.uncheckedByCurrentUser = [];
        state.lastMessagesCheckedByCurrentUser = [];
        state.currentChat = undefined;
        state.lastMessage = undefined;
        state.isFetching = false;
        state.error = null;
      });
  },
});

export const {
  receiveNewMessage,
  messageReceivedByRemoteUser,
  messageCheckedByRemoteUser,
  setConversationName,
  setMessageEditing,
} = messengerSlice.actions;

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
export const selectLastMessagesCheckedByCurrentUser = (
  state: RootState,
) => state.messenger.lastMessagesCheckedByCurrentUser;
export const selectUncheckedByCurrentUser = (
  state: RootState,
) => state.messenger.uncheckedByCurrentUser;
export const selectMessageEditing = (state: RootState) =>
  state.messenger.messageEditing;

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
// function areEqual(array1: string[], array2: string[]) {
//   if (!array1.length && !array2.length) {
//     return true;
//   }
//   else if (array1.length === array2.length) {
//     return array1.every((element) => {
//       if (array2.includes(element)) {
//         return true;
//       }
//       return false;
//     });
//   }
//   return false;
// }

export default messengerSlice.reducer;
