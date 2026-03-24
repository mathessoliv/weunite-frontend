import { create } from "zustand";
import type { Post } from "@/@types/post.types";

interface CommentsModalStore {
  isOpen: boolean;
  post: Post | null;
  // optional comment id to highlight/scroll to inside the comments list
  highlightCommentId: number | null;
  openComments: (post: Post, highlightCommentId?: number | null) => void;
  closeComments: () => void;
}

export const useCommentsModalStore = create<CommentsModalStore>((set) => ({
  isOpen: false,
  post: null,
  highlightCommentId: null,
  openComments: (post: Post, highlightCommentId: number | null = null) =>
    set({ isOpen: true, post, highlightCommentId }),
  closeComments: () =>
    set({ isOpen: false, post: null, highlightCommentId: null }),
}));
