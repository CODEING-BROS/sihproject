import React from "react";
import Posts from "@/components/frontendComponents/Posts";
import ActiveRooms from "@/components/frontendComponents/ActiveRooms";
import useGetAllPosts from "@/hooks/useGetAllPosts";

const Home = () => {
  const loading = useGetAllPosts(); // ✅ this ensures Redux gets fresh data

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-[#010309] text-white py-8 px-4 min-h-screen">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Feed: Posts and Rooms */}
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Active Rooms</h2>
            <ActiveRooms />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
            <Posts />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
