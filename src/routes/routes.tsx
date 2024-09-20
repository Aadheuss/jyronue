import App from "../App";
import SignupPage from "../pages/SignupPage/SignupPage";

const routes = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
];

export default routes;
