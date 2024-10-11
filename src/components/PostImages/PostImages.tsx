import { FC } from "react";
import styles from "./PostImages.module.css";

type imageValue = {
  id: string;
  postId: string;
  url: string;
};

interface Props {
  images: null | imageValue[];
  headerHeight: null | number;
}

const PostImages: FC<Props> = ({ images, headerHeight }) => {
  const height = headerHeight
    ? `calc(100dvh - calc(${headerHeight}px + 4rem))`
    : "100%";

  return (
    <ul className={styles.postImages} style={{ maxHeight: height }}>
      {images &&
        images.length &&
        images.map((image) => {
          return (
            <li className={styles.imageItem} key={image.id}>
              <img className={styles.image} src={image.url} alt=""></img>
            </li>
          );
        })}
    </ul>
  );
};

export default PostImages;
