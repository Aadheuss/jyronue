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

type SettingFormValues = {
  banner: FileList;
  avatar: FileList;
  displayname: string;
  bio: string;
};

export type {
  formValues,
  CreatePostFormValues,
  errorValue,
  CommentFormValue,
  SettingFormValues,
};
