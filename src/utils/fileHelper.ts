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

export { convertFile };
