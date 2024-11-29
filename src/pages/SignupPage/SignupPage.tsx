import styles from "./SignupPage.module.css";
import logo from "../../assets/images/jyronue-logo.svg";
import InputContainer from "../../components/InputContainer/InputContainer";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { formValues } from "../../config/formValues";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { errorValue } from "../../config/formValues";
import Loader from "../../components/Loader/Loader";
const domain = import.meta.env.VITE_DOMAIN;

const SignupPage = () => {
  const methods = useForm<formValues>();
  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  const navigate = useNavigate();
  const [focus, setFocus] = useState(false);
  const [errorList, setErrorList] = useState<errorValue[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit: SubmitHandler<formValues> = async (data) => {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    setIsSubmitting(true);
    console.log(`Signing up with username ${data.username}`);

    try {
      const login = await fetch(`${domain}/user/signup`, {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const loginData = await login.json();

      // Handle errors

      // Handle field validation error
      if (loginData.error) {
        const errorData = loginData.error;

        // Log error message
        console.log(
          `Failed to signup with username ${data.username}: ` +
            errorData.message
        );

        /* The error object consists of error with nested message and either a nested errors
         field or a nested error field */

        // errors field is an array with a list of validation errors
        // Set validation errors to be printed to the UI
        if (errorData.errors) setErrorList(errorData.errors);
      } else {
        // log successful signup message to the console and navigate to the login page
        console.log(loginData.message);
        navigate("/login");
      }
    } catch (err) {
      console.log("Something went wrong, failed to sign up");
      if (err instanceof TypeError) console.log(err.message);
      navigate("/error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.signupPageWrapper}>
      <div className={styles.mainWrapper}>
        <main className={styles.main}>
          <div></div>
          <div className={styles.imgContainer}>
            <img className={styles.logo} src={logo} alt="Jyronue-logo" />
          </div>
          <div className={styles.mainItem}>
            <div className={styles.greeting}>
              <h1 className={styles.h1}>Welcome to Jyronue</h1>
              <p className={styles.text}>Create an account to get started</p>
            </div>
            <FormProvider {...methods}>
              <form
                className={styles.signupForm}
                onSubmit={(e) => {
                  e.preventDefault();

                  if (!isSubmitting) {
                    handleSubmit(onSubmit)();
                  }
                }}
              >
                <div className={styles.itemContainer}>
                  {errors.username && (
                    <span className={styles.errorTxt}>
                      {errors.username.message}
                    </span>
                  )}
                  {errorList &&
                    errorList.map(
                      (error: errorValue, index) =>
                        error.field === "username" && (
                          <span key={index} className={styles.errorTxt}>
                            {error.msg}
                          </span>
                        )
                    )}
                  <InputContainer
                    form={{
                      focus,
                      setFocus,
                      setErrorList,
                    }}
                    labelType="HIDDEN"
                    id="username"
                    autoComplete="username"
                    label="Username"
                    validation={{
                      required: "Username is required",
                      maxLength: {
                        value: 32,
                        message: "Username cannot exceed 32 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message:
                          "Username must only contain letters, numbers and underscores",
                      },
                    }}
                  />
                </div>

                <div className={styles.itemContainer}>
                  {errors.password && (
                    <span className={styles.errorTxt}>
                      {errors.password.message}
                    </span>
                  )}
                  {errorList &&
                    errorList.map(
                      (error: errorValue, index) =>
                        error.field === "password" && (
                          <span key={index} className={styles.errorTxt}>
                            {error.msg}
                          </span>
                        )
                    )}
                  <InputContainer
                    form={{
                      focus,
                      setFocus,
                      setErrorList,
                    }}
                    labelType="HIDDEN"
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    label="Password"
                    validation={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be longer than 8 characters",
                      },
                      pattern: {
                        value: /^\S[\s\S]+\S$/,
                        message:
                          "Password cannot start or end with white space characters",
                      },
                    }}
                  />
                </div>

                <button className={styles.submitButton} type="submit">
                  {isSubmitting ? "Signing up" : "Sign up"}

                  {isSubmitting && (
                    <Loader
                      type="dots"
                      size={{ height: "0.25em", width: "1.5em" }}
                      color="var(--main-color-2)"
                    />
                  )}
                </button>
              </form>
            </FormProvider>
            <p className={styles.text}>
              Already have an account?
              <Link className={styles.link} to={"/login"}>
                {" "}
                Sign in here
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignupPage;
