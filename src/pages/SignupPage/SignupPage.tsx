import styles from "./SignupPage.module.css";
import logo from "../../assets/images/jyronue-logo.svg";
import InputContainer from "../../components/InputContainer/InputContainer";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { formValues } from "../../config/formValues";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignupPage = () => {
  const methods = useForm<formValues>();
  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  const navigate = useNavigate();
  const [focus, setFocus] = useState(false);

  const onSubmit: SubmitHandler<formValues> = async (data) => {
    const formData = new URLSearchParams();
    formData.append("username", data.username);
    formData.append("password", data.password);

    try {
      const res = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const resData = await res.json();
      console.log(resData);

      if (resData.errors) {
        console.log(resData.errors);
      } else {
        console.log(resData);
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      navigate("/error");
    }
  };

  return (
    <div className={styles.signupPageWrapper}>
      <main className={styles.main}>
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
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.itemContainer}>
                {errors.username && (
                  <span className={styles.errorTxt}>
                    {errors.username.message}
                  </span>
                )}
                <InputContainer
                  form={{
                    focus,
                    setFocus,
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
                <InputContainer
                  form={{
                    focus,
                    setFocus,
                  }}
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

              <button type="submit">Sign up</button>
            </form>
          </FormProvider>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
