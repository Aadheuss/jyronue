import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./CommentBox.module.css";
import { CommentFormValue } from "../../config/formValues";
import { useParams } from "react-router-dom";
import { FC, useState } from "react";
import { CommentValue } from "../../config/typeValues";

interface Props {
  updateComments: ({ comment }: { comment: CommentValue }) => void;
  commentInputRef: React.MutableRefObject<null | HTMLInputElement>;
}

const CommentBox: FC<Props> = ({ updateComments, commentInputRef }) => {
  const params = useParams();
  const postId = params.postid;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CommentFormValue>();
  const { ref, ...rest } = register("content", {
    required: "Comment is required",
    validate: (value) => {
      const regex = new RegExp(/\s/, "g");
      const filteredValue = value.replace(regex, "");
      return filteredValue.length > 0
        ? true
        : "Comment cannot only contain white-space characters";
    },
  });
  const [input, setInput] = useState("");

  const onSubmit: SubmitHandler<CommentFormValue> = async (data) => {
    const formData = new URLSearchParams();
    formData.append("content", data.content);

    setInput("");
    try {
      const res = await fetch(`http://localhost:3000/post/${postId}/comment`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const resData = await res.json();
      console.log(resData);

      if (resData.errors || resData.error) {
        console.error(resData.errors, resData.errorW);
      } else {
        console.log(resData.comment);
        updateComments({ comment: resData.comment });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.commentBox} onSubmit={handleSubmit(onSubmit)}>
      <form className={styles.commentBoxForm} method="post">
        <div className={styles.inputContainer}>
          <label
            className={styles.hidden}
            htmlFor="comment"
            aria-label="Comment to post"
          >
            Comment
          </label>
          {errors && errors.content && (
            <div className={styles.errorText}>{errors.content.message}</div>
          )}
          <input
            className={styles.commentInput}
            id="comment"
            placeholder="Write a comment"
            value={input}
            onInput={(e) => {
              const current = e.target as HTMLInputElement;
              setInput(current.value);
            }}
            ref={(e) => {
              ref(e);
              commentInputRef.current = e;
            }}
            autoComplete="off"
            {...rest}
          ></input>
        </div>
        <button
          className={styles.commentButton}
          aria-label="Reply to the post"
        ></button>
      </form>
    </div>
  );
};

export default CommentBox;
