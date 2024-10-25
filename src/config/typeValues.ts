type CommentValue = {
  id: string;
  createdAt: string;
  updatedAt: string;
  authorid: string;
  postId: string;
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
  userLikeStatus: boolean;
  replies?: ReplyValue[];
};

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
  userLikeStatus: boolean;
};

type UpdateReplyValue = {
  status: boolean;
  reply: ReplyValue | null;
};

export type { CommentValue, ReplyValue, UpdateReplyValue };
