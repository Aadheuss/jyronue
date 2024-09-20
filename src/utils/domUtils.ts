const isInputEmpty = (e: React.FormEvent<HTMLInputElement>): boolean => {
  const element = e.target as HTMLInputElement;

  return element.value.length > 0;
};

export { isInputEmpty };
