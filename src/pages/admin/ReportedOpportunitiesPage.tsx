import { useState, useEffect } from "react";
import { ReportDetailsModal } from "@/components/admin/ReportDetailsModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Briefcase, Flag, MapPin, Search, Loader2 } from "lucide-react";
import type { Report, ReportedOpportunity } from "@/@types/admin.types";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  getReportedOpportunitiesDetailsRequest,
  deleteOpportunityByAdminRequest,
  dismissReportsRequest,
} from "@/api/services/adminService";
import { toast } from "sonner";

/**
 * Página de gerenciamento de oportunidades denunciadas
 */
export function ReportedOpportunitiesPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reportedOpportunities, setReportedOpportunities] = useState<
    ReportedOpportunity[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportedOpportunities();
  }, []);

  const loadReportedOpportunities = async () => {
    setIsLoading(true);
    const response = await getReportedOpportunitiesDetailsRequest();

    if (response.success && response.data) {
      setReportedOpportunities(response.data);
    } else {
      console.error(
        "Erro ao carregar oportunidades denunciadas:",
        response.error,
      );
      toast.error(
        `Erro: ${response.error || "Não foi possível carregar as oportunidades denunciadas"}`,
      );
    }
    setIsLoading(false);
  };

  const handleReviewOpportunity = (
    reportedOpportunity: ReportedOpportunity,
  ) => {
    // Pegar o primeiro report para exibir no modal
    const firstReport = reportedOpportunity.reports[0];

    if (!firstReport) return;

    const report: Report = {
      id: firstReport.id,
      entityId: Number(reportedOpportunity.opportunity.id), // ID da oportunidade que foi denunciada
      entityType: "OPPORTUNITY", // Tipo da entidade
      reportedBy: {
        name: firstReport.reporter.name,
        username: firstReport.reporter.username,
      },
      reportedUser: {
        id: reportedOpportunity.opportunity.company?.id, // ID do usuário denunciado (dono da oportunidade)
        name:
          reportedOpportunity.opportunity.company?.name ||
          "Empresa desconhecida",
        username:
          reportedOpportunity.opportunity.company?.username || "unknown",
      },
      reason: firstReport.reason,
      description: `Oportunidade denunciada por ${firstReport.reason}. Total de ${reportedOpportunity.totalReports} denúncias.`,
      status: firstReport.status.toLowerCase() as any,
      createdAt: firstReport.createdAt,
      content: reportedOpportunity.opportunity.description,
    };

    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja deletar esta oportunidade? Esta ação não pode ser desfeita.",
    );

    if (!confirmed) return;

    const response = await deleteOpportunityByAdminRequest(
      Number(opportunityId),
    );

    if (response.success) {
      toast.success(response.message || "Oportunidade deletada com sucesso!");
      loadReportedOpportunities(); // Recarrega a lista
    } else {
      toast.error(
        `Erro: ${response.error || "Não foi possível deletar a oportunidade"}`,
      );
    }
  };

  const handleDismissReports = async (opportunityId: string) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja descartar as denúncias desta oportunidade?",
    );

    if (!confirmed) return;

    const response = await dismissReportsRequest(
      Number(opportunityId),
      "OPPORTUNITY",
    );

    if (response.success) {
      toast.success(response.message || "Denúncias descartadas com sucesso!");
      loadReportedOpportunities(); // Recarrega a lista
    } else {
      toast.error(
        `Erro: ${response.error || "Não foi possível descartar as denúncias"}`,
      );
    }
  };

  const getTimeAgoSimple = (date: string) => {
    const hours = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60),
    );

    if (hours < 24) {
      return `${hours} horas atrás`;
    }

    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? "dia" : "dias"} atrás`;
  };

  const filteredOpportunities = reportedOpportunities.filter(
    (reportedOpportunity) => {
      const matchesSearch = searchQuery
        ? reportedOpportunity.opportunity.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          reportedOpportunity.opportunity.company.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          reportedOpportunity.opportunity.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      const matchesStatus =
        statusFilter === "all" || reportedOpportunity.status === statusFilter;

      return matchesSearch && matchesStatus;
    },
  );

  const totalReports = reportedOpportunities.reduce(
    (acc, ro) => acc + ro.totalReports,
    0,
  );
  const pendingOpportunities = reportedOpportunities.filter(
    (ro) => ro.status === "pending",
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold">Oportunidades Denunciadas</h1>
          <p className="text-muted-foreground">
            Gerencie e modere oportunidades reportadas pelos usuários
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Oportunidades Denunciadas
              </CardTitle>
              <Flag className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportedOpportunities.length}
              </div>
              <p className="text-xs text-muted-foreground">Requerem atenção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Briefcase className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOpportunities}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando revisão
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Denúncias
              </CardTitle>
              <MapPin className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReports}</div>
              <p className="text-xs text-muted-foreground">
                Denúncias recebidas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Gerenciamento */}
        <Card>
          <CardHeader>
            <CardTitle>Oportunidades Denunciadas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Revise e tome ações sobre oportunidades reportadas pelos usuários
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar oportunidades por título, empresa ou descrição..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="hidden">Oculto</SelectItem>
                  <SelectItem value="deleted">Deletado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabela de Oportunidades */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oportunidade</TableHead>
                    <TableHead>Denúncias</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Carregando oportunidades denunciadas...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredOpportunities.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhuma oportunidade denunciada no momento
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOpportunities.map((reportedOpportunity) => (
                      <TableRow key={reportedOpportunity.opportunity.id}>
                        <TableCell className="max-w-md">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">
                                {reportedOpportunity.opportunity.title}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Por {reportedOpportunity.opportunity.company.name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {reportedOpportunity.opportunity.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="bg-red-600">
                            {reportedOpportunity.totalReports} denúncias
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {reportedOpportunity.opportunity.location}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              reportedOpportunity.status === "pending"
                                ? "border-yellow-500 text-yellow-600"
                                : reportedOpportunity.status === "hidden"
                                  ? "border-orange-500 text-orange-600"
                                  : "border-red-500 text-red-600"
                            }
                          >
                            {reportedOpportunity.status === "pending"
                              ? "Pendente"
                              : reportedOpportunity.status === "hidden"
                                ? "Oculto"
                                : "Deletado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getTimeAgoSimple(
                            reportedOpportunity.opportunity.createdAt,
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleReviewOpportunity(reportedOpportunity)
                              }
                            >
                              Revisar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDismissReports(
                                  reportedOpportunity.opportunity.id,
                                )
                              }
                            >
                              Descartar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteOpportunity(
                                  reportedOpportunity.opportunity.id,
                                )
                              }
                            >
                              Deletar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <ReportDetailsModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          report={selectedReport}
          onActionComplete={loadReportedOpportunities}
        />
      </div>
    </AdminLayout>
  );
}
