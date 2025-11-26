import { Button } from "@/components/ui/button";
import { NotificationItem } from "./NotificationItem";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@/state/useNotifications";
import { useAuthStore } from "@/stores/useAuthStore";
import { CheckCheck, Loader2 } from "lucide-react";

export const NotificationList = () => {
  const userId = useAuthStore((state) => state.user?.id);

  const { data: notificationsData, isLoading } = useGetNotifications(
    Number(userId) || 0,
  );
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = notificationsData?.success
    ? notificationsData.data || []
    : [];

  const hasUnread = notifications.some((n) => !n.isRead);

  const handleMarkAllAsRead = () => {
    if (!userId) return;
    markAllAsRead({ userId: Number(userId) });
  };

  const handleMarkAsRead = (notificationId: number) => {
    markAsRead({ notificationId });
  };

  const handleDelete = (notificationId: number) => {
    deleteNotification(notificationId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {hasUnread && (
        <div className="flex items-center justify-end p-4 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8"
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck size={14} className="mr-1" />
            Marcar todas como lidas
          </Button>
        </div>
      )}

      {/* Lista de notificações com scroll invisível */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <p className="text-sm text-muted-foreground">
              Nenhuma notificação ainda
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Quando alguém interagir com você, aparecerá aqui
            </p>
          </div>
        ) : (
          <div className="group">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
