import App from "../App";
import SignupPage from "../pages/SignupPage/SignupPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      { path: "/error", element: <ErrorPage /> },
    ],
  },
];

export default routes;
