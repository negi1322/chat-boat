import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate } from "react-router-dom";
import SignUp from "./Auth/SignUp";
import FirebaseProvider from "./Firebase/Firebase";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import Login from "./Auth/Login";
import Home from "./Home";
import EditProfile from "./EditProfile";
import Users from "./Users";
import User from "./User";

const PrivateRoute = ({ children }) => {
  const uid = localStorage.getItem("uid");
  if (!uid) {
    return <Navigate to="/" />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const uid = localStorage.getItem("uid");
  if (uid) {
    toast.error("Logout please!");
    return <Navigate to="/home" />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: "/edit/:id",
    element: (
      <PrivateRoute>
        <EditProfile />
      </PrivateRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <PrivateRoute>
        <Users />
      </PrivateRoute>
    ),
  }, {
    path: "/user/:id",
    element: (
      <PrivateRoute>
        <User />
      </PrivateRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <FirebaseProvider>
    <ToastContainer />
    <RouterProvider router={router} />
  </FirebaseProvider>
);
