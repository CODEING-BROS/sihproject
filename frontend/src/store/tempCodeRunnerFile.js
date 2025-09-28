import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, 
      userprofile: null, 

      setAuthUser: (user) => set({ user }),
      setUserProfile: (profile) => set({ userprofile: profile }),

      toggleFollowUser: (targetUserId) => {
        const { user, userprofile } = get();
        if (!user?.following) return;
        const isFollowing = user.following.includes(targetUserId);

        const updatedUser = {
          ...user,
          following: isFollowing
            ? user.following.filter((id) => id !== targetUserId)
            : [...user.following, targetUserId],
        };

        let updatedProfile = userprofile;
        if (userprofile?._id === targetUserId) {
          const isFollower = userprofile.followers.includes(user._id);

          updatedProfile = {
            ...userprofile,
            followers: isFollower
              ? userprofile.followers.filter((id) => id !== user._id)
              : [...userprofile.followers, user._id],
          };
        }
        set({ user: updatedUser, userprofile: updatedProfile });
      },

      toggleBookmark: (postId) => {
        set((state) => {
          if (!state.user) return state;

          const isCurrentlyBookmarked = (state.user.bookmarks || []).includes(postId);
          let updatedBookmarks;

          if (isCurrentlyBookmarked) {
            updatedBookmarks = (state.user.bookmarks || []).filter(
              (id) => id !== postId
            );
          } else {
            updatedBookmarks = [...(state.user.bookmarks || []), postId];
          }

          const updatedUser = {
            ...state.user,
            bookmarks: updatedBookmarks,
          };

          return { user: updatedUser };
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;