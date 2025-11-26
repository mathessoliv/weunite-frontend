import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  MarkNotificationAsRead,
  MarkAllNotificationsAsRead,
} from "@/@types/notification.types";
import {
  getNotificationsRequest,
  getUnreadCountRequest,
  markNotificationAsReadRequest,
  markAllNotificationsAsReadRequest,
  deleteNotificationRequest,
} from "@/api/services/notificationService";
import { toast } from "sonner";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (userId: number) => [...notificationKeys.lists(), userId] as const,
  unreadCount: (userId: number) =>
    [...notificationKeys.all, "unread-count", userId] as const,
};

export const useGetNotifications = (userId: number) => {
  return useQuery({
    queryKey: notificationKeys.list(userId),
    queryFn: () => getNotificationsRequest({ userId }),
    staleTime: 5 * 60 * 1000, // 5 minutos - confiar no WebSocket
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false, // ❌ Desliga refetch ao focar
    refetchOnMount: "always", // ✅ Sempre busca ao montar
    retry: 2,
    enabled: !!userId,
  });
};

export const useGetUnreadCount = (userId: number) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(userId),
    queryFn: () => getUnreadCountRequest(userId),
    staleTime: 5 * 60 * 1000, // 5 minutos - confiar no WebSocket
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false, // ❌ Desliga refetch ao focar
    refetchOnMount: "always", // ✅ Sempre busca ao montar
    retry: 2,
    enabled: !!userId,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkNotificationAsRead) =>
      markNotificationAsReadRequest(data),
    onSuccess: (result) => {
      if (result.success) {
        // Invalida a lista de notificações para atualizar
        queryClient.invalidateQueries({
          queryKey: notificationKeys.lists(),
        });

        // Invalida o contador de não lidas
        queryClient.invalidateQueries({
          queryKey: notificationKeys.all,
          predicate: (query) => query.queryKey.includes("unread-count"),
        });
      }
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAllNotificationsAsRead) =>
      markAllNotificationsAsReadRequest(data),
    onSuccess: (result, variables) => {
      if (result.success) {
        toast.success(result.message || "Todas marcadas como lidas!");

        // Invalida a lista de notificações
        queryClient.invalidateQueries({
          queryKey: notificationKeys.list(variables.userId),
        });

        // Invalida o contador
        queryClient.invalidateQueries({
          queryKey: notificationKeys.unreadCount(variables.userId),
        });
      } else {
        toast.error(result.error || "Erro ao marcar como lidas");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao marcar notificações");
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      deleteNotificationRequest(notificationId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Notificação deletada!");

        // Invalida todas as listas de notificações
        queryClient.invalidateQueries({
          queryKey: notificationKeys.lists(),
        });

        // Invalida os contadores
        queryClient.invalidateQueries({
          queryKey: notificationKeys.all,
          predicate: (query) => query.queryKey.includes("unread-count"),
        });
      } else {
        toast.error(result.error || "Erro ao deletar notificação");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao deletar notificação");
    },
  });
};
