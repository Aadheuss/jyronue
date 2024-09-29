const isInputEmpty = (e: React.FormEvent<HTMLInputElement>): boolean => {
  const element = e.target as HTMLInputElement;

  return element.value.length > 0;
};

const checkAutofilled = (
  inputRef: React.MutableRefObject<null | HTMLInputElement>,
  setIsAutofilled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const current = inputRef.current;
  if (current) {
    const autofilled = current.matches("*:-webkit-autofill");
    setIsAutofilled(autofilled);
  }
};

export { isInputEmpty, checkAutofilled };
