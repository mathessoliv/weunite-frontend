import { Badge } from "@/components/ui/badge";

/**
 * Utilitários para renderizar badges no painel administrativo
 * Centraliza a lógica de badges para evitar duplicação
 */

// Tipos de status
type UserStatus = "active" | "suspended" | "banned";
type ReportStatus =
  | "pending"
  | "under_review"
  | "resolved_dismissed"
  | "resolved_suspended"
  | "resolved_banned";

// Mapeamentos de texto
export const reportReasonMap: Record<string, string> = {
  spam: "Spam",
  harassment: "Assédio",
  inappropriate_content: "Conteúdo Inadequado",
  fake_profile: "Perfil Falso",
  fake_opportunity: "Oportunidade Falsa",
  copyright_violation: "Violação de Direitos",
  violence: "Violência",
  hate_speech: "Discurso de Ódio",
  misinformation: "Desinformação",
  scam: "Golpe",
  discrimination: "Discriminação",
  other: "Outros",
};

export const reportStatusMap: Record<ReportStatus, string> = {
  pending: "Pendente",
  under_review: "Em Análise",
  resolved_dismissed: "Rejeitada",
  resolved_suspended: "Usuário Suspenso",
  resolved_banned: "Usuário Banido",
};

export const userStatusMap: Record<UserStatus, string> = {
  active: "Ativo",
  suspended: "Suspenso",
  banned: "Banido",
};

/**
 * Renderiza badge de status de usuário
 */
export function getUserStatusBadge(status: string) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          {userStatusMap.active}
        </Badge>
      );
    case "suspended":
      return <Badge variant="destructive">{userStatusMap.suspended}</Badge>;
    case "banned":
      return <Badge variant="destructive">{userStatusMap.banned}</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

/**
 * Renderiza badge de role/tipo de usuário
 */
export function getUserRoleBadge(role: string) {
  return role === "company" ? (
    <Badge variant="outline" className="bg-blue-50 text-blue-700">
      Empresa
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-purple-50 text-purple-700">
      Atleta
    </Badge>
  );
}

/**
 * Renderiza badge de status de denúncia/report
 */
export function getReportStatusBadge(status: string) {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "pending":
      return (
        <Badge
          variant="destructive"
          className="bg-orange-600 text-white hover:bg-orange-700"
        >
          {reportStatusMap.pending}
        </Badge>
      );
    case "under_review":
    case "reviewed": // backward compatibility
      return (
        <Badge
          variant="outline"
          className="border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30"
        >
          {reportStatusMap.under_review}
        </Badge>
      );
    case "resolved_dismissed":
    case "dismissed": // backward compatibility
      return (
        <Badge
          variant="outline"
          className="border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-950/30"
        >
          {reportStatusMap.resolved_dismissed}
        </Badge>
      );
    case "resolved_suspended":
      return (
        <Badge
          variant="outline"
          className="border-red-500 text-red-700 bg-red-50 dark:bg-red-950/30"
        >
          {reportStatusMap.resolved_suspended}
        </Badge>
      );
    case "resolved_banned":
      return (
        <Badge
          variant="destructive"
          className="bg-red-700 text-white hover:bg-red-800"
        >
          {reportStatusMap.resolved_banned}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

/**
 * Renderiza badge de motivo de denúncia
 */
export function getReportReasonBadge(reason: string) {
  const reasonText = reportReasonMap[reason] || reason;
  return <Badge variant="outline">{reasonText}</Badge>;
}

/**
 * Retorna apenas o texto do motivo da denúncia (sem badge)
 */
export function getReportReasonText(reason: string): string {
  return reportReasonMap[reason] || reason;
}
