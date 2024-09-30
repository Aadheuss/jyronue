import styles from "./LoginPage.module.css";
import logo from "../../assets/images/jyronue-logo.svg";
import InputContainer from "../../components/InputContainer/InputContainer";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { formValues } from "../../config/formValues";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { errorValue } from "../../config/formValues";

const LoginPage = () => {
  const methods = useForm<formValues>();
  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  const navigate = useNavigate();
  const [focus, setFocus] = useState(false);
  const [error, setError] = useState<null | errorValue>(null);

  const onSubmit: SubmitHandler<formValues> = async (data) => {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    try {
      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: formData,
      });

      const resData = await res.json();
      console.log(resData);

      if (resData.error) {
        console.log(resData.error);
        setError(resData.error);
      } else {
        console.log(resData);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      navigate("/error");
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
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
              onSubmit={handleSubmit(onSubmit)}
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

              <button type="submit">Log up</button>
            </form>
          </FormProvider>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
