export type NotificationType =
  | "POST_LIKE"
  | "POST_COMMENT"
  | "COMMENT_LIKE"
  | "COMMENT_REPLY"
  | "NEW_FOLLOWER"
  | "NEW_MESSAGE";

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  actorId: number;
  actorName: string;
  actorUsername: string;
  actorProfileImg?: string;
  relatedEntityId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  count?: number;
}

export interface GetNotifications {
  userId: number;
}

export interface MarkNotificationAsRead {
  notificationId: number;
}

export interface MarkAllNotificationsAsRead {
  userId: number;
}

export interface NotificationCount {
  unreadCount: number;
}
