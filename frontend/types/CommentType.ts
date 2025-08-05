import ReplyType from './ReplyType';
import UserType from './UserType';

type CommentType = {
  replyCount: number;
  id: string;
  user: UserType;
  rating: number;
  date: string;
  variant: string;
  comment: string;
  images: string[];
  likes: number;
  replies: ReplyType[];
  liked: boolean; // New field to track if the user has liked this comment
  parentId: string;
};
export default CommentType;
