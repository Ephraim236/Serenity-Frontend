import { createBrowserRouter, redirect } from "react-router";
import { AppLayout } from "./layouts/AppLayout";
import { ClientHome } from "./pages/ClientHome";
import { BookingPage } from "./pages/BookingPage";
import { MyBookings } from "./pages/MyBookings";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminAppointments } from "./pages/AdminAppointments";
import { AdminServices } from "./pages/AdminServices";
import { AdminProfile } from "./pages/AdminProfile";

import { LoginPage } from "./pages/LoginPage";
import { SignUpPage } from "./pages/SignUpPage";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Auth callback component - handles OAuth redirect
function AuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  
  if (token) {
    // Store token and redirect to home
    localStorage.setItem("serenity_auth_token", token);
    // Decode token payload to get user info (simple base64 decode)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = {
        id: payload.id,
        email: payload.email,
        name: payload.name || "User",
        role: payload.role || "client",
        avatar: payload.avatar || "",
      };
      localStorage.setItem("serenity_auth_user", JSON.stringify(user));
      window.location.href = payload.role === "business" ? "/admin" : "/";
    } catch {
      window.location.href = "/";
    }
  } else {
    window.location.href = "/login?error=auth_failed";
  }
  
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: ClientHome,
      },
      {
        path: "book",
        Component: () => (
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-bookings",
        Component: () => (
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        children: [
          {
            index: true,
            Component: () => (
              <ProtectedRoute requiredRole="business">
                <AdminDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: "appointments",
            Component: () => (
              <ProtectedRoute requiredRole="business">
                <AdminAppointments />
              </ProtectedRoute>
            ),
          },
          {
            path: "services",
            Component: () => (
              <ProtectedRoute requiredRole="business">
                <AdminServices />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            Component: () => (
              <ProtectedRoute requiredRole="business">
                <AdminProfile />
              </ProtectedRoute>
            ),
          },
          
        ],
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignUpPage,
  },
  {
    path: "/auth/callback",
    Component: AuthCallback,
  },
]);
