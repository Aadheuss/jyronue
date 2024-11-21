import styles from "./SettingPage.module.css";
import NavBar from "../../components/NavBar/NavBar";
import avatar from "../../assets/images/avatar_icon.svg";
import InputContainer from "../../components/InputContainer/InputContainer";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { SettingFormValues } from "../../config/formValues";
import { useContext, useEffect, useRef, useState } from "react";
import { convertFile } from "../../utils/fileHelper";
import Input from "../../components/Input/Input";
import { UserContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/fetchFunctions";
import { UserProfileValue, UserValue } from "../../config/typeValues";
import { unescapeInput } from "../../utils/htmlDecoder";
const domain = import.meta.env.VITE_DOMAIN;

type filePreview = null | string;

const SettingPage = () => {
  const { user, setUser } = useContext(UserContext);
  const methods = useForm<SettingFormValues>();
  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  const avatarInputRef = useRef<null | HTMLInputElement>(null);
  const bannerInputRef = useRef<null | HTMLInputElement>(null);
  const [avatarImg, setAvatarImg] = useState<null | File>(null);
  const [avatarPreview, setAvatarPreview] = useState<filePreview>(null);
  const [bannerImg, setBannerImg] = useState<null | File>(null);
  const [bannerPreview, setBannerPreview] = useState<filePreview>(null);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<null | UserProfileValue>(null);

  useEffect(() => {
    if (user === false) {
      navigate("/");
    }

    const fetchUserProfile = async () => {
      if (user) {
        const userProfile = await fetchData({
          link: `${domain}/user/profile?id=${user.id}`,
          options: {
            method: "GET",
            credentials: "include",
          },
        });

        if (userProfile?.isError) {
          console.error(userProfile?.data.error, userProfile?.data.errors);
        } else {
          setProfile(userProfile?.data.profile);
        }
      }
    };

    const updatePreviews = async () => {
      const updatePreview = async (
        file: null | File
      ): Promise<string | null> => {
        if (file === null) {
          return null;
        }

        try {
          const image: string = await convertFile(file);
          return image;
        } catch (err) {
          console.error(err);
          return null;
        }
      };

      const [newAvatarPreview, newBannerPreview]: filePreview[] =
        await Promise.all([updatePreview(avatarImg), updatePreview(bannerImg)]);

      fetchUserProfile();
      setAvatarPreview(newAvatarPreview);
      setBannerPreview(newBannerPreview);
    };

    updatePreviews();

    return () => {
      setAvatarPreview(null);
    };
  }, [avatarImg, bannerImg, user, navigate]);

  const selectImage = (
    e: React.FormEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<null | File>>
  ) => {
    const fileInput = e.target as HTMLInputElement;

    if (fileInput) {
      const file = fileInput.files ? fileInput.files[0] : null;
      const acceptedMimetpe = new RegExp(/^(image\/(jpeg|png))$/, "i");
      const isAccepted = file ? acceptedMimetpe.test(file.type) : false;

      if (isAccepted) {
        setImage(file);
      } else {
        fileInput.value = "";
      }
    }
  };

  const createFileValidationFn = (
    mimetype: string[],
    msg: string
  ): ((value: string | FileList) => string | boolean) => {
    const validateFile = (value: string | FileList) => {
      const acceptedMimetype = mimetype;
      const fileList = value as FileList;
      const file = FileList ? fileList[0] : null;

      if (file) {
        if (acceptedMimetype.includes(file.type)) {
          return true;
        }
        return msg;
      }

      return true;
    };

    return validateFile;
  };

  const onSubmit: SubmitHandler<SettingFormValues> = async (data) => {
    const formData = new FormData();
    formData.append("displayname", data.displayname);
    formData.append("bio", data.bio);
    if (avatarImg) {
      formData.append("avatar", avatarImg);
    }

    if (bannerImg) {
      formData.append("banner", bannerImg);
    }

    console.log({
      avatarImg,
      bannerImg,
      displayname: data.displayname,
      bio: data.bio,
    });

    const userProfile = await fetchData({
      link: `${domain}/user/profile`,
      options: {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    });

    if (userProfile?.isError) {
      console.error(userProfile?.data.error, userProfile?.data.errors);
    } else {
      const pictureUrl = userProfile
        ? userProfile.data.profile.profileImage.pictureUrl
        : null;

      setUser({
        ...user,
        profileImage: {
          pictureUrl,
        },
      } as UserValue);

      navigate(`/profile/${userProfile?.data.profile.username}`);
    }
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
                  {errors.banner && (
                    <span className={styles.bannerErrorTxt}>
                      {errors.banner.message}
                    </span>
                  )}
                  {profile &&
                    (profile.profileImage.bannerUrl || bannerPreview) && (
                      <img
                        className={styles.img}
                        src={
                          bannerPreview ||
                          profile.profileImage.bannerUrl ||
                          undefined
                        }
                        alt="Banner image"
                      />
                    )}

                  <button
                    className={styles.fileImgButton}
                    type="button"
                    aria-label="Select new banner image"
                    onClick={() => {
                      const current = bannerInputRef.current;

                      if (current) {
                        current.click();
                      }
                    }}
                  ></button>
                </div>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarItem}>
                    <img
                      className={styles.avatar}
                      src={
                        avatarPreview ||
                        profile?.profileImage.pictureUrl ||
                        avatar
                      }
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
              {errors.avatar && (
                <span className={styles.errorTxt}>{errors.avatar.message}</span>
              )}
              <Input
                parentRef={bannerInputRef}
                id="banner"
                name="banner"
                type="file"
                accept="image/png, image/jpeg"
                validation={{
                  validate: createFileValidationFn(
                    ["image/jpeg", "image/png"],
                    "Banner image can only accept jpeg or png file"
                  ),
                }}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  selectImage(e, setBannerImg);
                }}
                styles={styles}
              />
              <Input
                parentRef={avatarInputRef}
                id="avatar"
                name="avatar"
                type="file"
                accept="image/png, image/jpeg"
                validation={{
                  validate: createFileValidationFn(
                    ["image/jpeg", "image/png"],
                    "Avatar image can only accept jpeg or png file"
                  ),
                }}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  selectImage(e, setAvatarImg);
                }}
                styles={styles}
              />

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
                baseInput={profile?.displayName}
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
                baseInput={
                  profile?.bio ? unescapeInput(profile.bio) : undefined
                }
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
