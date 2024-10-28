import { FC, useLayoutEffect, useRef, useState } from "react";
import { PostGallery } from "../../config/typeValues";
import styles from "./Gallery.module.css";
import { Link } from "react-router-dom";

interface Props {
  posts: PostGallery[];
}

const Gallery: FC<Props> = ({ posts }) => {
  const [imgWidth, setImgWidth] = useState<null | number>(null);
  const imgRef = useRef<null | HTMLImageElement>(null);

  const updateImgWidth = () => {
    const current = imgRef.current;
    const size = current ? current.clientWidth : null;
    setImgWidth(size);
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", updateImgWidth);
    updateImgWidth();

    return () => {
      window.removeEventListener("resize", updateImgWidth);
    };
  }, [imgRef]);

  return (
    <ul className={styles.gallery}>
      {posts.map((post) => (
        <li
          key={post.id}
          className={styles.listItem}
          style={
            imgWidth
              ? {
                  height: `${imgWidth}px`,
                }
              : {}
          }
        >
          <Link to={`/post/${post.id}`}>
            {" "}
            <img className={styles.img} ref={imgRef} src={post.thumbnail} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Gallery;
