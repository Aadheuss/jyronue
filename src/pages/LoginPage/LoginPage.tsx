import styles from "./LoginPage.module.css";
import logo from "../../assets/images/jyronue-logo.svg";
import InputContainer from "../../components/InputContainer/InputContainer";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { formValues } from "../../config/formValues";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { errorValue } from "../../config/formValues";
import { UserContext } from "../../context/context";
import { fetchData } from "../../utils/fetchFunctions";
import Loader from "../../components/Loader/Loader";
const domain = import.meta.env.VITE_DOMAIN;

const LoginPage = () => {
  const methods = useForm<formValues>();
  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  const navigate = useNavigate();
  const [focus, setFocus] = useState(false);
  const [error, setError] = useState<null | errorValue>(null);
  const { user, setUser } = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const isLoggedIn = () => {
      if (user) {
        navigate("/");
      }
    };

    isLoggedIn();
  }, [user, navigate]);

  const onSubmit: SubmitHandler<formValues> = async (data) => {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    console.log(`Logging in as ${data.username}`);

    try {
      const login = await fetch(`${domain}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData,
      });

      const loginData = await login.json();

      if (loginData.error) {
        console.error(loginData.error);
        setError(loginData.error);
      } else {
        const userData = await fetchData({
          link: `${domain}/user/profile?id=${loginData.user.id}`,
          options: {
            method: "GET",
            credentials: "include",
          },
        });

        if (userData?.isError) {
          console.log(`Failed to fetch user profile data`);
          console.error(userData.data.error, userData.data.error);
        } else {
          setUser(userData?.data.profile);
          console.log(
            `successfully logged in as ${userData?.data.profile.username}`
          );
          navigate("/");
        }
      }
    } catch (err) {
      console.log(`Something went wrong, failed to log in`);
      console.error(err);
      navigate("/error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.mainWrapper}>
        <main className={styles.main}>
          <div className={styles.imgContainer}>
            <img className={styles.logo} src={logo} alt="Jyronue-logo" />
          </div>
          <div className={styles.mainItem}>
            <div className={styles.greeting}>
              <h1 className={styles.h1}>Welcome to Jyronue</h1>
              <p className={styles.text}>Log in to get started</p>
            </div>
            <FormProvider {...methods}>
              <form
                className={styles.loginForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!isSubmitting) {
                    setIsSubmitting(true);
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
                  {error && error.field === "username" && (
                    <span className={styles.errorTxt}>{error.msg}</span>
                  )}
                  <InputContainer
                    form={{
                      focus,
                      setFocus,
                      setError,
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
                  {error && error.field === "password" && (
                    <span className={styles.errorTxt}>{error.msg}</span>
                  )}
                  <InputContainer
                    form={{
                      focus,
                      setFocus,
                      setError,
                    }}
                    labelType="HIDDEN"
                    id="password"
                    type="password"
                    autoComplete="current-password"
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
                  {isSubmitting ? "logging in" : "Log in"}
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
              Don't have an account?
              <Link className={styles.link} to={"/signup"}>
                {" "}
                Sign up here
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
