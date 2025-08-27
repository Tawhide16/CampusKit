import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:MainLayout,
  },
])