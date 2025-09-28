import React from "react";
import PostCard from "./PostCard";
import usePostStore from "@/store/postStore"; // ✅ Import the Zustand store

const Posts = () => {
  // ✅ Get the posts state directly from the Zustand store
  const { posts } = usePostStore();

  return (
    <section
      className="mt-8 gap-10 flex flex-col items-center max-w-xl mx-auto px-4"
      aria-label="User posts feed"
    >
      {posts.map((post) => (
        <PostCard post={post} key={post._id} />
      ))}
    </section>
  );
};

export default Posts;