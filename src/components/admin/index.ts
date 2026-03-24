/**
 * Componentes Administrativos
 *
 * Organização por módulo:
 * - dashboard/ - Estatísticas e visão geral
 * - reports/ - Gerenciamento de denúncias
 * - moderation/ - Moderação de conteúdo
 * - users/ - Gerenciamento de usuários
 */

// Layout
export { AdminLayout } from "./AdminLayout";
export { AdminHeader } from "./AdminHeader";
export { AdminSidebar } from "./AdminSidebar";
export { AdminDebugInfo } from "./AdminDebugInfo";
export { DashboardStats } from "./DashboardStats";

// Dashboard
export { StatsCard } from "./dashboard";
export { DashboardOverview } from "./DashboardOverview";

// Reports
export {
  ReportsView,
  ReportDetailsModal,
  RecentPostsTable,
  TableReportRow,
} from "./reports";

// Moderation
export { PostReviewModal, OpportunityReviewModal } from "./moderation";

// Users
export { BanUserConfirmDialog, SuspendUserDialog } from "./users";
