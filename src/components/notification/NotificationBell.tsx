import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NotificationList } from "@/components/notification/NotificationList";
import { useGetUnreadCount } from "@/state/useNotifications";
import { useAuthStore } from "@/stores/useAuthStore";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useState } from "react";

export const NotificationBell = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: unreadCountData } = useGetUnreadCount(Number(userId) || 0);
  const unreadCount = unreadCountData?.success
    ? unreadCountData.data?.unreadCount || 0
    : 0;

  const bellButton = (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      data-tour="notifications"
      onClick={isMobile ? () => setIsSheetOpen(true) : undefined}
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold animate-in zoom-in-50 duration-200">
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
          <span className="relative">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        </span>
      )}
    </Button>
  );

  // Mobile: Sheet em tela cheia
  if (isMobile) {
    return (
      <>
        {bellButton}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-2xl">
            <SheetHeader className="px-4 py-4 border-b">
              <SheetTitle className="text-lg font-semibold">
                Notificações
              </SheetTitle>
            </SheetHeader>
            <div className="h-[calc(90vh-4rem)] overflow-hidden">
              <NotificationList />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop: Popover normal
  return (
    <Popover>
      <PopoverTrigger asChild>{bellButton}</PopoverTrigger>
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
