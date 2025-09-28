import { create } from "zustand";
import { persist } from "zustand/middleware"; // optional for persistence

const usePostStore = create(
  persist(
    (set) => ({
      posts: [],          // all posts
      selectedPost: null, // currently selected post

      // set all posts
      setPosts: (posts) => set({ posts }),

      // set selected post
      setSelectedPost: (post) => set({ selectedPost: post }),

      // add a new post
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

      // update a post by id
      updatePost: (postId, updatedPost) => {
        set((state) => ({
          posts: state.posts.map((p) => (p.id === postId ? updatedPost : p)),
        }));
      },

      // delete a post by id
      deletePost: (postId) => {
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== postId),
        }));
      },
    }),
    { name: "post-storage" } // optional persistence key
  )
);

export default usePostStore;
