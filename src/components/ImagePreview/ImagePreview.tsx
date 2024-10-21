import styles from "./ImagePreview.module.css";
import { FC, useLayoutEffect, useRef, useState } from "react";

interface Props {
  previews: string[];
  unselectImage: (index: number) => void;
  files: File[];
}

const ImagePreview: FC<Props> = ({ previews, files, unselectImage }) => {
  const imgRef = useRef<null | HTMLImageElement>(null);
  const [imgWidth, setImgWidth] = useState<null | number>(null);

  function updateImgHeight() {
    const current = imgRef ? imgRef.current : imgRef;
    const size = current ? current.clientWidth : null;
    setImgWidth(size);
  }

  useLayoutEffect(() => {
    window.addEventListener("resize", updateImgHeight);
    updateImgHeight();

    return () => window.removeEventListener("resize", updateImgHeight);
  }, [imgRef]);

  return (
    <ul className={styles.previewList}>
      {previews.map((preview, index) => {
        return (
          <li
            key={index}
            className={styles.imageContainer}
            onLoad={updateImgHeight}
            style={previews.length > 1 ? { height: `${imgWidth}px` } : {}}
          >
            <button
              type="button"
              className={styles.removeButton}
              aria-label={`Remove image ${index + 1}: ${files[index]?.name}`}
              onClick={() => unselectImage(index)}
            ></button>
            <img
              ref={imgRef}
              className={styles.image}
              src={preview}
              alt={`selected image ${index + 1}: ${files[index]?.name}`}
            ></img>
          </li>
        );
      })}
    </ul>
  );
};

export default ImagePreview;
