import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, FileText, Briefcase, Search } from "lucide-react";
import { ReportDetailsModal } from "./ReportDetailsModal";
import type {
  Report,
  ReportedPost,
  ReportedOpportunity,
} from "@/@types/admin.types";
import {
  getReportStatusBadge,
  getReportReasonBadge,
} from "@/utils/adminBadges";
import {
  getReportedPostsDetailsRequest,
  getReportedOpportunitiesDetailsRequest,
} from "@/api/services/adminService";
import { toast } from "sonner";

const typeLabels: Record<string, string> = {
  POST: "Post",
  OPPORTUNITY: "Oportunidade",
};

export function ReportsView() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<Report[]>([]);

  // Buscar dados da API
  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        console.log("🔍 Buscando denúncias...");

        const [postsResponse, opportunitiesResponse] = await Promise.all([
          getReportedPostsDetailsRequest(),
          getReportedOpportunitiesDetailsRequest(),
        ]);

        console.log("📊 Posts Response:", postsResponse);
        console.log("📊 Opportunities Response:", opportunitiesResponse);

        const allReports: Report[] = [];

        // Processar posts reportados
        if (postsResponse.success && postsResponse.data) {
          console.log(
            `✅ ${postsResponse.data.length} posts denunciados encontrados`,
          );
          postsResponse.data.forEach((reportedPost: ReportedPost) => {
            reportedPost.reports.forEach((report) => {
              allReports.push({
                id: report.id,
                entityId: Number(reportedPost.post.id),
                entityType: "POST",
                reportedBy: {
                  name: report.reporter.name,
                  username: report.reporter.username,
                },
                reportedUser: {
                  id: reportedPost.post.user.id,
                  name: reportedPost.post.user.name,
                  username: reportedPost.post.user.username,
                },
                reason: report.reason,
                description: "", // Backend não retorna descrição detalhada
                status: report.status.toLowerCase(),
                createdAt: report.createdAt,
                content: reportedPost.post.text,
                imageUrl: reportedPost.post.imageUrl || undefined,
              });
            });
          });
        } else {
          console.log(
            "⚠️ Nenhum post denunciado ou erro:",
            postsResponse.error,
          );
        }

        // Processar oportunidades reportadas
        if (opportunitiesResponse.success && opportunitiesResponse.data) {
          console.log(
            `✅ ${opportunitiesResponse.data.length} oportunidades denunciadas encontradas`,
          );
          opportunitiesResponse.data.forEach(
            (reportedOpportunity: ReportedOpportunity) => {
              reportedOpportunity.reports.forEach((report) => {
                allReports.push({
                  id: report.id,
                  entityId: Number(reportedOpportunity.opportunity.id),
                  entityType: "OPPORTUNITY",
                  reportedBy: {
                    name: report.reporter.name,
                    username: report.reporter.username,
                  },
                  reportedUser: {
                    id: reportedOpportunity.opportunity.company?.id,
                    name:
                      reportedOpportunity.opportunity.company?.name ||
                      "Empresa desconhecida",
                    username:
                      reportedOpportunity.opportunity.company?.username ||
                      "unknown",
                  },
                  reason: report.reason,
                  description: "",
                  status: report.status.toLowerCase(),
                  createdAt: report.createdAt,
                  content: reportedOpportunity.opportunity.description,
                });
              });
            },
          );
        } else {
          console.log(
            "⚠️ Nenhuma oportunidade denunciada ou erro:",
            opportunitiesResponse.error,
          );
        }

        // Ordenar por data (mais recentes primeiro)
        allReports.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        console.log(`📋 Total de denúncias processadas: ${allReports.length}`);
        console.log("📋 Denúncias completas:", allReports);

        setReportsData(allReports);
      } catch (error) {
        toast.error("Erro ao carregar denúncias");
        console.error("❌ Erro ao buscar denúncias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  const filteredReports = reportsData.filter((report) => {
    const matchesType =
      filterType === "all" || report.entityType === filterType;

    // Normalizar status para comparação
    const normalizedReportStatus = report.status
      .toLowerCase()
      .replace(/_/g, "_");
    const normalizedFilterStatus = filterStatus.toLowerCase();

    const matchesStatus =
      filterStatus === "all" ||
      normalizedReportStatus === normalizedFilterStatus;

    const matchesSearch =
      report.reportedUser.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.reportedBy.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  console.log(`🔍 Total denúncias no estado: ${reportsData.length}`);
  console.log(`🔍 Denúncias filtradas: ${filteredReports.length}`);
  console.log(
    `🔍 Filtro tipo: ${filterType}, status: ${filterStatus}, busca: "${searchQuery}"`,
  );

  const pendingCount = reportsData.filter(
    (r) => r.status.toLowerCase() === "pending",
  ).length;
  const underReviewCount = reportsData.filter(
    (r) =>
      r.status.toLowerCase() === "under_review" ||
      r.status.toLowerCase() === "reviewed",
  ).length;
  const resolvedCount = reportsData.filter((r) =>
    r.status.toLowerCase().startsWith("resolved_"),
  ).length;
  const suspendedCount = reportsData.filter(
    (r) => r.status.toLowerCase() === "resolved_suspended",
  ).length;
  const bannedCount = reportsData.filter(
    (r) => r.status.toLowerCase() === "resolved_banned",
  ).length;

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando denúncias...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Aguardando análise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{underReviewCount}</div>
            <p className="text-xs text-muted-foreground">Sendo revisadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolvidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">
              {suspendedCount} suspensos, {bannedCount} banidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsData.length}</div>
            <p className="text-xs text-muted-foreground">Todas denúncias</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Denúncias</CardTitle>
          <CardDescription>
            Revise e tome ações sobre denúncias recebidas
          </CardDescription>

          <div className="flex gap-4 pt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar denúncias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="POST">Posts</SelectItem>
                <SelectItem value="OPPORTUNITY">Oportunidades</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">⏳ Pendente</SelectItem>
                <SelectItem value="under_review">🔍 Em Análise</SelectItem>
                <SelectItem value="resolved_dismissed">❌ Rejeitada</SelectItem>
                <SelectItem value="resolved_suspended">🚫 Suspenso</SelectItem>
                <SelectItem value="resolved_banned">🔒 Banido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Denunciado</TableHead>
                <TableHead>Denunciado por</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[100px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-8"
                  >
                    Nenhuma denúncia encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {report.entityType === "POST" && (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        )}
                        {report.entityType === "OPPORTUNITY" && (
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{typeLabels[report.entityType]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {report.reportedUser.username && (
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${report.reportedUser.username}`}
                            />
                          )}
                          <AvatarFallback>
                            {report.reportedUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {report.reportedUser.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{report.reportedUser.username}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {report.reportedBy.username && (
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${report.reportedBy.username}`}
                            />
                          )}
                          <AvatarFallback>
                            {report.reportedBy.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{report.reportedBy.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getReportReasonBadge(report.reason)}</TableCell>
                    <TableCell>{getReportStatusBadge(report.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReportClick(report)}
                      >
                        Revisar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ReportDetailsModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        report={selectedReport}
      />
    </div>
  );
}
