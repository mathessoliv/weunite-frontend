import type { Post as PostType } from "@/@types/post.types";
import Post from "@/components/post/Post";
import PostSkeleton from "@/components/post/PostSkeleton";
import { useGetPosts } from "@/state/usePosts";
import { AdminDebugInfo } from "../admin/AdminDebugInfo";
import { useAuthStore } from "@/stores/useAuthStore";

export function FeedHome() {
  const { data, isLoading } = useGetPosts();
  const { user } = useAuthStore();
  const posts = data?.data;

  const filteredPosts = posts?.filter((post: PostType) => {
    if (post.repostedBy) {
      return post.repostedBy.id !== user?.id;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center w-full">
        <div className="max-w-[700px] w-full flex flex-col items-center">
          {Array.from({ length: 3 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!filteredPosts || filteredPosts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p className="text-muted-foreground">Nenhum post encontrado</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <AdminDebugInfo />

      <div className="max-w-[700px] w-full flex flex-col items-center">
        {filteredPosts.map((post: PostType) => (
          <Post
            key={`${post.id}-${post.repostedBy?.id || "original"}`}
            post={post}
          />
        ))}
      </div>
    </div>
  );
}
