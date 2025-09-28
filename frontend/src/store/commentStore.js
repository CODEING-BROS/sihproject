import { create } from "zustand";
import { persist } from "zustand/middleware"; // optional if you want persistence

const useCommentStore = create(
  persist(
    (set, get) => ({
      comments: [],

      // set all comments
      setComments: (comments) => set({ comments }),

      // update likes for a comment
      updateCommentLikes: ({ commentId, userId, liked }) => {
        const { comments } = get();
        const updatedComments = comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: liked
                  ? [...(comment.likes || []), userId]
                  : (comment.likes || []).filter((id) => id !== userId),
              }
            : comment
        );
        set({ comments: updatedComments });
      },

      // add a new comment (optional)
      addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
    }),
    { name: "comment-storage" } // optional persistence in localStorage
  )
);

export default useCommentStore;
