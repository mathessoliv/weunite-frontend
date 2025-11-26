import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Heart, MessageCircle, UserPlus, Mail, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Notification } from "@/@types/notification.types";
import { getInitials } from "@/utils/getInitials";
import { useNavigate } from "react-router-dom";
import { useCommentsModalStore } from "@/stores/useCommentsModalStore";
import { useChatStore } from "@/stores/useChatStore";
import { useGetPosts } from "@/state/usePosts";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) => {
  const navigate = useNavigate();
  const openComments = useCommentsModalStore((s) => s.openComments);
  const setPendingConversationId = useChatStore(
    (s) => s.setPendingConversationId,
  );
  const triggerConversationRefetch = useChatStore(
    (s) => s.triggerConversationRefetch,
  );

  // Busca TODOS os posts para pegar o específico
  const { data: postsListData } = useGetPosts(); // Busca todos os posts

  // Encontra o post específico na lista
  const posts = postsListData?.success ? postsListData.data : [];
  const targetPost = posts?.find(
    (p: any) => Number(p.id) === Number(notification.relatedEntityId),
  );

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "POST_LIKE":
      case "COMMENT_LIKE":
        return <Heart size={16} className="text-red-500" fill="currentColor" />;
      case "POST_COMMENT":
      case "COMMENT_REPLY":
        return <MessageCircle size={16} className="text-blue-500" />;
      case "NEW_FOLLOWER":
        return <UserPlus size={16} className="text-green-500" />;
      case "NEW_MESSAGE":
        return <Mail size={16} className="text-purple-500" />;
      default:
        return null;
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
        // Abre modal de comentários para ver o post curtido
        if (targetPost) {
          openComments(targetPost, null);
        } else {
          // Fallback: navega para o post
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
        navigate(`/profile/${notification.actorUsername}`);
        break;
      case "NEW_MESSAGE":
        // Define a conversa pendente, ativa trigger de refetch e navega para o chat
        setPendingConversationId(Number(notification.relatedEntityId));
        triggerConversationRefetch(); // ✨ Ativa trigger para refetch
        navigate("/chat");
        break;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border last:border-b-0 ${
        !notification.isRead ? "bg-primary/5" : ""
      }`}
    >
      {/* Avatar do ator */}
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage
          src={notification.actorProfileImg}
          alt={notification.actorName}
        />
        <AvatarFallback className="text-xs">
          {getInitials(notification.actorName)}
        </AvatarFallback>
      </Avatar>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          {/* Ícone do tipo de notificação */}
          <div className="shrink-0 mt-0.5">{getNotificationIcon()}</div>

          {/* Mensagem */}
          <p className="text-sm flex-1">
            <span className="font-semibold">{notification.actorName}</span>{" "}
            <span className="text-muted-foreground">
              {notification.message}
            </span>
          </p>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
      </div>

      {/* Botão de deletar */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-opacity"
        onClick={handleDelete}
      >
        <X size={16} />
      </Button>

      {/* Indicador de não lida */}
      {!notification.isRead && (
        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </div>
  );
};
