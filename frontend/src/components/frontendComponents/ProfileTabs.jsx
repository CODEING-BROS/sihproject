import React from "react";
import useProfileUiStore from "@/store/profileUiStore";

export default function ProfileTabs() {
  const { activeTab, setActiveTab } = useProfileUiStore();

  const tabClasses = (tab) =>
    `py-3 px-6 rounded-t-md transition-all duration-200 ${
      activeTab === tab
        ? "border-b-2 border-blue-500 text-white"
        : "text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-500"
    }`;

  return (
    <div className="flex justify-center gap-6 border-b border-gray-800 bg-[#13161a]">
      <button
        className={tabClasses("details")}
        onClick={() => setActiveTab("details")}
        aria-current={activeTab === "details" ? "page" : undefined}
      >
        Details
      </button>
      <button
        className={tabClasses("posts")}
        onClick={() => setActiveTab("posts")}
        aria-current={activeTab === "posts" ? "page" : undefined}
      >
        Posts
      </button>
      <button
        className={tabClasses("bookmarked")}
        onClick={() => setActiveTab("bookmarked")}
        aria-current={activeTab === "bookmarked" ? "page" : undefined}
      >
        Bookmarked Posts
      </button>
    </div>
  );
}