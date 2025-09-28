import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit3, User } from "lucide-react";
import CreatePost from "./CreatePost";

const QuickActions = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const openCreatePostModal = () => setShowCreatePostModal(true);
  const closeCreatePostModal = () => setShowCreatePostModal(false);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showCreatePostModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showCreatePostModal]);

  // Close modal on backdrop click
  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCreatePostModal();
    }
  };

  return (
    <>
      <aside
        className="rounded-xl shadow-lg max-w-full px-4 py-5 bg-[rgba(18,22,43,0.98)] border border-blue-700/20 backdrop-blur-sm"
        style={{
          boxShadow:
            "0 3px 20px rgba(48,117,255,0.06), 0 0.5px 0.5px rgba(31,41,55,0.08)",
        }}
      >
        <h2 className="text-sm font-bold text-blue-100 mb-4 tracking-wide px-1 uppercase">
          Quick Actions
        </h2>

        <nav className="flex flex-col gap-3">
          <Link
            to="/create-room"
            className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm
              transition bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-600 text-white shadow-md
              hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Plus className="w-5 h-5" />
            Create Room
          </Link>

          <button
            type="button"
            onClick={openCreatePostModal}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold
              text-gray-200 bg-[#222231] hover:bg-[#2e3652] shadow transition w-full text-left
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Edit3 className="w-5 h-5 text-blue-300" />
            Write Post
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-semibold
              text-gray-200 bg-[#222231] hover:bg-[#2e3652] shadow transition
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <User className="w-5 h-5 text-blue-300" />
            Profile
          </Link>
        </nav>
      </aside>

      {/* Modal (inline like Navbar) */}
      {showCreatePostModal && (
        <div
          onClick={handleModalBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative w-[600px] max-w-6xl bg-[#2e3247] rounded-xl shadow-lg p-8"
            onClick={(e) => e.stopPropagation()} // prevent backdrop click closing
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeCreatePostModal}
              className="absolute top-4 right-4 text-xl text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close modal"
            >
              &#x2715;
            </button>

            {/* Render CreatePost component */}
            <CreatePost closeModal={closeCreatePostModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;
