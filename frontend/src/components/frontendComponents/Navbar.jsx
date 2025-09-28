import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  LogOut,
  User,
  FilePlus2,
  Users,
  Compass,
  LayoutGrid,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { BsChatSquareDots } from "react-icons/bs";

// ✅ Import Zustand stores and actions
import useAuthStore from "@/store/authStore";

// Import your CreatePost component here (adjust path)
import CreatePost from "./CreatePost";

const Navbar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  const userDropdownRef = useRef(null);
  const createDropdownRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Get user data and the setAuthUser action from Zustand
  const { user, setAuthUser } = useAuthStore();
  const userName = user?.username || "Guest";
  const userAvatar =
    user?.profilePicture ||
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // Fallback image

  const handleLogout = async () => {
  try {
    const res = await axios.post(
      "http://localhost:4000/user/logout",
      {},
      {
        withCredentials: true,
      }
    );
    if (res.data.success) {
      setAuthUser(null);
      toast.success(res.data.message);
      navigate("/login");
    }
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error(error.response?.data?.message || "Logout failed. Please try again.");
    
    // ✅ Add these two lines to force a redirect on any error
    setAuthUser(null);
    navigate("/login");
  }
};

  // Close dropdowns on clicking outside or pressing Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        createDropdownRef.current &&
        !createDropdownRef.current.contains(e.target)
      ) {
        setCreateDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setUserDropdownOpen(false);
        setCreateDropdownOpen(false);
        setShowCreatePostModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle opening Create Post modal
  const openCreatePostModal = () => {
    setCreateDropdownOpen(false); // close dropdown
    setShowCreatePostModal(true);
  };

  // Close modal function
  const closeCreatePostModal = () => {
    setShowCreatePostModal(false);
  };

  // Click outside modal to close
  const handleModalBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCreatePostModal();
    }
  };

  return (
    <>
      <header
        className="w-full bg-[#010309] text-white border-b border-gray-800 px-6 py-4 flex items-center justify-between"
        role="banner"
      >
        {/* Left - Logo & Links */}
        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold">DevPair</h1>
          <nav
            className="hidden md:flex gap-6 text-sm text-gray-300"
            aria-label="Primary navigation"
          >
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>
            <Link
              to="/quiz"
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>Quiz</span>
            </Link>
            <Link
              to="/rooms"
              className="flex items-center gap-1 hover:text-white transition"
            >
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
              <span>Rooms</span>
            </Link>
            <Link
              to="/chats"
              className="flex items-center gap-1 hover:text-white transition"
            >
              <BsChatSquareDots className="w-4 h-4" aria-hidden="true" />
              <span>Chats</span>
            </Link>
            <Link to="/about" className="hover:text-white transition">
              About Us
            </Link>
          </nav>
        </div>

        {/* Right - Create, User */}
        <div className="flex items-center gap-4 relative">
          {/* Create Dropdown */}
          <div className="relative" ref={createDropdownRef}>
            <button
              aria-haspopup="true"
              aria-expanded={createDropdownOpen}
              onClick={() => setCreateDropdownOpen((open) => !open)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Create</span>
            </button>

            {createDropdownOpen && (
              <ul
                role="menu"
                aria-label="Create menu"
                className="absolute z-20 mt-2 w-40 bg-[#0e0e12] border border-gray-700 rounded-md shadow-lg"
              >
                <li role="menuitem">
                  <button
                    onClick={openCreatePostModal} // open modal instead of navigate
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-800 transition focus:outline-none"
                    type="button"
                  >
                    <FilePlus2 className="w-4 h-4" aria-hidden="true" />
                    Post
                  </button>
                </li>
                <li role="menuitem">
                  <button
                    onClick={() => {
                      setCreateDropdownOpen(false);
                      navigate("/create-room");
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-800 transition focus:outline-none"
                    type="button"
                  >
                    <Users className="w-4 h-4" aria-hidden="true" />
                    Room
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={userDropdownRef}>
            <button
              aria-haspopup="true"
              aria-expanded={userDropdownOpen}
              onClick={() => setUserDropdownOpen((open) => !open)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="button"
            >
              <img
                src={userAvatar}
                alt={`${userName}'s avatar`}
                className="w-6 h-6 rounded-full object-cover"
                loading="lazy"
              />
              <span>{userName}</span>
            </button>

            {userDropdownOpen && (
              <ul
                role="menu"
                aria-label="User menu"
                className="absolute z-20 mt-2 w-40 right-0 bg-[#0e0e12] border border-gray-700 rounded-md shadow-lg"
              >
                <li role="menuitem">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-800 transition focus:outline-none"
                    type="button"
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                    Profile
                  </button>
                </li>
                <li role="menuitem">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-800 transition focus:outline-none"
                    type="button"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Log out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </header>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div
          onClick={handleModalBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-labelledby="create-post-modal-title"
        >
          <div className="relative w-[600px] max-w-6xl bg-[#2e3247] rounded-xl shadow-lg p-8">
            {/* Close button */}
            <button
              type="button"
              onClick={closeCreatePostModal}
              className="absolute top-[90px] right-12 text-xl text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close modal"
            >
              &#x2715; {/* Unicode cross "×" */}
            </button>

            {/* Render your CreatePost component */}
            <CreatePost closeModal={closeCreatePostModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;