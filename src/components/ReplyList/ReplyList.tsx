import { FC, useState } from "react";
import styles from "./ReplyList.module.css";
import { Link } from "react-router-dom";
import { unescapeInput } from "../../utils/htmlDecoder";
import LikeButton from "../LikeButton/LikeButton";

type ReplyValue = {
  id: string;
  createdAt: string;
  updatedAt: string;
  authorid: string;
  postId: string;
  commentId: string;
  replyToId: string;
  replyTo: {
    username: string;
  };
  content: string;
  author: {
    displayName: string;
    username: string;
    profileImage: {
      pictureUrl: string;
    };
  };
  likesBox: {
    id: string;
    _count: {
      likes: number;
    };
  };
  _count: {
    replies: number;
  };
};

interface Props {
  commentId: string;
  replyCount: number;
}

const ReplyList: FC<Props> = ({ commentId, replyCount }) => {
  const [replies, setReplies] = useState<null | ReplyValue[]>(null);

  const [view, setView] = useState(false);

  const fetchReplies = async () => {
    if (replies === null) {
      try {
        const res = await fetch(
          `http://localhost:3000/comment/${commentId}/replies`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const resData = await res.json();
        console.log(resData);

        if (resData.error) {
          console.log(resData.error);
        } else {
          console.log(resData);
          setReplies(resData.replies);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateLikesBox = ({
    likesBox,
  }: {
    likesBox: {
      id: string;
      _count: {
        likes: number;
      };
    };
  }) => {
    if (replies) {
      const selectedReply = replies.find(
        (reply) => reply.likesBox.id === likesBox.id
      );
      const changedReply = { ...selectedReply, likesBox };
      const updatedreplies = replies.map((reply) => {
        return reply.id === changedReply.id ? changedReply : reply;
      }) as ReplyValue[];

      console.log(updatedreplies);
      setReplies([...updatedreplies]);
    }
  };

  return (
    <>
      {view ? (
        <>
          <ul className={styles.replies}>
            <div className={styles.replyList}>
              {replies &&
                replies.length > 0 &&
                replies.map((reply) => {
                  return (
                    <li className={styles.reply} key={reply.id}>
                      <Link to={`/profile/${reply.author.username}`}>
                        <img
                          className={styles.replyUserProfile}
                          src={reply.author.profileImage.pictureUrl}
                        ></img>
                      </Link>

                      <div className={styles.mainReply}>
                        <div className={styles.replyProfileInfo}>
                          <Link
                            to={`/profile/${reply.author.username}`}
                            className={styles.replyDisplayName}
                          >
                            {reply.author.displayName}
                          </Link>

                          <Link
                            to={`/profile/${reply.author.username}`}
                            className={styles.replyUsername}
                          >
                            {`@${reply.author.username}`}
                          </Link>
                        </div>
                        <Link
                          to={`/profile/${reply.replyTo.username}`}
                          className={styles.replyText}
                        >
                          <span
                            className={styles.replyTo}
                          >{`@${reply.replyTo.username} `}</span>
                          {unescapeInput(reply.content)}
                        </Link>
                        <div className={styles.interactionInfo}>
                          <div className={styles.interactionButtons}>
                            <LikeButton
                              id={reply.id}
                              type="reply"
                              likesBox={reply.likesBox}
                              likesBoxId={reply.likesBox.id}
                              updateLikesBox={updateLikesBox}
                              size="SMALL"
                            />
                            <button className={styles.replyButton}></button>
                          </div>
                        </div>
                        {reply.likesBox._count.likes > 0 && (
                          <p className={styles.likeCountText}>
                            <span> {reply.likesBox._count.likes}</span>{" "}
                            {reply.likesBox._count.likes < 2 ? "like" : "likes"}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
            </div>
          </ul>
          <button
            className={styles.showReplyButton}
            onClick={() => setView(false)}
          >
            Hide replies
          </button>
        </>
      ) : (
        <button
          className={styles.showReplyButton}
          onClick={() => {
            fetchReplies();
            setView(true);
          }}
        >
          view replies ({replyCount})
        </button>
      )}
    </>
  );
};

export default ReplyList;
