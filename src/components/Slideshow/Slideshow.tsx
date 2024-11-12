import { FC, useState } from "react";
import { Content } from "../../config/typeValues";
import styles from "./Slideshow.module.css";

interface Props {
  images: Content[];
}

const Slideshow: FC<Props> = ({ images }) => {
  const [imgOnViewIndex, setImgOnViewIndex] = useState<number>(0);

  const nextImg = () => {
    setImgOnViewIndex(imgOnViewIndex + 1);
  };

  const previousImg = () => {
    setImgOnViewIndex(imgOnViewIndex - 1);
  };

  return (
    <ul className={styles.slideshowItem}>
      {imgOnViewIndex > 0 && (
        <button
          className={styles.previousButton}
          type="button"
          onClick={previousImg}
        ></button>
      )}
      {images.map((image, index) => (
        <li
          key={image.id}
          className={index === imgOnViewIndex ? styles.list : styles.hiddenList}
        >
          <img
            className={index === imgOnViewIndex ? styles.img : styles.hiddenImg}
            src={image.url}
          />
        </li>
      ))}

      {imgOnViewIndex < images.length - 1 && (
        <button
          className={styles.nextButton}
          type="button"
          onClick={nextImg}
        ></button>
      )}
    </ul>
  );
};

export default Slideshow;
