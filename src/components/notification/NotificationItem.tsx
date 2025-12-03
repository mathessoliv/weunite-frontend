import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/@types/notification.types";
import type { GroupedNotification } from "@/utils/groupNotifications";
import { getInitials } from "@/utils/getInitials";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { useNavigate } from "react-router-dom";
import { useCommentsModalStore } from "@/stores/useCommentsModalStore";
import { useChatStore } from "@/stores/useChatStore";
import { useOpportunityModalStore } from "@/stores/useOpportunityModalStore";
import { useGetPosts } from "@/state/usePosts";
import { useGetOpportunities } from "@/state/useOpportunities";
import { useAuthStore } from "@/stores/useAuthStore";
import { useGetFollowing, useFollowAndUnfollow } from "@/state/useFollow";
import {
  Heart,
  MessageCircle,
  UserPlus,
  MessageSquare,
  Check,
  Repeat2,
  Briefcase,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface NotificationItemProps {
  notification: Notification | GroupedNotification;
  onMarkAsRead: (id: number) => void;
  showNewBadge?: boolean;
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  showNewBadge = false,
}: NotificationItemProps) => {
  const navigate = useNavigate();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const openComments = useCommentsModalStore((s) => s.openComments);
  const setPendingConversationId = useChatStore(
    (s) => s.setPendingConversationId,
  );
  const triggerConversationRefetch = useChatStore(
    (s) => s.triggerConversationRefetch,
  );
  const openOpportunity = useOpportunityModalStore((s) => s.openOpportunity);
  const currentUser = useAuthStore((state) => state.user);

  const { data: postsListData } = useGetPosts();
  const { data: opportunitiesData } = useGetOpportunities();

  const posts = postsListData?.success ? postsListData.data : [];
  const targetPost = posts?.find(
    (p: any) => Number(p.id) === Number(notification.relatedEntityId),
  );

  const actorId =
    "actorId" in notification
      ? notification.actorId
      : "actors" in notification
        ? notification.actors?.[0]?.id
        : undefined;

  const { data: followingData } = useGetFollowing(Number(currentUser?.id));
  const { mutate: followAndUnfollow } = useFollowAndUnfollow();

  const isFollowing = followingData?.data?.data?.some(
    (f: any) => Number(f.followed.id) === Number(actorId),
  );

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser || !actorId) return;

    followAndUnfollow({
      followerId: Number(currentUser.id),
      followedId: Number(actorId),
    });
  };

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    // Limita o swipe para direita (máx 100px)
    if (diff > 0 && diff <= 100) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Se swipe > 60px, marca como lida
    if (swipeOffset > 60 && !notification.isRead) {
      onMarkAsRead(notification.id);
    }
    // Reseta o offset
    setSwipeOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.innerWidth > 768) return; // Só em mobile
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || window.innerWidth > 768) return;
    const diff = e.clientX - startXRef.current;
    if (diff > 0 && diff <= 100) {
      setSwipeOffset(diff);
    }
  };

  const handleMouseUp = () => {
    if (window.innerWidth > 768) return;
    setIsDragging(false);
    if (swipeOffset > 60 && !notification.isRead) {
      onMarkAsRead(notification.id);
    }
    setSwipeOffset(0);
  };

  // Cleanup mouse events
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging, swipeOffset]);

  const handleQuickMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleClick = () => {
    // Marca como lida ao clicar
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }

    // Navega para o contexto relevante
    switch (notification.type) {
      case "POST_LIKE":
      case "POST_REPOST":
        if (targetPost) {
          openComments(targetPost, null);
        } else {
          navigate(`/post/${notification.relatedEntityId}`);
        }
        break;
      case "POST_COMMENT":
      case "COMMENT_REPLY":
        // Abre modal de comentários se o post foi encontrado na lista
        if (targetPost) {
          openComments(targetPost, null);
        } else {
          // Fallback: navega para o post
          navigate(`/post/${notification.relatedEntityId}`);
        }
        break;
      case "COMMENT_LIKE":
        // Navega para o post que contém o comentário
        navigate(`/post/${notification.relatedEntityId}`);
        break;
      case "NEW_FOLLOWER":
        const actorUsername =
          "actorUsername" in notification
            ? notification.actorUsername
            : "actors" in notification
              ? notification.actors?.[0]?.username
              : undefined;
        if (actorUsername) {
          navigate(`/profile/${actorUsername}`);
        }
        break;
      case "NEW_MESSAGE":
        // Define a conversa pendente, ativa trigger de refetch e navega para o chat
        setPendingConversationId(Number(notification.relatedEntityId));
        triggerConversationRefetch(); // ✨ Ativa trigger para refetch
        navigate("/chat");
        break;
      case "OPPORTUNITY_SUBSCRIPTION":
        const opportunities = opportunitiesData?.success
          ? opportunitiesData.data
          : [];
        const targetOpportunity = opportunities?.find(
          (o: any) => Number(o.id) === Number(notification.relatedEntityId),
        );
        if (targetOpportunity) {
          openOpportunity(targetOpportunity);
        } else {
          navigate(`/opportunity/${notification.relatedEntityId}`);
        }
        break;
    }
  };

  const timeAgo = formatTimeAgo(notification.createdAt);

  const isPostRelated = [
    "POST_LIKE",
    "POST_COMMENT",
    "COMMENT_LIKE",
    "COMMENT_REPLY",
    "POST_REPOST",
  ].includes(notification.type);
  const isFollowRelated = notification.type === "NEW_FOLLOWER";

  const getIcon = () => {
    switch (notification.type) {
      case "POST_LIKE":
      case "COMMENT_LIKE":
        return <Heart className="h-3 w-3 fill-white text-white" />;
      case "POST_COMMENT":
      case "COMMENT_REPLY":
        return <MessageCircle className="h-3 w-3 fill-white text-white" />;
      case "NEW_FOLLOWER":
        return <UserPlus className="h-3 w-3 fill-white text-white" />;
      case "NEW_MESSAGE":
        return <MessageSquare className="h-3 w-3 fill-white text-white" />;
      case "POST_REPOST":
        return <Repeat2 className="h-3 w-3 fill-white text-white" />;
      case "OPPORTUNITY_SUBSCRIPTION":
        return <Briefcase className="h-3 w-3 fill-white text-white" />;
      default:
        return null;
    }
  };

  const getIconColor = () => {
    switch (notification.type) {
      case "POST_LIKE":
      case "COMMENT_LIKE":
        return "bg-red-500";
      case "POST_COMMENT":
      case "COMMENT_REPLY":
        return "bg-blue-500";
      case "NEW_FOLLOWER":
        return "bg-purple-500";
      case "NEW_MESSAGE":
        return "bg-green-500";
      case "POST_REPOST":
        return "bg-emerald-500";
      case "OPPORTUNITY_SUBSCRIPTION":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const actorName =
    "actorName" in notification
      ? notification.actorName
      : ("actors" in notification && notification.actors?.[0]?.name) ||
        "Usuário";

  const actorProfileImg =
    "actorProfileImg" in notification
      ? notification.actorProfileImg
      : "actors" in notification
        ? notification.actors?.[0]?.profileImg
        : undefined;

  return (
    <div className="relative overflow-hidden">
      {swipeOffset > 0 && (
        <div
          className="absolute inset-0 bg-green-500/20 flex items-center px-6"
          style={{ opacity: Math.min(swipeOffset / 60, 1) }}
        >
          <Check className="h-5 w-5 text-green-500" />
        </div>
      )}

      <div
        ref={itemRef}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        className={`relative flex items-center justify-between px-4 py-3 hover:bg-muted/30 cursor-pointer transition-all group ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="relative shrink-0">
            <Avatar className="h-11 w-11">
              <AvatarImage src={actorProfileImg} alt={actorName} />
              <AvatarFallback className="text-xs">
                {getInitials(actorName)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background ${getIconColor()}`}
            >
              {getIcon()}
            </div>
          </div>

          <div className="flex-1 min-w-0 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">{actorName}</span>
              {showNewBadge && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-500 text-white animate-pulse">
                  Novo
                </span>
              )}
            </div>
            <span className="text-foreground/90">{notification.message}</span>
            <span className="text-muted-foreground ml-1 text-xs">
              {timeAgo}
            </span>
          </div>
        </div>

        {/* Lado Direito: Thumbnail, Botão Seguir ou Ações Rápidas */}
        <div className="ml-3 flex items-center gap-2">
          {/* Ações rápidas (aparecem no hover em desktop) */}
          {!isFollowRelated && (
            <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20"
                  onClick={handleQuickMarkAsRead}
                  title="Marcar como lida"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {isPostRelated && targetPost?.imageUrl && (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
              <img
                src={targetPost.imageUrl}
                alt="Post"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {isFollowRelated && (
            <Button
              variant={isFollowing ? "secondary" : "default"}
              size="sm"
              className={`h-8 px-4 text-xs font-semibold ${
                isFollowing
                  ? "bg-muted text-foreground hover:bg-muted/80"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              onClick={handleFollowClick}
            >
              {isFollowing ? "Seguindo" : "Seguir"}
            </Button>
          )}

          {/* Indicador de não lido (Ponto Azul) */}
          {!notification.isRead && (
            <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
};
