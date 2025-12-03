import { Button } from "@/components/ui/button";
import { NotificationItem } from "./NotificationItem";
import { GroupedNotificationItem } from "./GroupedNotificationItem";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/state/useNotifications";
import { useAuthStore } from "@/stores/useAuthStore";
import { CheckCheck, Bell, Filter, Search, X, ChevronDown } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  groupNotifications,
  type GroupedNotification,
} from "@/utils/groupNotifications";

import type { NotificationFilter } from "./NotificationPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Input } from "@/components/ui/input";
import { groupByPeriod, isNewNotification } from "@/utils/notificationHelpers";

const PeriodHeader = ({ children }: { children: string }) => (
  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 px-4 py-2.5">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      {children}
    </p>
  </div>
);

export const NotificationList = ({
  filter: externalFilter,
}: {
  filter?: NotificationFilter;
}) => {
  const userId = useAuthStore((state) => state.user?.id);
  const isMobile = useIsMobile();
  const [internalFilter, setInternalFilter] = useState<NotificationFilter>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("notificationFilter");
        return (saved as NotificationFilter) || "all";
      }
      return "all";
    },
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const parentRef = useRef<HTMLDivElement>(null);

  const activeFilter = externalFilter || internalFilter;

  const { data: notificationsData, isLoading } = useGetNotifications(
    Number(userId) || 0,
  );
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  useEffect(() => {
    if (!externalFilter && typeof window !== "undefined") {
      localStorage.setItem("notificationFilter", internalFilter);
    }
  }, [internalFilter, externalFilter]);

  const allNotifications = notificationsData?.success
    ? notificationsData.data || []
    : [];

  const filteredNotifications = useMemo(() => {
    let filtered = allNotifications;

    if (activeFilter !== "all") {
      const typeMap: Record<NotificationFilter, string[]> = {
        all: [],
        likes: ["POST_LIKE", "COMMENT_LIKE"],
        comments: ["POST_COMMENT", "COMMENT_REPLY"],
        follows: ["NEW_FOLLOWER"],
        messages: ["NEW_MESSAGE"],
      };

      const types = typeMap[activeFilter];
      filtered = filtered.filter((n) => types.includes(n.type));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.actorName?.toLowerCase().includes(query) ||
          n.message?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [allNotifications, activeFilter, searchQuery]);

  const groupedNotifications = useMemo(
    () => groupNotifications(filteredNotifications),
    [filteredNotifications],
  );

  const periodGroups = useMemo(
    () => groupByPeriod(groupedNotifications),
    [groupedNotifications],
  );

  const displayNotifications = useMemo(() => {
    const limited = groupedNotifications.slice(0, visibleCount);
    const hasMore = groupedNotifications.length > visibleCount;
    const remaining = Math.max(0, groupedNotifications.length - visibleCount);
    return { limited, hasMore, remaining };
  }, [groupedNotifications, visibleCount]);

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
    setVisibleCount((prev) => Math.min(prev + 10, groupedNotifications.length));
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const renderPeriodGroup = (
    period: "today" | "yesterday" | "thisWeek" | "older",
    notifications: GroupedNotification[],
  ) => {
    if (notifications.length === 0) return null;

    const labels = {
      today: "Hoje",
      yesterday: "Ontem",
      thisWeek: "Esta semana",
      older: "Antigas",
    };

    return (
      <div key={period}>
        <PeriodHeader>{labels[period]}</PeriodHeader>
        {notifications.map((notification) => {
          const isNew = isNewNotification(notification.createdAt);
          const isGrouped = notification.count > 1;

          if (isGrouped) {
            return (
              <GroupedNotificationItem
                key={notification.id}
                notification={notification}
                isExpanded={expandedGroups.has(String(notification.id))}
                onToggleExpand={() => toggleGroup(String(notification.id))}
                onMarkAsRead={handleMarkAsReadGroup}
                showNewBadge={isNew && !notification.isRead}
              />
            );
          }

          return (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              showNewBadge={isNew && !notification.isRead}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border/50">
        {isMobile && (
          <>
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/30">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {activeFilter === "all"
                        ? "Todas"
                        : activeFilter === "likes"
                          ? "Curtidas"
                          : activeFilter === "comments"
                            ? "Comentários"
                            : activeFilter === "follows"
                              ? "Seguidores"
                              : "Mensagens"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem onClick={() => setInternalFilter("all")}>
                    Todas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setInternalFilter("likes")}>
                    Curtidas
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setInternalFilter("comments")}
                  >
                    Comentários
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setInternalFilter("follows")}
                  >
                    Seguidores
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setInternalFilter("messages")}
                  >
                    Mensagens
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
                className="h-8 w-8 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {showSearch && (
              <div className="px-4 py-2 border-b border-border/30">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar notificações..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-8 h-9 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {hasUnread && (
          <div className="flex items-center justify-end px-4 py-2.5">
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
      </div>

      <div ref={parentRef} className="flex-1 overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {allNotifications.length === 0
                ? "Nenhuma notificação ainda"
                : "Nenhuma notificação encontrada"}
            </p>
            {(activeFilter !== "all" || searchQuery) &&
              allNotifications.length > 0 && (
                <button
                  onClick={() => {
                    setInternalFilter("all");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Limpar filtros
                </button>
              )}
          </div>
        ) : (
          <div className="space-y-0">
            {renderPeriodGroup(
              "today",
              periodGroups.today.slice(
                0,
                Math.min(visibleCount, periodGroups.today.length),
              ),
            )}

            {periodGroups.today.length < visibleCount &&
              renderPeriodGroup(
                "yesterday",
                periodGroups.yesterday.slice(
                  0,
                  Math.max(0, visibleCount - periodGroups.today.length),
                ),
              )}

            {periodGroups.today.length + periodGroups.yesterday.length <
              visibleCount &&
              renderPeriodGroup(
                "thisWeek",
                periodGroups.thisWeek.slice(
                  0,
                  Math.max(
                    0,
                    visibleCount -
                      periodGroups.today.length -
                      periodGroups.yesterday.length,
                  ),
                ),
              )}

            {periodGroups.today.length +
              periodGroups.yesterday.length +
              periodGroups.thisWeek.length <
              visibleCount &&
              renderPeriodGroup(
                "older",
                periodGroups.older.slice(
                  0,
                  Math.max(
                    0,
                    visibleCount -
                      periodGroups.today.length -
                      periodGroups.yesterday.length -
                      periodGroups.thisWeek.length,
                  ),
                ),
              )}

            {displayNotifications.hasMore && (
              <div className="p-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  className="text-xs"
                >
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Carregar mais {displayNotifications.remaining} notificações
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
