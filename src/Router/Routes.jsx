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
        Component: ClassTracker
      },
      {
        path: "budget-tracker",
        Component: BudgetTracker
      },
      {
        path: "exam-qa",
        Component: ExamQAGenerator
      },
      {
        path: "study-planner",
        Component: StudyPlanner
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