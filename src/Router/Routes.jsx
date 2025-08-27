import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../Pages/Home";
import Login from "../Components/Authentication/LogIn";
import Register from "../Components/Authentication/Register";
import ClassTracker from "../Pages/ClassTracker";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component: Register
      },
      {
        path: "class-tracker",
        Component:ClassTracker
      }
    ]
  },
])