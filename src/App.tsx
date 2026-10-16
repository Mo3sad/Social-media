import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Auth/Register/Register";
import MainLayout from "./layout/MainLayout/MainLayout";
import Login from "./pages/Auth/Login/Login";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";
import { ThemeProvider } from "./Context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {UserDataProvider} from "./Context/userData.Context"
import SinglePost from "./pages/Home/components/singlePost/singlePost";
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/Profile/UserProfile";

import Settings from "./pages/Settings/Settings";
const queryClient = new QueryClient();
function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 3. طالما اللودينج شغال يظهر الـ Loader فقط
  if (isLoading) {
    return <Loader />;
  }
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },

    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/postDetails/:id",
          element: (
            <ProtectedRoute>
              <SinglePost />
            </ProtectedRoute>
          ),
        },
        {
          path: "/UserProfile/:userId",
          element: (
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
          {
          path: "/setting",
          element: (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          ),
        },
        
        {
          path: "profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <UserDataProvider>
          <ThemeProvider>
            <RouterProvider router={router} />
          </ThemeProvider>
        </UserDataProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
