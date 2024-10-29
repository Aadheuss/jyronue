import styles from "./SettingPage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import avatar from "../../assets/images/avatar_icon.svg";
import bannerImage from "../../assets/images/mr-karl-unsplash.jpg";
import InputContainer from "../../components/InputContainer/InputContainer";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SettingFormValues } from "../../config/formValues";

const SettingPage = () => {
  const methods = useForm<SettingFormValues>();
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<SettingFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <>
      <NavBar />
      <main className={styles.mainWrapper}>
        <FormProvider {...methods}>
          <form
            className={styles.settingForm}
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className={styles.formHeading}>Edit profile</h2>
            <div className={styles.imageContainer}>
              <div className={styles.bannerContainer}>
                <img
                  className={styles.img}
                  src={bannerImage}
                  alt="Banner image"
                />
              </div>
              <div className={styles.avatarContainer}>
                <img
                  className={styles.avatar}
                  src={avatar}
                  alt="Avatar image"
                />
              </div>
            </div>

            <InputContainer
              id="displayname"
              autoComplete="off"
              label="Display name"
              parentStyles={styles}
              validation={{
                required: "Display name is required",
                maxLength: {
                  value: 32,
                  message: "Display name cannot exceed 32 characters",
                },
              }}
              withErrors={true}
            />

            <InputContainer
              type="textarea"
              id="bio"
              autoComplete="off"
              label="Bio"
              parentStyles={styles}
              validation={{
                maxLength: {
                  value: 255,
                  message: "Bio cannot exceed 255 characters",
                },
              }}
              withErrors={true}
            />

            <button className={styles.saveButton}>Save</button>
          </form>
        </FormProvider>
      </main>
    </>
  );
};

export default SettingPage;
