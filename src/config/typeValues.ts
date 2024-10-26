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

type UserProfileValue = {
  id: string;
  displayName: string;
  username: string;
  bio: null | string;
  createdAt: string;
  profileImage: {
    id: string;
    bannerUrl: null | string;
    pictureUrl: null | string;
    userId: string;
  };
  _count: {
    followedBy: number;
    following: number;
  };
};

export type { CommentValue, ReplyValue, UpdateReplyValue, UserProfileValue };
