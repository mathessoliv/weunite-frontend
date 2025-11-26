import { useState, useEffect } from "react";
import { StatsCard } from "./StatsCard";
import { FileText, Briefcase, Users, TrendingUp } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import type { CategoryData } from "@/@types/admin.types";
import { getChartColors, calculateTrend } from "@/utils/adminUtils";
import {
  getAdminStatsRequest,
  getMonthlyDataRequest,
  getUserTypeDataRequest,
  getOpportunitiesCategoryWithSkillsRequest,
} from "@/api/services/adminService";
import { MonthlyActivityChart } from "./charts/MonthlyActivityChart";
import { UserTypeDistributionChart } from "./charts/UserTypeDistributionChart";
import { OpportunityCategoryChart } from "./charts/OpportunityCategoryChart";
import { toast } from "sonner";
import type {
  AdminStats,
  ChartDataPoint,
  UserTypeData,
} from "@/@types/admin.types";

/**
 * Visão geral do dashboard administrativo
 * Exibe cards de estatísticas e gráficos de atividade da plataforma
 */
export function DashboardOverview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const chartColors = getChartColors(isDark);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<ChartDataPoint[]>([]);
  const [userTypeData, setUserTypeData] = useState<UserTypeData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Buscar todas as estatísticas em paralelo
        const [
          statsResponse,
          monthlyResponse,
          userTypeResponse,
          categoriesResponse,
        ] = await Promise.all([
          getAdminStatsRequest(),
          getMonthlyDataRequest(),
          getUserTypeDataRequest(),
          getOpportunitiesCategoryWithSkillsRequest(),
        ]);

        if (statsResponse.success && statsResponse.data) {
          // O backend retorna os dados diretamente, não em data.stats
          setStats(statsResponse.data.stats || statsResponse.data);
        } else {
          toast.error(statsResponse.error || "Erro ao carregar estatísticas");
        }

        if (monthlyResponse.success && monthlyResponse.data) {
          setMonthlyData(monthlyResponse.data);
        } else {
          toast.error(
            monthlyResponse.error || "Erro ao carregar dados mensais",
          );
        }

        if (userTypeResponse.success && userTypeResponse.data) {
          setUserTypeData(userTypeResponse.data);
        } else {
          toast.error(
            userTypeResponse.error || "Erro ao carregar tipos de usuário",
          );
        }

        if (categoriesResponse.success && categoriesResponse.data) {
          // Transformar dados do backend para o formato esperado pelo gráfico
          const transformedCategories: CategoryData[] =
            categoriesResponse.data.map((cat: any, index: number) => ({
              category: cat.category,
              count: cat.count,
              fill: Object.values(chartColors)[index % 5] as string,
              topSkills: cat.topSkills || [],
            }));
          setCategoryData(transformedCategories);
        } else {
          toast.error(
            categoriesResponse.error || "Erro ao carregar categorias",
          );
        }
      } catch (error) {
        toast.error("Erro ao carregar dados do dashboard");
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !stats) {
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
        <MonthlyActivityChart data={monthlyData} colors={chartColors} />

        <UserTypeDistributionChart data={userTypeData} colors={chartColors} />
      </div>

      <OpportunityCategoryChart data={categoryData} />
    </div>
  );
}
