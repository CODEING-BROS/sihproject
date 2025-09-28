import { create } from "zustand";

const useChatStore = create((set) => ({
  conversations: [],
  selectedConversation: null,
  selectedUser: null,
  followers: [],
  following: [],
  streamClient: null,
  streamChannel: null,

  setConversations: (conversations) => set({ conversations }),
  selectConversation: (conversationId, user) =>
    set({ selectedConversation: conversationId, selectedUser: user }),
  setFollowers: (followers) => set({ followers }),
  setFollowing: (following) => set({ following }),
  setStreamClient: (client) => set({ streamClient: client }),
  setStreamChannel: (channel) => set({ streamChannel: channel }),
}));

export default useChatStore;
