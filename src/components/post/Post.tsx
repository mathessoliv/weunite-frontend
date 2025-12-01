import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  Repeat2,
  MessageCircle,
  Bookmark,
  EllipsisVertical,
  Trash2,
  Share,
  Edit,
  Flag,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { Post } from "@/@types/post.types";
import { getTimeAgo } from "@/hooks/useGetTimeAgo";
import { useToggleLike } from "@/state/useLikes";
import { useToggleRepost } from "@/state/useRepost";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { EditPost } from "./EditPost";
import { useDeletePost } from "@/state/usePosts";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import Comments from "./Comments/Comments";
import { getInitials } from "@/utils/getInitials";
import { useNavigate } from "react-router-dom";
import { ReportModal } from "../shared/ReportModal";
import VideoPlayer from "./VideoPlayer";
import PostImage from "./PostImage";

const actions = [{ icon: Heart }, { icon: MessageCircle }, { icon: Repeat2 }];

export default function Post({ post }: { post: Post }) {
  const initials = getInitials(post.user.name);

  const isVerticalVideo = !!(
    post.videoUrl &&
    post.videoUrl.includes("375") &&
    post.videoUrl.includes("500")
  );

  const isVerticalImage = !!(
    post.imageUrl &&
    post.imageUrl.includes("375") &&
    post.imageUrl.includes("500")
  );

  const { user } = useAuthStore();

  const toggleLike = useToggleLike();
  const toggleRepost = useToggleRepost();

  const deletePost = useDeletePost();

  const isLiked = post.likes.some((like) => like.user.id === user?.id);
  const isReposted = post.reposts?.some(
    (repost) => repost.user.id === user?.id,
  );

  const [isEditPostOpen, setIsEditPostOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleLikeClick = () => {
    if (!user?.id) return;

    toggleLike.mutate({ postId: post.id, userId: user.id, commentId: "" });
  };

  const handleRepostClick = () => {
    if (!user?.id) return;

    toggleRepost.mutate({ postId: post.id, userId: user.id });
  };

  const isOwner = post.user.id === user?.id;

  const handleEditPostOpen = () => {
    setIsEditPostOpen(true);
  };

  const handleDelete = () => {
    if (!user?.id) return;

    deletePost.mutate({
      userId: Number(user.id),
      postId: Number(post.id),
    });

    setIsDeleteDialogOpen(false);
  };

  const handleCommentsOpen = () => {
    setIsCommentsOpen(true);
  };

  const handleReportClick = () => {
    setIsReportModalOpen(true);
  };

  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isOwner) {
      navigate("/profile");
    } else {
      navigate(`/profile/${post.user.username}`);
    }
  };

  return (
    <>
      <Comments
        isOpen={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
        post={post}
      />

      <EditPost
        open={isEditPostOpen}
        onOpenChange={setIsEditPostOpen}
        post={post}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        entityType="POST"
        entityId={Number(post.id)}
        entityTitle={
          post.text.substring(0, 50) + (post.text.length > 50 ? "..." : "")
        }
      />

      <Card className="w-full max-w-[45em] bg-transparent shadow-none border-0 border-b rounded-none border-foreground/50">
        {post.repostedBy ? (
          <div className="px-6 pt-3 pb-1 flex items-center gap-3">
            <div className="flex items-center justify-end text-muted-foreground w-4">
              <Repeat2 className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.repostedBy.profileImg} />
                <AvatarFallback className="text-[10px]">
                  {getInitials(post.repostedBy.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 text-sm">
                <span
                  className="font-bold hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${post.repostedBy?.username}`);
                  }}
                >
                  {post.repostedBy.id === user?.id
                    ? "Você"
                    : post.repostedBy.name}
                </span>
                <span className="text-muted-foreground">republicou</span>
              </div>
            </div>
            {post.repostedAt && (
              <span className="text-xs text-muted-foreground">
                há {getTimeAgo(post.repostedAt)}
              </span>
            )}
          </div>
        ) : (
          isReposted && (
            <div className="px-4 pt-2 flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <Repeat2 className="h-3 w-3" />
              <span>Você repostou</span>
            </div>
          )
        )}

        <div className="relative">
          {post.repostedBy && (
            <div className="absolute left-[1.9rem] -top-3 bottom-0 w-[2px] bg-border" />
          )}

          <div
            className={`flex flex-col gap-6 ${post.repostedBy ? "pl-8" : ""}`}
          >
            <CardHeader className="flex flex-row items-center gap-2 mb-[0.5em]">
              <Avatar
                className="hover:cursor-pointer h-[2.8em] w-[2.8em]"
                onClick={handleProfileClick}
              >
                <AvatarImage src={post.user.profileImg} alt="profile image" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <CardTitle
                  className="text-base font-medium hover:cursor-pointer"
                  onClick={handleProfileClick}
                >
                  {post.user.username}
                </CardTitle>

                <CardDescription className="text-xs">
                  Publicado há {getTimeAgo(post.createdAt)}
                </CardDescription>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <EllipsisVertical className="ml-auto h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isOwner ? (
                    <>
                      <DropdownMenuItem
                        onClick={handleEditPostOpen}
                        className=" hover:cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>

                      <AlertDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="hover:cursor-pointer"
                            onSelect={(e) => {
                              e.preventDefault();
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O post será
                              permanentemente removido da plataforma.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="hover:cursor-pointer">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-red-600 hover:bg-red-700 text-zinc-100 hover:cursor-pointer"
                              disabled={deletePost.isPending}
                            >
                              {deletePost.isPending
                                ? "Deletando..."
                                : "Excluir"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <DropdownMenuSeparator />
                      <DropdownMenuItem className=" hover:cursor-pointer">
                        <Share className="mr-2 h-4 w-4" />
                        Compartilhar
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="hover:cursor-pointer">
                        <Share className="mr-2 h-4 w-4" />
                        Compartilhar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 hover:cursor-pointer"
                        onClick={handleReportClick}
                      >
                        <Flag className="mr-2 h-4 w-4" />
                        Denunciar
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardContent className="w-full mt-[-18px]">
              <div className="w-full flex flex-col gap-3">
                {/* ✅ Container de mídia com altura máxima controlada */}
                {post.videoUrl ? (
                  <div className="w-full rounded-sm overflow-hidden bg-black">
                    <VideoPlayer
                      src={post.videoUrl}
                      thumbnail={post.imageUrl || undefined}
                      isVertical={isVerticalVideo}
                    />
                  </div>
                ) : post.imageUrl ? (
                  <PostImage
                    src={post.imageUrl}
                    alt="Post media"
                    isVertical={isVerticalImage}
                  />
                ) : null}
              </div>

              <p className="">{post.text}</p>
            </CardContent>

            <CardFooter className="flex flex-col mt-[-20px]">
              <div className="flex justify-between w-full mb-3">
                <span className="text-sm text-muted-foreground">
                  {post.likes.length || 0} curtidas •{" "}
                  {post.comments.length || 0} comentários •{" "}
                  {post.reposts?.length || 0} reposts
                </span>
              </div>

              <div className="flex w-full justify-between">
                <CardAction className="flex items-center gap-3 hover:cursor-pointer">
                  {actions.map((action, index) => (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        if (action.icon === Heart) {
                          handleLikeClick();
                        } else if (action.icon === MessageCircle) {
                          handleCommentsOpen();
                        } else if (action.icon === Repeat2) {
                          handleRepostClick();
                        }
                      }}
                    >
                      <action.icon
                        className={`h-5 w-5 transition-colors  ${
                          index === 0 && isLiked
                            ? "text-red-500 fill-red-500"
                            : index === 2 && isReposted
                              ? "text-green-500"
                              : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  ))}
                </CardAction>

                <CardAction className="flex items-right gap-2 hover:cursor-pointer">
                  <div>
                    <Bookmark className="h-5 w-5 text-muted-foreground varient-ghost" />
                  </div>
                </CardAction>
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </>
  );
}
