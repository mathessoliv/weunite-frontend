import { Button } from "@/components/ui/button";
import { NotificationItem } from "./NotificationItem";
import { GroupedNotificationItem } from "./GroupedNotificationItem";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/state/useNotifications";
import { useAuthStore } from "@/stores/useAuthStore";
import { CheckCheck, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import {
  groupNotifications,
  isGroupedNotification,
} from "@/utils/groupNotifications";

const INITIAL_NOTIFICATIONS_LIMIT = 10;

export const NotificationList = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const [visibleCount, setVisibleCount] = useState(INITIAL_NOTIFICATIONS_LIMIT);

  const { data: notificationsData, isLoading } = useGetNotifications(
    Number(userId) || 0,
  );
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  const allNotifications = notificationsData?.success
    ? notificationsData.data || []
    : [];

  // Agrupa notificações similares
  const groupedNotifications = useMemo(
    () => groupNotifications(allNotifications),
    [allNotifications],
  );

  const notifications = useMemo(
    () => groupedNotifications.slice(0, visibleCount),
    [groupedNotifications, visibleCount],
  );

  const hasMore = groupedNotifications.length > visibleCount;
  const hasUnread = allNotifications.some((n) => !n.isRead);

  const handleMarkAllAsRead = () => {
    if (!userId) return;
    markAllAsRead({ userId: Number(userId) });
  };

  const handleMarkAsRead = (notificationId: number) => {
    markAsRead({ notificationId });
  };

  const handleMarkAsReadGroup = (ids: number[]) => {
    ids.forEach((id) => markAsRead({ notificationId: id }));
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + INITIAL_NOTIFICATIONS_LIMIT);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {hasUnread && (
        <div className="flex items-center justify-end px-4 py-3 border-b border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 text-primary hover:text-primary"
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
          <div>
            {notifications.map((notification) =>
              isGroupedNotification(notification) ? (
                <GroupedNotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsReadGroup}
                />
              ) : (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ),
            )}
          </div>
        )}
      </div>

      {/* Botão "Ver mais" */}
      {!isLoading && hasMore && (
        <div className="p-3 border-t border-border/50 bg-background">
          <Button
            variant="ghost"
            className="w-full text-sm font-medium text-primary hover:text-primary hover:bg-primary/5"
            onClick={handleLoadMore}
          >
            Ver mais notificações
          </Button>
        </div>
      )}
    </div>
  );
};
