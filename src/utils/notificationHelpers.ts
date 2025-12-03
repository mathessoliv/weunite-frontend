import { isToday, isYesterday, isThisWeek } from "date-fns";

export const groupByPeriod = (notifications: any[]) => {
  const today: any[] = [];
  const yesterday: any[] = [];
  const thisWeek: any[] = [];
  const older: any[] = [];

  notifications.forEach((notification) => {
    const date = new Date(
      notification.createdAt || notification.notifications?.[0]?.createdAt,
    );

    if (isToday(date)) {
      today.push(notification);
    } else if (isYesterday(date)) {
      yesterday.push(notification);
    } else if (isThisWeek(date)) {
      thisWeek.push(notification);
    } else {
      older.push(notification);
    }
  });

  return { today, yesterday, thisWeek, older };
};

export const isNewNotification = (createdAt: string) => {
  const now = new Date();
  const notifDate = new Date(createdAt);
  const diffInMinutes = (now.getTime() - notifDate.getTime()) / (1000 * 60);
  return diffInMinutes < 5;
};
