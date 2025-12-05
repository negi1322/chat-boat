
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate } from "react-router-dom";
import SignUp from "./Auth/SignUp";
import FirebaseProvider from "./Firebase/Firebase";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Login from "./Auth/Login";

const PrivateRoute = ({ children }) => {
  const name = localStorage.getItem("email");
  if (!name) {
    return <Navigate to="/" />
  }
  return children;

}

const PublicRoute = ({ children }) => {
  const name = localStorage.getItem("email");
  if (name) {
    return <Navigate to="/home" />
  }
  return children;

};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute>
      <SignUp />
    </PublicRoute>,
  }, {
    path: "/login",
    element: <PublicRoute>
      <Login  />
    </PublicRoute>,
  },
]);


createRoot(document.getElementById("root")).render(
  <FirebaseProvider >
    <ToastContainer />
    <RouterProvider router={router} />
  </FirebaseProvider>
);
