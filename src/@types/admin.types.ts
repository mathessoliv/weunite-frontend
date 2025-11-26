/**
 * Tipos relacionados ao painel administrativo
 */

/**
 * Estatísticas do dashboard administrativo
 */
export interface AdminStats {
  totalPosts: number;
  totalOpportunities: number;
  activeUsers: number;
  engagementRate: number;
  previousMonth: {
    totalPosts: number;
    totalOpportunities: number;
    activeUsers: number;
    engagementRate: number;
  };
}

/**
 * Ponto de dados para gráficos
 */
export interface ChartDataPoint {
  month: string;
  posts: number;
  opportunities: number;
}

/**
 * Dados de categoria para gráficos
 */
export interface CategoryData {
  category: string;
  count: number;
  fill: string;
}

/**
 * Dados de tipo de usuário para gráficos
 */
export interface UserTypeData {
  name: string;
  value: number;
  [key: string]: any;
}

/**
 * Cores do tema para gráficos
 */
export interface ChartColors {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  danger: string;
}

/**
 * Props para tooltips de gráficos
 */
export interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// Tipos para gerenciamento de denúncias
export type ReportStatus =
  | "PENDING" // Pendente - aguardando análise
  | "UNDER_REVIEW" // Em análise - moderador revisando
  | "RESOLVED_DISMISSED" // Resolvida - Denúncia falsa/improcedente
  | "RESOLVED_SUSPENDED" // Resolvida - Usuário suspenso
  | "RESOLVED_BANNED"; // Resolvida - Usuário banido

export interface PostReport {
  id: string;
  reporter: {
    id: string;
    name: string;
    username: string;
    email: string;
    profileImg?: string;
  };
  type: string;
  entityId: number;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  moderationNote?: string;
}

export interface ReportedPost {
  post: {
    id: string;
    text: string;
    imageUrl: string | null;
    likes: any[];
    comments: any[];
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      profileImg?: string;
    };
  };
  reports: PostReport[];
  totalReports: number;
  status: "pending" | "hidden" | "deleted";
}

export interface ReportedOpportunity {
  opportunity: {
    id: string;
    title: string;
    description: string;
    location: string;
    dateEnd: string;
    skills: any[];
    createdAt: string;
    updatedAt: string;
    company: {
      id: string;
      name: string;
      username: string;
      email: string;
      profileImg?: string;
    };
  };
  reports: PostReport[];
  totalReports: number;
  status: "pending" | "hidden" | "deleted";
}

export interface ReportSummary {
  entityId: number;
  entityType: string;
  reportCount: number;
}

export interface ModerationAction {
  action: "hide" | "delete" | "dismiss";
  postId: string;
  reason?: string;
}

/**
 * Interface para denúncias reportadas
 */
export interface Report {
  id: string;
  entityId: number;
  entityType: "POST" | "OPPORTUNITY";
  reportedBy: {
    name: string;
    username: string;
  };
  reportedUser: {
    id?: string;
    name: string;
    username: string;
  };
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  content: string;
  imageUrl?: string;
}
