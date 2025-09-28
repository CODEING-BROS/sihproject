import React from "react";
import { useParams } from "react-router-dom";

// ✅ Import Zustand hooks and stores
import useGetUserProfile from "@/hooks/useGetUserProfile";
import useGetUserPosts from "@/hooks/useGetUserPosts";
import useAuthStore from "@/store/authStore";
import useProfileUiStore from "@/store/profileUiStore";

import ProfileHeader from "@/components/frontendComponents/ProfileHeader";
import ProfileTabs from "@/components/frontendComponents/ProfileTabs";
import AdditionalInfo from "@/components/frontendComponents/AdditionalInfo";
import AboutOrPosts from "@/components/frontendComponents/AboutOrPosts"; // Assumed a refactored component
import Navbar from "@/components/frontendComponents/Navbar";
import SuggestedDevs from "@/components/frontendComponents/SuggestedDevs";

export default function ProfilePage() {
  const { username: routeUsername } = useParams();

  // ✅ Get user and profile data from Zustand stores
  const { user: authUser, userprofile } = useAuthStore();
  const { activeTab } = useProfileUiStore();

  const isOwnProfile = !routeUsername || routeUsername === authUser?.username;

  // ✅ Call the Zustand-based data fetching hooks
  const { loading: profileLoading, error: profileError } = useGetUserProfile(
    isOwnProfile ? undefined : routeUsername
  );
  useGetUserPosts(isOwnProfile ? undefined : routeUsername); // ✅ This hook populates the post store

  const isLoading = profileLoading || !userprofile;
  const error = profileError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#121417] via-[#232b3a] to-[#121417]">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 border-t-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-[#121417]">
        {error || "User not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1013] text-white font-sans flex flex-col">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <ProfileHeader />
      <ProfileTabs />

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-[25%] hidden md:flex flex-col p-4 sticky top-24 h-fit">
          <div className="bg-[#1a1d23] p-4 rounded">
            <AdditionalInfo />
          </div>
        </aside>

        {/* Middle Content */}
        <main className="w-[50%] flex-1 px-4 md:px-6 py-4">
          {/* ✅ AboutOrPosts now gets all data from Zustand stores, no props needed */}
          <AboutOrPosts />
        </main>

        {/* Right Sidebar */}
        <aside className="w-[25%] hidden md:flex flex-col p-4 sticky top-24 h-fit">
          <SuggestedDevs />
        </aside>
      </div>
    </div>
  );
}