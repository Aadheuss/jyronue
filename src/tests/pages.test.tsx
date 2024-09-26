import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupPage from "../pages/SignupPage/SignupPage";

import { BrowserRouter } from "react-router-dom";

describe("Signup Page", () => {
  it("Container match snapshot", () => {
    const { container } = render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );

    expect(container).toMatchSnapshot();
  });

  it("Render error when submitting invalid username input with forbidden chracters, and empty password", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );

    const usernameInput: HTMLInputElement = screen.getByLabelText(/Username/);
    const button = screen.getByRole("button", { name: "Sign up" });

    await user.click(button);
    await user.type(usernameInput, "jyro.new");

    expect(usernameInput.value).toBe("jyro.new");
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "span" &&
          content.includes(
            "Username must only contain letters, numbers and underscores"
          )
        );
      })
    ).toBeTruthy();
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "span" &&
          content.includes("Password is required")
        );
      })
    ).toBeTruthy();
  });
});
