import React, { useEffect, useRef } from "react";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore"; // ✅ Import Zustand store

function UserListModel({
  isOpen,
  onClose,
  initialTab,
  loading,
  users,
}) {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const closeBtnRef = useRef(null);
  
  // ✅ Get the logged-in user ID from the Zustand store
  const loggedInUserId = useAuthStore((state) => state.user?._id);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const currentUsers = React.useMemo(() => {
    if (!users) return [];
    if (activeTab === "followers") {
      return users.followers || [];
    } else if (activeTab === "following") {
      return users.following || [];
    }
    return [];
  }, [users, activeTab]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl bg-[#14161a] rounded-xl shadow-2xl p-0 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col p-6 border-b border-gray-700 bg-[#14161a] sticky top-0 z-10">
          <div className="flex justify-between items-center  pb-4">
            <h2
              id="modal-title"
              className="text-2xl font-semibold text-white select-none"
            >
              Connections
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition  rounded"
              aria-label="Close modal"
              ref={closeBtnRef}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <nav
            aria-label="User connection tabs"
            className="flex gap-2 w-full mt-4 bg-gray-800 rounded-lg p-2"
          >
            {["followers", "following",].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-center py-2 text-sm font-medium rounded-md transition select-none ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-700"
                  }`}
                  aria-selected={activeTab === tab}
                  role="tab"
                  id={`tab-${tab}`}
                  aria-controls={`tabpanel-${tab}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </nav>
        </div>

        {/* User List or Loading */}
        {loading ? (
          <div className="p-6 text-center text-white">Loading connections...</div>
        ) : (
          <ul
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="flex-1 overflow-y-auto px-6 pt-4 pb-6 space-y-3 hide-scrollbar"
          >
            {currentUsers.length ? (
              currentUsers.map((user) => {
                const userId = user._id || user.id;

                const handleProfileClick = () => {
                  if (user.username) {
                    navigate(`/profile/${user.username}`);
                    onClose();
                  }
                };

                return (
                  <li
                    key={`${userId}-${user.username}`}
                    className="flex items-center justify-between gap-4 py-3 border-b border-gray-800 last:border-b-0 rounded-md hover:bg-gray-900 transition cursor-pointer"
                  >
                    <div
                      className="flex items-center gap-4 flex-1 min-w-0"
                      onClick={handleProfileClick}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleProfileClick();
                        }
                      }}
                    >
                      <img
                        src={user?.profilePicture || null}
                        alt={user?.name || user?.username || "User avatar"}
                        className="w-14 h-14 rounded-full border-2 border-gray-700 object-cover flex-shrink-0"
                        loading="lazy"
                        onError={(e) =>
                          (e.currentTarget.src =
                            "https://placehold.co/100x100/555555/ffffff?text=No+Image")
                        }
                      />
                      <div className="min-w-0 overflow-hidden">
                        <p className="font-semibold text-white truncate">
                          {user?.name || user?.username || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          @{user?.username || "unknown"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {user?.bio || ""}
                        </p>
                      </div>
                    </div>

                    {/* ✅ Pass only the userId prop to FollowButton */}
                    <FollowButton userId={userId} />
                  </li>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-8 select-none">
                No users to display.
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserListModel;