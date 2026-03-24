import type {
  Notification,
  GetNotifications,
  MarkNotificationAsRead,
  MarkAllNotificationsAsRead,
  NotificationCount,
} from "@/@types/notification.types";
import { instance as axios } from "../axios";
import { AxiosError } from "axios";

export const getNotificationsRequest = async (data: GetNotifications) => {
  try {
    const response = await axios.get(`/notifications/user/${data.userId}`);

    return {
      success: true,
      data: response.data as Notification[],
      message: "Notificações carregadas com sucesso!",
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error: error.response?.data?.message || "Erro ao carregar notificações",
    };
  }
};

export const getUnreadCountRequest = async (userId: number) => {
  try {
    const response = await axios.get(
      `/notifications/user/${userId}/unread-count`,
    );

    return {
      success: true,
      data: response.data as NotificationCount,
      message: "Contador de notificações carregado!",
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error: error.response?.data?.message || "Erro ao carregar contador",
    };
  }
};

export const markNotificationAsReadRequest = async (
  data: MarkNotificationAsRead,
) => {
  try {
    await axios.put(`/notifications/${data.notificationId}/read`);

    return {
      success: true,
      data: null,
      message: "Notificação marcada como lida!",
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error:
        error.response?.data?.message || "Erro ao marcar notificação como lida",
    };
  }
};

export const markAllNotificationsAsReadRequest = async (
  data: MarkAllNotificationsAsRead,
) => {
  try {
    await axios.put(`/notifications/user/${data.userId}/read-all`);

    return {
      success: true,
      data: null,
      message: "Todas as notificações marcadas como lidas!",
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error: error.response?.data?.message || "Erro ao marcar todas como lidas",
    };
  }
};

export const deleteNotificationRequest = async (notificationId: number) => {
  try {
    await axios.delete(`/notifications/${notificationId}`);

    return {
      success: true,
      data: null,
      message: "Notificação deletada com sucesso!",
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error: error.response?.data?.message || "Erro ao deletar notificação",
    };
  }
};
