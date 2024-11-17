import { FC, useEffect, useState } from "react";
import styles from "./Gallery.module.css";

interface Props {
  amount: number;
}

const GallerySkeleton: FC<Props> = ({ amount }) => {
  const [imgSkeletonList, setImgSkeletonList] = useState<number[]>([]);

  useEffect(() => {
    const createImgSkeleton = () => {
      const images = [];
      for (let i = 0; i < amount; i++) {
        images.push(i);
      }

      setImgSkeletonList(images);
    };

    createImgSkeleton();

    return () => {
      setImgSkeletonList([]);
    };
  }, [amount]);

  return (
    <div className={styles.gallery}>
      {imgSkeletonList.map((imgSkeleton) => {
        return (
          <div key={imgSkeleton} className={styles.listItemSkeleton}></div>
        );
      })}
    </div>
  );
};

export default GallerySkeleton;
