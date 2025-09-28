import { useState, React } from "react";
import { useNavigate } from "react-router-dom";
import UserListModel from "./UserListModel";
import FollowButton from "./FollowButton";
import { useUserConnections } from "@/hooks/useUserConnections";
import useAuthStore from "@/store/authStore";

export default function ProfileHeader() {
  const [showUserListPopover, setShowUserListPopover] = useState(false);
  const [popoverTab, setPopoverTab] = useState("followers");
  const navigate = useNavigate();

  const { user: authUser, userprofile } = useAuthStore();

  const isAuthor =
    (authUser?.username || "").toLowerCase().trim() ===
    (userprofile?.username || "").toLowerCase().trim();

  const { followers, following, loading } = useUserConnections(userprofile?.username);

  const handleMessage = () => {
  if (!userprofile?._id) return;
  
  // Option 1: Using query params
  navigate(`/chats?user=${userprofile._id}`);
  
  // Option 2: Using dynamic route (if you have /chats/:userId)
  // navigate(`/chats/${userprofile._id}`);
};


  const handleOpenUserList = (tab) => {
    setPopoverTab(tab);
    setShowUserListPopover(true);
  };

  return (
    <section className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 border-b border-gray-800 bg-[#14161a]">
      {/* Profile Image */}
      <div className="relative mx-auto md:mx-0">
        <div className="rounded-full p-1 bg-gradient-to-tr from-pink-500 via-blue-500 to-purple-600">
          <img
            src={userprofile?.profilePicture || null}
            alt="Profile"
            className="rounded-full w-28 h-28 border-4 border-[#0e1013]"
          />
        </div>
        {isAuthor && (
          <span className="absolute bottom-0 right-0 bg-blue-600 text-[10px] px-2 py-[2px] rounded-full font-medium shadow-md">
            Author
          </span>
        )}
      </div>

      {/* Name & Buttons */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-gray-400 text-lg">@{userprofile?.username}</h2>
        <h1 className="text-2xl font-bold text-white">{userprofile?.name}</h1>
        <p className="text-sm text-gray-400 mt-1 whitespace-pre-line">{userprofile?.bio}</p>

        <div className="mt-3 flex justify-center md:justify-start gap-3">
          {isAuthor ? (
            <button
              onClick={() => navigate("/edit-profile")}
              className="bg-blue-600 px-4 py-1.5 rounded text-sm hover:bg-blue-500 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <FollowButton userId={userprofile?._id} />
              <button
                onClick={handleMessage}
                className="bg-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-600 transition"
              >
                Message
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <ul className="flex flex-1 justify-around md:justify-end gap-6 text-center mt-4 md:mt-0">
        <li>
          <button
            onClick={() => handleOpenUserList("followers")}
            className="cursor-pointer focus:outline-none"
            aria-label="View followers"
          >
            <p className="text-xl font-bold text-white">
              {userprofile?.followers?.length ?? 0}
              <span className="text-sm text-gray-400"> Followers</span>
            </p>
          </button>
        </li>
        <li>
          <button
            onClick={() => handleOpenUserList("following")}
            className="cursor-pointer focus:outline-none"
            aria-label="View following"
          >
            <p className="text-xl font-bold text-white">
              {userprofile?.following?.length ?? 0}
              <span className="text-sm text-gray-400">Following</span>
            </p>
          </button>
        </li>
        <li>
          <p className="text-xl font-bold text-white">
            {userprofile?.posts?.length ?? 0}
            <span className="text-sm text-gray-400">Posts</span>
          </p>
        </li>
      </ul>

      <UserListModel
        isOpen={showUserListPopover}
        onClose={() => setShowUserListPopover(false)}
        initialTab={popoverTab}
        users={{
          followers,
          following,
        }}
        loading={loading}
      />
    </section>
  );
}