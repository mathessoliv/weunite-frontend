/**
 * Helper para gerenciar status de denúncias
 * Sistema de status hierárquico para moderação
 */

export type ReportStatus =
  | "PENDING" // Pendente - aguardando análise
  | "UNDER_REVIEW" // Em análise - moderador revisando
  | "RESOLVED_DISMISSED" // Resolvida - Denúncia falsa/improcedente
  | "RESOLVED_SUSPENDED" // Resolvida - Usuário suspenso
  | "RESOLVED_BANNED"; // Resolvida - Usuário banido

export interface ReportStatusInfo {
  status: ReportStatus;
  label: string;
  description: string;
  color: string;
  icon: string;
  requiresAction: boolean;
}

export const REPORT_STATUS_INFO: Record<ReportStatus, ReportStatusInfo> = {
  PENDING: {
    status: "PENDING",
    label: "Pendente",
    description: "Denúncia recebida, aguardando análise",
    color: "orange",
    icon: "⏳",
    requiresAction: true,
  },
  UNDER_REVIEW: {
    status: "UNDER_REVIEW",
    label: "Em Análise",
    description: "Moderador está revisando a denúncia",
    color: "blue",
    icon: "🔍",
    requiresAction: true,
  },
  RESOLVED_DISMISSED: {
    status: "RESOLVED_DISMISSED",
    label: "Rejeitada",
    description: "Denúncia considerada falsa ou improcedente",
    color: "gray",
    icon: "❌",
    requiresAction: false,
  },
  RESOLVED_SUSPENDED: {
    status: "RESOLVED_SUSPENDED",
    label: "Usuário Suspenso",
    description: "Usuário foi suspenso temporariamente",
    color: "red",
    icon: "🚫",
    requiresAction: false,
  },
  RESOLVED_BANNED: {
    status: "RESOLVED_BANNED",
    label: "Usuário Banido",
    description: "Usuário foi banido permanentemente da plataforma",
    color: "darkred",
    icon: "🔒",
    requiresAction: false,
  },
};

/**
 * Verifica se um status é "resolvido" (ação final foi tomada)
 */
export function isResolvedStatus(status: string): boolean {
  const normalizedStatus = status.toUpperCase();
  return normalizedStatus.startsWith("RESOLVED_");
}

/**
 * Verifica se um status requer ação do moderador
 */
export function requiresModeratorAction(status: string): boolean {
  const normalizedStatus = status.toUpperCase() as ReportStatus;
  return REPORT_STATUS_INFO[normalizedStatus]?.requiresAction || false;
}

/**
 * Retorna as opções de filtro para o dropdown de status
 */
export function getStatusFilterOptions() {
  return [
    { value: "all", label: "Todos os status" },
    { value: "pending", label: "⏳ Pendente" },
    { value: "under_review", label: "🔍 Em Análise" },
    { value: "resolved_dismissed", label: "❌ Rejeitada" },
    { value: "resolved_suspended", label: "🚫 Suspenso" },
    { value: "resolved_banned", label: "🔒 Banido" },
  ];
}

/**
 * Agrupa denúncias por status para estatísticas
 */
export function groupReportsByStatus(reports: any[]): Record<string, number> {
  const grouped: Record<string, number> = {
    pending: 0,
    under_review: 0,
    resolved_dismissed: 0,
    resolved_suspended: 0,
    resolved_banned: 0,
  };

  reports.forEach((report) => {
    const status = report.status.toLowerCase();
    if (grouped[status] !== undefined) {
      grouped[status]++;
    }
  });

  return grouped;
}
