import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import RoomsPage from "./pages/Rooms";
import CreateRoomPage from "./components/frontendComponents/NewRoom";
import Explore from "./pages/Explore";
import AboutUs from "./pages/AboutUs";
import EditProfile from "./components/frontendComponents/EditProfile";
import ChatsPage from "./pages/ChatsPage";
import Profile from "./pages/Profile";
import RoomCallPage from "./pages/RoomCallPage";
import OnBoarding from "./pages/OnBoarding";
import CallPage from "./pages/CallPage"; // ✅ Added import
import QuizPage from "./pages/QuizPage";
// Layouts
import MainLayout from "./pages/MainLayout";

// Zustand Store + Hooks
import useAuthStore from "@/store/authStore";
import useAuthUser from "./hooks/useAuthUser";
import { Loader2 } from "lucide-react";

const AppRoot = () => {
  const { isLoading } = useAuthUser();
  const authUser = useAuthStore((state) => state.user); // ✅ The fix: Only render the loader while `isLoading` is true. // This prevents the router from being created until authentication state is finalized.

  if (isLoading) {
    return <Loader2 />;
  }

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = Boolean(authUser?.isOnboarded);

  const router = createBrowserRouter([
    // --------------------------
    // Public Routes
    // --------------------------
    {
      path: "/login",
      element: !isAuthenticated ? (
        <Login />
      ) : (
        <Navigate to={isOnboarded ? "/" : "/onboarding"} />
      ),
    },
    {
      path: "/signup",
      element: !isAuthenticated ? (
        <Signup />
      ) : (
        <Navigate to={isOnboarded ? "/" : "/onboarding"} />
      ),
    }, // -------------------------- // Onboarding // --------------------------

    {
      path: "/onboarding",
      element: isAuthenticated ? (
        !isOnboarded ? (
          <OnBoarding />
        ) : (
          <Navigate to="/" />
        )
      ) : (
        <Navigate to="/login" />
      ),
    }, // -------------------------- // Protected Routes (MainLayout only for Home, Rooms, Explore) // --------------------------

    {
      path: "/",
      element:
        isAuthenticated && isOnboarded ? (
          <MainLayout />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ),
      children: [
        { index: true, element: <Home /> },
        { path: "rooms", element: <RoomsPage /> },
        { path: "explore", element: <Explore /> },
      ],
    }, // -------------------------- // Standalone Routes (no MainLayout) // --------------------------

    {
      path: "/create-room",
      element:
        isAuthenticated && isOnboarded ? (
          <CreateRoomPage />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ),
    },
    {
      path: "/edit-profile",
      element:
        isAuthenticated && isOnboarded ? (
          <EditProfile />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ),
    },
    {
      path: "/profile",
      element:
        isAuthenticated && isOnboarded ? (
          <Profile />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ),
    },
    {
      path: "/profile/:username",
      element:
        isAuthenticated && isOnboarded ? (
          <Profile />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ),
    },
    {
      path: "/chats",
      element:
        isAuthenticated && isOnboarded ? (
          <ChatsPage />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ),
    },
    {
      path: "/call/:id", // 1-on-1 calls
      element:
        isAuthenticated && isOnboarded ? (
          <CallPage />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ),
    },
    {
      path: "/rooms/:id", // Group / Room calls
      element:
        isAuthenticated && isOnboarded ? (
          <RoomCallPage />
        ) : (
          <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
        ),
    },

    {
      path: "/about",
      element: <AboutUs />,
    },
    {
      path: "/quiz",
      element: <QuizPage />,
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoot;
