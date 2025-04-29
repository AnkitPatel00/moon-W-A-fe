import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import store from "../app/store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";
import Login from "./Pages/Login.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Pages/Signup.jsx";
import ProtectedRoutes from "./Component/ProtectedRoutes.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Project from "./Pages/Project.jsx";
import Team from "./Pages/Team.jsx";
import Reports from "./Pages/Reports.jsx";
import Setting from "./Pages/Setting.jsx";
import LoginRouteProtect from "./Component/LoginRouteProtect.jsx";
import ProjectDetails from "./Pages/ProjectDetails.jsx";
import TaskDetails from "./Pages/TaskDetails.jsx";
import TeamDetails from "./Pages/TeamDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <App />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/project",
        element: <Project />,
      },
      {
        path: "/project-details/:projectId",
        element: <ProjectDetails />,
      },
      {
        path: "/task-details/:taskId",
        element: <TaskDetails />,
      },
      {
        path: "/team",
        element: <Team />,
      },
      {
        path: "/team-details/:teamId",
        element: <TeamDetails />,
      },
      {
        path: "/report",
        element: <Reports />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <LoginRouteProtect>
        <Login />
      </LoginRouteProtect>
    ),
  },
  {
    path: "/signup",
    element: (
      <LoginRouteProtect>
        <Signup />
      </LoginRouteProtect>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
