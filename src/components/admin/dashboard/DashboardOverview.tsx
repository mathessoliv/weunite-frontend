import { FileText, Briefcase, Users, TrendingUp } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import type { CategoryData } from "@/@types/admin.types";
import { getChartColors, calculateTrend } from "@/utils/adminUtils";
import {
  useAdminStats,
  useMonthlyActivity,
  useUserTypeDistribution,
} from "@/state/useAdminDashboard";
import { StatsCard } from "../StatsCard";
import { MonthlyActivityChart } from "../charts/MonthlyActivityChart";
import { UserTypeDistributionChart } from "../charts/UserTypeDistributionChart";
import { OpportunityCategoryChart } from "../charts/OpportunityCategoryChart";

/**
 * Visão geral do dashboard administrativo
 * Exibe cards de estatísticas e gráficos de atividade da plataforma
 */
export function DashboardOverview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const chartColors = getChartColors(isDark);

  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const { data: monthlyData } = useMonthlyActivity();
  const { data: userTypeData } = useUserTypeDistribution();

  // Dados de categoria com cores aplicadas dinamicamente
  const categoryData: CategoryData[] = [
    { category: "Tecnologia", count: 189, fill: chartColors.primary },
    { category: "Marketing", count: 145, fill: chartColors.secondary },
    { category: "Design", count: 123, fill: chartColors.tertiary },
    { category: "Vendas", count: 98, fill: chartColors.quaternary },
    { category: "Outros", count: 67, fill: chartColors.danger },
  ];

  if (loadingStats || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando estatísticas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Posts"
          value={stats.totalPosts.toLocaleString()}
          trend={calculateTrend(
            stats.totalPosts,
            stats.previousMonth.totalPosts,
          )}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Oportunidades"
          value={stats.totalOpportunities.toLocaleString()}
          trend={calculateTrend(
            stats.totalOpportunities,
            stats.previousMonth.totalOpportunities,
          )}
          icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Usuários Ativos"
          value={stats.activeUsers.toLocaleString()}
          trend={calculateTrend(
            stats.activeUsers,
            stats.previousMonth.activeUsers,
          )}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Taxa de Engajamento"
          value={`${stats.engagementRate.toFixed(1)}%`}
          trend={calculateTrend(
            stats.engagementRate,
            stats.previousMonth.engagementRate,
          )}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {monthlyData && (
          <MonthlyActivityChart data={monthlyData} colors={chartColors} />
        )}

        {userTypeData && (
          <UserTypeDistributionChart data={userTypeData} colors={chartColors} />
        )}
      </div>

      <OpportunityCategoryChart data={categoryData} />
    </div>
  );
}
