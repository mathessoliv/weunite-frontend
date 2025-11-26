/**
 * Serviço Admin - Arquivo de compatibilidade
 *
 * Este arquivo re-exporta funções dos serviços especializados do admin:
 * - Dashboard (estatísticas e análises)
 * - Reports (denúncias e conteúdo reportado)
 * - Users (banimento e suspensão de usuários)
 * - Moderation (moderação de posts)
 *
 * Mantém compatibilidade com importações antigas enquanto organiza
 * o código seguindo padrões de separação de responsabilidades.
 *
 * @deprecated Use importações diretas dos serviços especializados
 * @example
 * // ❌ Antigo
 * import { getAdminStatsRequest } from "@/api/services/adminService";
 *
 * // ✅ Novo
 * import { getAdminStatsRequest } from "@/api/services/admin/dashboard";
 */

// Re-exportar Dashboard
export {
  getAdminStatsRequest,
  getMonthlyDataRequest,
  getUserTypeDataRequest,
} from "./admin/dashboard";

// Re-exportar Reports
export {
  getReportedPostsSummaryRequest,
  getReportedPostsDetailsRequest,
  getReportedPostDetailRequest,
  deletePostByAdminRequest,
  getReportedOpportunitiesSummaryRequest,
  getReportedOpportunitiesDetailsRequest,
  getReportedOpportunityDetailRequest,
  deleteOpportunityByAdminRequest,
  dismissReportsRequest,
  markReportsAsReviewedRequest,
  resolveReportsRequest,
} from "./admin/reports";

// Re-exportar Users
export {
  banUserRequest,
  suspendUserRequest,
  type BanUserRequest,
  type SuspendUserRequest,
} from "./admin/users";

// Re-exportar Moderation (já existe)
export {
  getReportedPostsRequest,
  hidePostRequest,
  deletePostRequest,
  dismissReportRequest,
  moderatePostRequest,
} from "./admin/moderationService";
