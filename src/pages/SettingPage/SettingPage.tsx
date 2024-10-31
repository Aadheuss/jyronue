import styles from "./SettingPage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import avatar from "../../assets/images/avatar_icon.svg";
import bannerImage from "../../assets/images/mr-karl-unsplash.jpg";
import InputContainer from "../../components/InputContainer/InputContainer";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SettingFormValues } from "../../config/formValues";
import { useRef, useState } from "react";

const SettingPage = () => {
  const methods = useForm<SettingFormValues>();
  const { handleSubmit } = methods;
  const avatarInputRef = useRef<null | HTMLInputElement>(null);
  const bannerInputRef = useRef<null | HTMLInputElement>(null);
  const [avatarImg, setAvatarImg] = useState<null | File>(null);
  const [bannerImg, setBannerImg] = useState<null | File>(null);

  const selectImage = (e: React.FormEvent<HTMLInputElement>) => {};

  const onSubmit: SubmitHandler<SettingFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <>
      <NavBar />
      <main className={styles.mainWrapper}>
        <div className={styles.formWrapper}>
          <h2 className={styles.formHeading}>Edit profile</h2>
          <FormProvider {...methods}>
            <form
              className={styles.settingForm}
              method="post"
              encType="multipart/form-data"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className={styles.imageContainer}>
                <div className={styles.bannerContainer}>
                  <img
                    className={styles.img}
                    src={bannerImage}
                    alt="Banner image"
                  />
                </div>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarItem}>
                    <img
                      className={styles.avatar}
                      src={avatar}
                      alt="Avatar image"
                    />
                    <button
                      className={styles.fileImgButton}
                      type="button"
                      aria-label="Select new avatar image"
                      onClick={() => {
                        const current = avatarInputRef.current;

                        if (current) {
                          current.click();
                        }
                      }}
                    ></button>
                  </div>
                </div>
              </div>
              <input
                className={styles.fileInput}
                ref={avatarInputRef}
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                onInput={(e) => {
                  selectImage(e);
                }}
              ></input>

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
        </div>
      </main>
    </>
  );
};

export default SettingPage;
