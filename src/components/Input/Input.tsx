import { FC, useRef } from "react";
import { useFormContext } from "react-hook-form";

type InputTypes = "file";

interface Props {
  parentRef: React.MutableRefObject<null | HTMLInputElement>;
  id: string;
  name: string;
  type: InputTypes;
  accept?: string;
  validation?: {
    validate?: (value: string | FileList) => string | boolean;
  };
  onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
  styles: CSSModuleClasses;
}

const Input: FC<Props> = ({
  id,
  name,
  type,
  accept,
  parentRef,
  validation,
  onInput,
  styles,
}) => {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const { register } = useFormContext();

  const { ref, ...rest } = register(name, validation);

  return (
    <input
      className={type === "file" ? styles.fileInput : styles.input}
      ref={(e) => {
        ref(e);
        const currentRef = parentRef ? parentRef : inputRef;
        currentRef.current = e;
      }}
      type={type}
      id={id}
      accept={accept}
      onInput={onInput}
      {...rest}
    />
  );
};

export default Input;
