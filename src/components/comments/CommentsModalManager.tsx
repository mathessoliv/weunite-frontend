import { useEffect } from "react";
import { useCommentsModalStore } from "@/stores/useCommentsModalStore";
import Comments from "@/components/post/Comments/Comments";
import { useQueryClient } from "@tanstack/react-query";
import { commentKeys } from "@/state/useComments";

export default function CommentsModalManager() {
  const isOpen = useCommentsModalStore((s) => s.isOpen);
  const post = useCommentsModalStore((s) => s.post);
  const highlightCommentId = useCommentsModalStore((s) => s.highlightCommentId);
  const closeComments = useCommentsModalStore((s) => s.closeComments);

  const queryClient = useQueryClient();

  // Invalidate comments cache when modal opens to fetch fresh data
  useEffect(() => {
    if (isOpen && post) {
      queryClient.invalidateQueries({
        queryKey: commentKeys.listByPost(Number(post.id)),
      });
    }
  }, [isOpen, post, queryClient]);

  // when a post is set and modal opened, wait a bit for Comments to render, then try to scroll
  useEffect(() => {
    if (!isOpen || !post) return;

    const id = `comment-${highlightCommentId}`;
    const listId = `comments-list-${post.id}`;

    // give time for comments to fetch and render
    const t = setTimeout(() => {
      // If a specific comment id is provided, scroll to it
      if (highlightCommentId) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-4", "ring-sky-400");
          setTimeout(() => el.classList.remove("ring-4", "ring-sky-400"), 3000);
          return;
        }
      }

      // otherwise, scroll to bottom (show newest comments)
      const list = document.getElementById(listId);
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    }, 350);

    return () => clearTimeout(t);
  }, [isOpen, post, highlightCommentId]);

  if (!post) return null;

  return <Comments isOpen={isOpen} onOpenChange={closeComments} post={post} />;
}
