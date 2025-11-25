import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GroupedNotification } from "@/utils/groupNotifications";
import { getInitials } from "@/utils/getInitials";
import { useNavigate } from "react-router-dom";
import { useCommentsModalStore } from "@/stores/useCommentsModalStore";
import { useGetPosts } from "@/state/usePosts";
import { Heart, MessageCircle, UserPlus, MessageSquare } from "lucide-react";

interface GroupedNotificationItemProps {
  notification: GroupedNotification;
  onMarkAsRead: (ids: number[]) => void;
}

export const GroupedNotificationItem = ({
  notification,
  onMarkAsRead,
}: GroupedNotificationItemProps) => {
  const navigate = useNavigate();
  const openComments = useCommentsModalStore((s) => s.openComments);

  const { data: postsListData } = useGetPosts();
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
        // Se for apenas 1 seguidor, vai pro perfil dele
        if (notification.actors.length === 1) {
          navigate(`/profile/${notification.actors[0].username}`);
        }
        // Se forem múltiplos, poderia ir para uma página de seguidores
        break;
      case "NEW_MESSAGE":
        // Para mensagens agrupadas, navega para o chat sem conversa específica
        // O usuário pode escolher qual conversa abrir
        navigate("/chat");
        break;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: false,
    locale: ptBR,
  })
    .replace("menos de um minuto", "agora")
    .replace("cerca de ", "")
    .replace(" horas", "h")
    .replace(" hora", "h")
    .replace(" minutos", "min")
    .replace(" minuto", "min")
    .replace(" dias", "d")
    .replace(" dia", "d")
    .replace(" semanas", "sem")
    .replace(" semana", "sem");

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

  const isPostRelated = ["POST_LIKE", "POST_COMMENT", "COMMENT_LIKE"].includes(
    notification.type,
  );

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
      default:
        return "bg-gray-500";
    }
  };

  return (
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

        {/* Conteúdo */}
        <div className="flex-1 min-w-0 text-sm">
          <span className="font-semibold text-foreground">
            {displayNames()}
          </span>
          {notification.actors.length > 2 && (
            <span className="font-semibold text-foreground">
              {" "}
              e outras {notification.actors.length - 2}{" "}
              {notification.actors.length - 2 === 1 ? "pessoa" : "pessoas"}
            </span>
          )}{" "}
          <span className="text-foreground/90">{notification.message}</span>
          <span className="text-muted-foreground ml-1 text-xs">{timeAgo}</span>
        </div>
      </div>

      {/* Lado Direito: Thumbnail do Post */}
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

        {/* Indicador de não lido (Ponto Azul) */}
        {!notification.isRead && (
          <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
        )}
      </div>
    </div>
  );
};
