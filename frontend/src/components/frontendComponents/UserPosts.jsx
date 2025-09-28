import React from "react";
import PostCard from "./PostCard";

const UserPosts = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center mt-8">No posts yet.</p>
    );
  }

  return (
    <section
      className="mt-8 gap-10 flex flex-col items-center max-w-xl mx-auto px-4"
      aria-label="User posts feed"
    >
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </section>
  );
};

export default UserPosts;
