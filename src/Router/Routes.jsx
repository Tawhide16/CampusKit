import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../Pages/Home";
import Login from "../Components/Authentication/LogIn";
import Register from "../Components/Authentication/Register";
import ClassTracker from "../Pages/ClassTracker";
import BudgetTracker from "../Pages/Budget Tracker";
import ExamQAGenerator from "../Pages/ExamQAGenerator.jsx";
import StudyPlanner from "../Pages/StudyPlanner.jsx";
import Dashboard from "../Pages/Dashboard.jsx";
import MyProfile from "../Pages/MyProfile.jsx";
import PrivetRouter from "../Provider/PrivateRoute.jsx";

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
        element:<PrivetRouter><ClassTracker/></PrivetRouter>
      },
      {
        path: "budget-tracker",
        element:<PrivetRouter><BudgetTracker/></PrivetRouter>
      },
      {
        path: "exam-qa",
        element:<PrivetRouter><ExamQAGenerator/></PrivetRouter>
      },
      {
        path: "study-planner",
        element:<PrivetRouter><StudyPlanner/></PrivetRouter>
      },
    ]
  },
  {
    path: "dashboard",
    Component: Dashboard
  },
  {
    path: "myProfile",
    Component: MyProfile
  }
])