import React from "react";
import { Outlet } from "react-router-dom";
import QuickActions from "@/components/frontendComponents/QuickActions";
import SuggestedDevs from "@/components/frontendComponents/SuggestedDevs";
import Navbar from "@/components/frontendComponents/Navbar";

const NAVBAR_HEIGHT = 56;

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#010309] text-white flex flex-col">
      {/* Navbar */}
      <div
        className="sticky top-0 z-50 bg-[#010309]"
        style={{ height: NAVBAR_HEIGHT }}
      >
        <Navbar />
      </div>

      {/* Main layout body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <main
          className="flex-1 overflow-y-auto p-4 lg:p-6 hide-scrollbar"
          style={{ maxHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
        >
          <Outlet />
        </main>

        {/* Right sidebar */}
        <aside
          className="hidden lg:flex flex-col gap-4 w-[350px] border-l border-gray-800 bg-[#0b0f1c] p-4"
          style={{
            position: "sticky",
            top: NAVBAR_HEIGHT,
            height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          }}
        >
          {/* QuickActions stays sticky inside the sidebar */}
          <div className="sticky top-4 z-20">
            <QuickActions />
          </div>

          {/* SuggestedDevs scrolls independently */}
          <div className="mt-4 flex-1 overflow-y-auto hide-scrollbar pb-4">
            <SuggestedDevs />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MainLayout;
