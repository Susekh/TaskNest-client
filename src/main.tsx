import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import ContentPage from "./pages/ContentPage.tsx";
import Auth from "./pages/Auth.tsx";
import ProtectRoutes from "./components/ProtectRoutes.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import HandleGithubOauth from "./components/HandleGithubOauth.tsx";
import HandleGoogleOauth from "./components/HandleGoogleOauth.tsx";
import ContentShimmer from "./components/loaders/shimmers/ContentShimmer.tsx";
import Profile from "./pages/Profile.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Project from "./components/projects/Project.tsx";
import Sprint from "./components/sprints/Sprint.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import TaskPage from "./pages/TaskPage.tsx";
import InviteToProject from "./pages/InviteToProject.tsx";
import Conversations from "./pages/Conversations.tsx";
import { ThemeProvider } from "./components/ui/ThemeProvider.tsx";
import PaymentOptionsPage from "./pages/UpgradeProject.tsx";
import RazorPage from "./pages/RazorPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "*",
        element: <ErrorPage />,
      },
      {
        index: true,
        element: (
          <ProtectRoutes isProtected={false}>
            <Home />
          </ProtectRoutes>
        ),
      },
      {
        path: "/auth",
        element: (
          <ProtectRoutes isProtected={true}>
            <Auth />
          </ProtectRoutes>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectRoutes isProtected={true}>
            <Dashboard />
          </ProtectRoutes>
        ),
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/auth/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/shop",
        element: (
          <ProtectRoutes isProtected={true}>
            <ContentShimmer />
          </ProtectRoutes>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectRoutes isProtected={true}>
            <Profile />
          </ProtectRoutes>
        ),
      },
      {
        path: "/profile/edit",
        element: (
          <ProtectRoutes isProtected={true}>
            <EditProfile />
          </ProtectRoutes>
        ),
      },
      {
        path: "/projects/:projectId",
        element: (
          <ProtectRoutes isProtected={true}>
            <Project />
          </ProtectRoutes>
        ),
      },
      {
        path: "/projects/:projectId/invite/:inviteCode",
        element: (
          <ProtectRoutes isProtected={true}>
            <InviteToProject />
          </ProtectRoutes>
        ),
      },
      {
        path: "/projects/:projectId/sprints/:sprintId",
        element: (
          <ProtectRoutes isProtected={true}>
            <Sprint />
          </ProtectRoutes>
        ),
      },
      {
        path: "/projects/:projectId/sprints/:sprintId/task/:taskId",
        element: (
          <ProtectRoutes isProtected={true}>
            <TaskPage />
          </ProtectRoutes>
        ),
      },
      {
        path: "auth/oauth",
        children: [
          {
            path: "github",
            element: <HandleGithubOauth />,
          },
          {
            path: "google",
            element: <HandleGoogleOauth />,
          },
        ],
      },
      {
        path: "/content",
        element: (
          <ProtectRoutes isProtected={true}>
            <ContentPage />
          </ProtectRoutes>
        ),
      },
      {
        path : "/upgrade/:projectId",
        element : (
          <ProtectRoutes isProtected={true} >
            <PaymentOptionsPage/>
          </ProtectRoutes>
        )
      },
      {
        path : "/payment/razorpay/:projectId",
        element : (
          <ProtectRoutes isProtected >
            <RazorPage />
          </ProtectRoutes>
        )
      },
      {
        path: "/conversations/:roomId",
        element: (
          <ProtectRoutes isProtected={true}>
            <Conversations />
          </ProtectRoutes>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <ThemeProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </>
);
