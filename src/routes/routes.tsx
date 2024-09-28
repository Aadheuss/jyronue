import App from "../App";
import SignupPage from "../pages/SignupPage/SignupPage";
import LoginPage from "../pages/LoginPage/LoginPage";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
];

export default routes;
