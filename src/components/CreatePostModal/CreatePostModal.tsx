import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ImagePreview from "../ImagePreview/ImagePreview";
import styles from "./CreatePostModal.module.css";
import React, { FC, SetStateAction, useEffect, useRef, useState } from "react";
import { CreatePostFormValues } from "../../config/formValues";
import { useNavigate } from "react-router-dom";
import InputContainer from "../InputContainer/InputContainer";

interface Props {
  setOpenModal: React.Dispatch<SetStateAction<null | (() => void)>>;
}

const CreatePostModal: FC<Props> = ({ setOpenModal }) => {
  const modalRef = useRef<null | HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const methods = useForm<CreatePostFormValues>();
  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = methods;
  const [filesError, setFIlesError] = useState<string[]>([]);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<CreatePostFormValues> = async (data) => {
    setFIlesError([]);
    const formData = new FormData();
    formData.append("caption", data.caption);
    files.forEach((file) => {
      console.log(file);
      formData.append("images", file);
    });

    if (files.length < 1) {
      setFIlesError(["Please select atleast one image"]);
    } else {
      try {
        const res = await fetch("http://localhost:3000/post", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const resData = await res.json();
        console.log(resData);

        if (resData.errors) {
          console.log(resData.errors);
        } else {
          closeModal();
          navigate(`/post/${resData.post.id}`);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const openModal = () => {
    const current = modalRef.current;

    if (current) {
      setIsOpen(true);

      current.showModal();
    }
  };

  const closeModal = () => {
    const current = modalRef.current;

    if (current) {
      setIsOpen(false);
      setFiles([]);
      setPreviews([]);
      clearErrors();
      setFIlesError([]);
      current.close();
    }
  };

  const convertFile: (file: File) => Promise<string> = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject("An error has occured, cannot preview the image");
      };
    });
  };

  useEffect(() => {
    const updateParentState = () => {
      setOpenModal(() => openModal);
    };

    updateParentState();

    const updatePreviews = async () => {
      const newPreviews: string[] = await Promise.all(
        files.map(async (file: File) => {
          try {
            const image: string = await convertFile(file);
            return image;
          } catch (err) {
            console.log(err);
            return "";
          }
        })
      );

      setPreviews([...newPreviews]);
    };

    updatePreviews();

    return () => {
      setOpenModal(null);
    };
  }, [files, setOpenModal]);

  const selectImages = async (e: React.FormEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;

    if (fileInput) {
      const fileList = fileInput.files;
      console.log({ fileList });

      if (fileList) {
        const setupFiles = [...files];
        const acceptedMimetpe = new RegExp(/^(image\/(jpeg|png))$/, "i");

        let i = 0;
        while (setupFiles.length < 10 && i < fileList.length) {
          if (acceptedMimetpe.test(fileList[i].type)) {
            setupFiles.push(fileList[i]);
          }

          i++;
        }

        const containInvalidType = [...fileList].some(
          (file) => !acceptedMimetpe.test(file.type)
        );

        if (containInvalidType) {
          setFIlesError([...filesError, "Can only accept jpeg and png file"]);
        }

        setFiles([...setupFiles]);
      }

      fileInput.value = "";
    }
  };

  const unselectImage = (index: number) => {
    const newFiles = files.filter((_file, i) => {
      return i !== index;
    });

    setFiles([...newFiles]);
  };

  return (
    <div className={styles.modalWrapper}>
      <dialog
        ref={modalRef}
        className={isOpen ? styles.modal : styles.modalHidden}
      >
        <button
          className={styles.closeButton}
          type="button"
          aria-label="Close button"
          onClick={closeModal}
        ></button>
        <FormProvider {...methods}>
          <form
            className={styles.postForm}
            method="dialog"
            encType="multipart/form-data"
            onSubmit={handleSubmit(onSubmit)}
          >
            {errors.caption && (
              <span className={styles.error}>{errors.caption.message}</span>
            )}
            <InputContainer
              isOpen={isOpen}
              type="textarea"
              id="caption"
              name="caption"
              label="Caption"
              labelType="HIDDEN"
              placeholder="Tell a story about your post"
              rows={5}
              autoFocus={true}
              validation={{
                required: "Caption is required",
                maxLength: {
                  message: "Caption cannot be more than 2048 characters",
                  value: 2048,
                },
              }}
              limited={true}
              parentStyles={styles}
            />
            {files.length > 0 && (
              <ImagePreview
                files={files}
                previews={previews}
                unselectImage={unselectImage}
              />
            )}
            {files.length > 0 && (
              <div className={styles.textLimit}>
                <span className={styles.textLimitMain}>{files.length}</span> /
                10
              </div>
            )}

            {filesError && (
              <ul className={styles.filesError}>
                {filesError.map((error, index) => (
                  <span className={styles.error} key={index}>
                    {error}
                  </span>
                ))}
              </ul>
            )}
            <div className={styles.formItem}>
              <div className={styles.inputContainer}>
                <button
                  className={styles.fileButton}
                  type="button"
                  aria-label="Select images"
                  onClick={() => {
                    setFIlesError([]);
                    const current = fileInputRef.current;

                    if (current) {
                      if (files.length < 10) {
                        current.click();
                      }
                    }
                  }}
                ></button>
                <input
                  className={styles.fileInput}
                  ref={fileInputRef}
                  type="file"
                  id="files"
                  name="files"
                  accept="image/png, image/jpeg"
                  multiple
                  onInput={(e) => {
                    selectImages(e);
                  }}
                ></input>
              </div>
              <button className={styles.postButton}>Share</button>
            </div>
          </form>
        </FormProvider>
      </dialog>
    </div>
  );
};

export default CreatePostModal;
