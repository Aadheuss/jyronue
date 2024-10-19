import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ImagePreview from "../ImagePreview/ImagePreview";
import styles from "./CreatePostModal.module.css";
import React, { FC, SetStateAction, useEffect, useRef, useState } from "react";
import { CreatePostFormValues } from "../../config/formValues";
import TextArea from "../TextArea/TextArea";

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
  } = methods;

  const onSubmit: SubmitHandler<CreatePostFormValues> = async (data) => {
    console.log(data);
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

      if (fileList) {
        const setupFiles = [...files];
        let i = 0;
        while (setupFiles.length < 10 && i < fileList.length) {
          setupFiles.push(fileList[i]);
          i++;
        }

        setFiles([...setupFiles]);
      }

      fileInput.value = "";
    }

    console.log(fileInput.files);
    console.log(files);
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
            {errors.content && (
              <span className={styles.error}>{errors.content.message}</span>
            )}
            <TextArea
              isOpen={isOpen}
              id="caption"
              name="content"
              label="Caption"
              placeholder="Tell a story about your post"
              rows={5}
              autoFocus={true}
              rules={{
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
              <ImagePreview previews={previews} unselectImage={unselectImage} />
            )}
            {files.length > 0 && (
              <div className={styles.textLimit}>
                <span className={styles.textLimitMain}>{files.length}</span> /
                10
              </div>
            )}

            <div className={styles.formItem}>
              <div className={styles.inputContainer}>
                <button
                  className={styles.fileButton}
                  type="button"
                  aria-label="Select images"
                  onClick={() => {
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
