type isInputEmptyArgs = {
  e?: React.FormEvent<HTMLInputElement>;
  inputRef?: React.MutableRefObject<null | HTMLInputElement>;
};

const isInputEmpty = ({ e, inputRef }: isInputEmptyArgs): boolean => {
  let element;

  if (e) {
    element = e.target as HTMLInputElement;
  }

  if (inputRef) {
    element = inputRef.current;
  }

  if (!element) {
    return false;
  }

  return element.value.length < 1;
};

const checkAutofilled = (
  inputRef: React.MutableRefObject<null | HTMLInputElement>,
  setIsAutofilled: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  const current = inputRef.current;
  if (current) {
    const autofilled = current.matches("*:-webkit-autofill");
    setIsAutofilled(autofilled);
  }
};

const registerAutofilledInput = (
  inputRef: React.MutableRefObject<null | HTMLInputElement>
): void => {
  // Fix autofill input not registering on input
  const current = inputRef.current;
  if (current) {
    const value = current.value;
    // Only fix non empty value
    // input value causes sync problem on chrome when using useNavigate(-1)
    // focusing on the input also doesn't seem to cause the input to be detected
    // non empty input value seems to not be registered until the user starting changing the input value

    if (value) {
      current.value = value;
    }
  }
};

const isPlaceholderShown = (
  inputRef: React.MutableRefObject<null | HTMLInputElement>
): boolean => {
  const current = inputRef.current;
  let placeholderShown;

  if (current) {
    placeholderShown = current.matches("*:placeholder-shown");
  }

  return placeholderShown ? placeholderShown : false;
};

export {
  isInputEmpty,
  checkAutofilled,
  registerAutofilledInput,
  isPlaceholderShown,
};
