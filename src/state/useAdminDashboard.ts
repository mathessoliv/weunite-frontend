import {
  getAdminStatsRequest,
  getMonthlyDataRequest,
  getUserTypeDataRequest,
} from "@/api/services/admin/dashboard";
import { useQuery } from "@tanstack/react-query";

/**
 * Query keys para cache de dashboard
 */
export const dashboardKeys = {
  all: ["admin-dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  monthly: () => [...dashboardKeys.all, "monthly"] as const,
  userTypes: () => [...dashboardKeys.all, "user-types"] as const,
};

/**
 * Hook para buscar estatísticas gerais do dashboard
 */
export const useAdminStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => getAdminStatsRequest(),
    select: (response) => (response.success ? response.data : null),
  });
};

/**
 * Hook para buscar dados de atividade mensal
 */
export const useMonthlyActivity = () => {
  return useQuery({
    queryKey: dashboardKeys.monthly(),
    queryFn: () => getMonthlyDataRequest(),
    select: (response) => (response.success ? response.data : []),
  });
};

/**
 * Hook para buscar distribuição de usuários por tipo
 */
export const useUserTypeDistribution = () => {
  return useQuery({
    queryKey: dashboardKeys.userTypes(),
    queryFn: () => getUserTypeDataRequest(),
    select: (response) => (response.success ? response.data : []),
  });
};
