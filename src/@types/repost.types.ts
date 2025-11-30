import type { Post } from "./post.types";
import type { User } from "./user.types";

export interface Repost {
  id: string;
  createdAt: string;
  user: User;
  post: Post;
}

export interface ToggleRepost {
  userId: string;
  postId: string;
}
