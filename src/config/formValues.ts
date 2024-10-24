type formValues = {
  username: string;
  password: string;
};

type CreatePostFormValues = {
  caption: string;
  files: File[];
};

type errorValue = {
  field: string;
  msg: string;
};

type CommentFormValue = {
  content: string;
};

export type { formValues, CreatePostFormValues, errorValue, CommentFormValue };
