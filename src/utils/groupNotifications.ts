import type {
  Notification,
  NotificationType,
} from "@/@types/notification.types";

export interface GroupedNotification {
  id: number; // ID da primeira notificação do grupo
  type: NotificationType;
  actors: {
    id: number;
    name: string;
    username: string;
    profileImg?: string;
  }[];
  relatedEntityId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  count: number;
  notifications: Notification[]; // Notificações originais do grupo
}

// Tipos que podem ser agrupados (mesma ação no mesmo post/comentário)
const GROUPABLE_TYPES: NotificationType[] = [
  "POST_LIKE",
  "POST_COMMENT",
  "COMMENT_LIKE",
  "NEW_FOLLOWER",
  "NEW_MESSAGE",
  "POST_REPOST",
  "OPPORTUNITY_SUBSCRIPTION",
];

// Tempo máximo para agrupar notificações (24 horas)
const MAX_GROUP_TIME_MS = 24 * 60 * 60 * 1000;
// Tempo máximo para agrupar mensagens (2 horas)
const MAX_MESSAGE_GROUP_TIME_MS = 2 * 60 * 60 * 1000;

/**
 * Agrupa notificações similares seguindo a lógica do Instagram:
 * - Curtidas no mesmo post são agrupadas
 * - Comentários no mesmo post são agrupados
 * - Curtidas no mesmo comentário são agrupadas
 * - Seguidores são agrupados
 * - Mensagens são agrupadas por janela de tempo de 2 horas (diferentes remetentes)
 */
export function groupNotifications(
  notifications: Notification[],
): (Notification | GroupedNotification)[] {
  if (!notifications || notifications.length === 0) return [];

  const grouped: (Notification | GroupedNotification)[] = [];
  const processed = new Set<number>();

  for (let i = 0; i < notifications.length; i++) {
    const current = notifications[i];

    // Pula se já foi processada
    if (processed.has(current.id)) continue;

    // Se não for agrupável, adiciona normalmente
    if (!GROUPABLE_TYPES.includes(current.type)) {
      grouped.push(current);
      processed.add(current.id);
      continue;
    }

    // Procura notificações similares para agrupar
    const similar: Notification[] = [current];
    processed.add(current.id);

    for (let j = i + 1; j < notifications.length; j++) {
      const candidate = notifications[j];

      // Pula se já foi processada
      if (processed.has(candidate.id)) continue;

      // Verifica se pode agrupar
      let canGroup = false;

      if (current.type === "NEW_MESSAGE") {
        // Para mensagens, agrupa apenas por tipo e tempo de 2 horas (diferentes remetentes)
        canGroup =
          candidate.type === current.type &&
          isWithinMessageGroupTimeWindow(
            current.createdAt,
            candidate.createdAt,
          );
      } else {
        // Para outros tipos, agrupa por tipo, entidade relacionada e tempo de 24h
        canGroup =
          candidate.type === current.type &&
          candidate.relatedEntityId === current.relatedEntityId &&
          isWithinGroupTimeWindow(current.createdAt, candidate.createdAt);
      }

      if (canGroup) {
        similar.push(candidate);
        processed.add(candidate.id);
      }
    }

    // Se encontrou notificações similares, cria um grupo
    if (similar.length > 1) {
      const actors = similar.map((n) => ({
        id: n.actorId,
        name: n.actorName,
        username: n.actorUsername,
        profileImg: n.actorProfileImg,
      }));

      // Remove duplicatas de atores (mesma pessoa curtiu 2x)
      const uniqueActors = actors.filter(
        (actor, index, self) =>
          index === self.findIndex((a) => a.id === actor.id),
      );

      grouped.push({
        id: current.id,
        type: current.type,
        actors: uniqueActors,
        relatedEntityId: current.relatedEntityId,
        message: buildGroupedMessage(current.type, uniqueActors.length),
        isRead: similar.every((n) => n.isRead), // Lida apenas se TODAS foram lidas
        createdAt: current.createdAt, // Usa a data da mais recente
        count: uniqueActors.length,
        notifications: similar,
      });
    } else {
      // Notificação única, adiciona normalmente
      grouped.push(current);
    }
  }

  return grouped;
}

/**
 * Verifica se duas notificações estão dentro da janela de tempo para agrupamento
 */
function isWithinGroupTimeWindow(date1: string, date2: string): boolean {
  const time1 = new Date(date1).getTime();
  const time2 = new Date(date2).getTime();
  return Math.abs(time1 - time2) <= MAX_GROUP_TIME_MS;
}

/**
 * Verifica se duas mensagens estão dentro da janela de tempo de 2 horas para agrupamento
 */
function isWithinMessageGroupTimeWindow(date1: string, date2: string): boolean {
  const time1 = new Date(date1).getTime();
  const time2 = new Date(date2).getTime();
  return Math.abs(time1 - time2) <= MAX_MESSAGE_GROUP_TIME_MS;
}

/**
 * Constrói a mensagem agrupada baseada no tipo e quantidade
 */
function buildGroupedMessage(type: NotificationType, count: number): string {
  switch (type) {
    case "POST_LIKE":
      return count === 2
        ? "curtiram sua publicação"
        : "e outras pessoas curtiram sua publicação";
    case "POST_COMMENT":
      return count === 2
        ? "comentaram em sua publicação"
        : "e outras pessoas comentaram em sua publicação";
    case "COMMENT_LIKE":
      return count === 2
        ? "curtiram seu comentário"
        : "e outras pessoas curtiram seu comentário";
    case "NEW_FOLLOWER":
      return count === 2
        ? "começaram a seguir você"
        : "e outras pessoas começaram a seguir você";
    case "NEW_MESSAGE":
      return count === 2
        ? "enviaram mensagens para você"
        : "e outras pessoas enviaram mensagens para você";
    default:
      return "";
  }
}

/**
 * Verifica se uma notificação é agrupada
 */
export function isGroupedNotification(
  notification: Notification | GroupedNotification,
): notification is GroupedNotification {
  return "actors" in notification && Array.isArray(notification.actors);
}
