export interface User {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
}

export interface Comment {
  _id: string;
  content: string;
  image?: string;
  commentCreator: User;
  post: string;
  parentComment: string | null;
  likes: string[];
  repliesCount: number;
  createdAt: string;
}

export interface Post {
  _id: string;
  id: string;
  body?: string;
  image?: string;
  privacy: "public" | "friends" | "private";
  user: User;
  createdAt: string;
  likes: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  bookmarked: boolean;
  isShare: boolean;
  sharedPost: Post | null;
  topComment: Comment | null;
}

export interface PostCardProps {
  post: Post;
  postDetails?: boolean;
 onBookmarkRemoved?:  () => void;
}

export interface PostsResponse {
  data: { posts: Post[] };
}

export interface CommentsResponse {
  data: { comments: Comment[] , replies: ReplyType[] };
 
}
export interface TopCommentProps {
  comment: Comment;
  createdAt?: string;
  postId: string;
  postDetails: boolean;
}
export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount?: number;
}
export interface CommentType {
  
  content: string;
 
  image: string;

}

export interface ReplyType {
  _id: string;
  id: string;
  content: string;
  commentCreator: CommentCreator;
  createdAt: string;
  isReply: boolean;
  likes: string[];
  likesCount: number;
  parentComment: string;
  post: string;
  image?: string;
}

export interface CommentReplyProps {
  reply: ReplyType;
}
export interface ShareComponentProps {
  postUrl?: string; 
  postTitle?: string;
  onClose?: () => void;
}
export type PostHeaderProps = {
  user: User;
  DEFAULTPHOTO: string;
  postCreatAt: string;
  formatData: (date: string) => string;
  renderOptionsMenu: () => React.ReactNode;
 
  isEditedLocally?: boolean;

};