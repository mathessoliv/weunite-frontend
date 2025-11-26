import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationList } from "@/components/notification/NotificationList";
import { useGetUnreadCount } from "@/state/useNotifications";
import { useAuthStore } from "@/stores/useAuthStore";

export const NotificationBell = () => {
  const userId = useAuthStore((state) => state.user?.id);
  // ✅ REMOVIDO: subscribeToNotifications daqui
  // Agora só o LeftSidebar faz a subscription (evita duplicação)

  const { data: unreadCountData } = useGetUnreadCount(Number(userId) || 0);
  const unreadCount = unreadCountData?.success
    ? unreadCountData.data?.unreadCount || 0
    : 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-tour="notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 md:w-96 p-0"
        align="center"
        side="bottom"
        sideOffset={8}
      >
        <NotificationList />
      </PopoverContent>
    </Popover>
  );
};
