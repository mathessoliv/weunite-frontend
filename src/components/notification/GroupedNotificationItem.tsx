import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GroupedNotification } from "@/utils/groupNotifications";
import { getInitials } from "@/utils/getInitials";
import { useNavigate } from "react-router-dom";
import { useCommentsModalStore } from "@/stores/useCommentsModalStore";
import { useGetPosts } from "@/state/usePosts";
import { useGetOpportunities } from "@/state/useOpportunities";
import { useOpportunityModalStore } from "@/stores/useOpportunityModalStore";
import {
  Heart,
  MessageCircle,
  UserPlus,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Repeat2,
  Briefcase,
} from "lucide-react";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

interface GroupedNotificationItemProps {
  notification: GroupedNotification;
  onMarkAsRead: (ids: number[]) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  showNewBadge?: boolean;
}

export const GroupedNotificationItem = ({
  notification,
  onMarkAsRead,
  isExpanded = false,
  onToggleExpand,
  showNewBadge = false,
}: GroupedNotificationItemProps) => {
  const navigate = useNavigate();
  const openComments = useCommentsModalStore((s) => s.openComments);
  const openOpportunity = useOpportunityModalStore((s) => s.openOpportunity);

  const { data: postsListData } = useGetPosts();
  const { data: opportunitiesData } = useGetOpportunities();
  const posts = postsListData?.success ? postsListData.data : [];
  const targetPost = posts?.find(
    (p: any) => Number(p.id) === Number(notification.relatedEntityId),
  );

  const handleClick = () => {
    // Marca todas as notificações do grupo como lidas
    if (!notification.isRead) {
      const ids = notification.notifications.map((n) => n.id);
      onMarkAsRead(ids);
    }

    // Navega para o contexto relevante
    switch (notification.type) {
      case "POST_LIKE":
      case "POST_COMMENT":
      case "POST_REPOST":
        if (targetPost) {
          openComments(targetPost, null);
        } else {
          navigate(`/post/${notification.relatedEntityId}`);
        }
        break;
      case "COMMENT_LIKE":
        navigate(`/post/${notification.relatedEntityId}`);
        break;
      case "NEW_FOLLOWER":
        if (notification.actors.length === 1) {
          navigate(`/profile/${notification.actors[0].username}`);
        }
        break;
      case "NEW_MESSAGE":
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

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand?.();
  };

  // Renderiza os avatares empilhados (máximo 3 visíveis)
  const visibleActors = notification.actors.slice(0, 3);

  // Nomes para exibir
  const displayNames = () => {
    if (notification.actors.length === 1) {
      return notification.actors[0].name;
    } else if (notification.actors.length === 2) {
      return `${notification.actors[0].name} e ${notification.actors[1].name}`;
    } else {
      return `${notification.actors[0].name}, ${notification.actors[1].name}`;
    }
  };

  const isPostRelated = [
    "POST_LIKE",
    "POST_COMMENT",
    "COMMENT_LIKE",
    "POST_REPOST",
  ].includes(notification.type);

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

  return (
    <div className="border-b border-border/30 last:border-0">
      <div
        onClick={handleClick}
        className={`relative flex items-center justify-between px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors group`}
      >
        <div className="flex items-center gap-3 flex-1">
          {/* Avatares empilhados */}
          <div
            className="relative shrink-0"
            style={{ width: `${36 + (visibleActors.length - 1) * 12}px` }}
          >
            <div className="relative h-11">
              {visibleActors.map((actor, index) => (
                <Avatar
                  key={actor.id}
                  className="absolute h-11 w-11 border-2 border-background"
                  style={{
                    left: `${index * 12}px`,
                    zIndex: visibleActors.length - index,
                  }}
                >
                  <AvatarImage src={actor.profileImg} alt={actor.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(actor.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              <div
                className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background ${getIconColor()} z-10`}
              >
                {getIcon()}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <div>
                <span className="font-semibold text-foreground">
                  {displayNames()}
                </span>
                {notification.actors.length > 2 && (
                  <span className="font-semibold text-foreground">
                    {" "}
                    e outras {notification.actors.length - 2}{" "}
                    {notification.actors.length - 2 === 1
                      ? "pessoa"
                      : "pessoas"}
                  </span>
                )}
              </div>
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

        {/* Lado Direito: Thumbnail do Post, Botão Expandir */}
        <div className="ml-3 flex items-center gap-2">
          {isPostRelated && targetPost?.imageUrl && (
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
              <img
                src={targetPost.imageUrl}
                alt="Post"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Botão de expandir/colapsar grupo (se tiver mais de 1) */}
          {notification.notifications.length > 1 && onToggleExpand && (
            <button
              onClick={handleToggleExpand}
              className="p-1 rounded hover:bg-muted/50 transition-colors"
              title={isExpanded ? "Recolher" : "Expandir"}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}

          {/* Indicador de não lido (Ponto Azul) */}
          {!notification.isRead && (
            <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
          )}
        </div>
      </div>

      {/* Lista expandida de notificações individuais */}
      {isExpanded && notification.notifications.length > 1 && (
        <div className="bg-muted/10 border-t border-border/30 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="px-4 py-3">
            <p className="text-xs text-muted-foreground font-medium mb-3 px-1 animate-in fade-in slide-in-from-left-2 duration-300 delay-75">
              {notification.notifications.length}{" "}
              {notification.notifications.length === 1
                ? "notificação"
                : "notificações"}
            </p>
            <div className="space-y-1">
              {notification.notifications.map((notif, index) => {
                const actor = notification.actors.find(
                  (a) => a.id === notif.actorId,
                );
                return (
                  <div
                    key={notif.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-background/80 transition-all duration-150 group/item animate-in slide-in-from-left-3 fade-in"
                    style={{
                      animationDelay: `${100 + index * 50}ms`,
                      animationDuration: "400ms",
                      animationFillMode: "backwards",
                    }}
                  >
                    <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background">
                      <AvatarImage src={actor?.profileImg} alt={actor?.name} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {actor ? getInitials(actor.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">
                        <span className="font-semibold text-foreground">
                          {actor?.name || "Usuário"}
                        </span>
                        <span className="text-foreground/75 ml-1">
                          {notif.message}
                        </span>
                      </p>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
