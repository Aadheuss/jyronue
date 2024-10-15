import App from "../App";
import SignupPage from "../pages/SignupPage/SignupPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import PostDetailsPage from "../pages/PostDetailsPage/PostDetailsPage";
import HomePage from "../pages/HomePage/HomePage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      { path: "/error", element: <ErrorPage /> },
      {
        path: "/post/:postid",
        element: <PostDetailsPage />,
      },
    ],
  },
];

export default routes;
