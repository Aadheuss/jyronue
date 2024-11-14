import { FC } from "react";
import styles from "./PostImages.module.css";

type imageValue = {
  id: string;
  postId: string;
  url: string;
};

interface Props {
  images: null | imageValue[];
}

const PostImages: FC<Props> = ({ images }) => {
  return (
    <ul
      className={
        images && images.length < 2
          ? styles.postImagesSingle
          : styles.postImages
      }
    >
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
