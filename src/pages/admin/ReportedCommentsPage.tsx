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
import { FileText, Flag, Heart, Search, Image, Loader2 } from "lucide-react";
import type { Report, ReportedComment } from "@/@types/admin.types";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getReportedCommentsDetailsRequest } from "@/api/services/adminService";
import { toast } from "sonner";

/**
 * Página de gerenciamento de comentários denunciados
 */
export function ReportedCommentsPage() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reportedComments, setReportedComments] = useState<ReportedComment[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReportedComments();
  }, []);

  const loadReportedComments = async () => {
    setIsLoading(true);
    const response = await getReportedCommentsDetailsRequest();

    if (response.success && response.data) {
      setReportedComments(response.data);
    } else {
      console.error(
        "Erro ao carregar comentários denunciados:",
        response.error,
      );
      toast.error(
        `Erro: ${response.error || "Não foi possível carregar os comentários denunciados"}`,
      );
    }
    setIsLoading(false);
  };

  const handleReviewComment = (reportedComment: ReportedComment) => {
    // Pegar o primeiro report para exibir no modal
    const firstReport = reportedComment.reports[0];

    if (!firstReport) return;

    const report: Report = {
      id: firstReport.id,
      entityId: Number(reportedComment.comment.id), // ID do comentário que foi denunciado
      entityType: "COMMENT" as any, // Tipo da entidade (cast as any because Report interface might not have COMMENT yet in admin.types.ts, but I added it to report.types.ts. Wait, I need to check admin.types.ts Report interface)
      reportedBy: {
        name: firstReport.reporter.name,
        username: firstReport.reporter.username,
      },
      reportedUser: {
        id: reportedComment.comment.user.id, // ID do usuário denunciado (dono do comentário)
        name: reportedComment.comment.user.name,
        username: reportedComment.comment.user.username,
      },
      reason: firstReport.reason,
      description: `Comentário denunciado por ${firstReport.reason}. Total de ${reportedComment.totalReports} denúncias.`,
      status: reportedComment.status?.toLowerCase() as any, // Usar o status do reportedComment que reflete o estado atual
      createdAt: firstReport.createdAt,
      content: reportedComment.comment.text,
      imageUrl: reportedComment.comment.imageUrl || undefined,
    };

    setSelectedReport(report);
    setIsModalOpen(true);
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

  const filteredComments = reportedComments.filter((reportedComment) => {
    const matchesSearch = searchQuery
      ? reportedComment.comment.text
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        reportedComment.comment.user.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    const statusLower = reportedComment.status?.toString().toLowerCase();
    const matchesStatus =
      statusFilter === "all"
        ? statusLower === "pending" || statusLower === "reviewed" // "Todos" mostra apenas pendentes e em análise
        : statusLower === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalReports = reportedComments.reduce(
    (acc, rc) => acc + rc.totalReports,
    0,
  );
  const pendingComments = reportedComments.filter(
    (rc) => rc.status === "pending",
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold">Comentários Denunciados</h1>
          <p className="text-muted-foreground">
            Gerencie e modere comentários reportados pelos usuários
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Comentários Denunciados
              </CardTitle>
              <Flag className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportedComments.length}
              </div>
              <p className="text-xs text-muted-foreground">Requerem atenção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingComments}</div>
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
              <Heart className="h-4 w-4 text-blue-600" />
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
            <CardTitle>Comentários Denunciados</CardTitle>
            <p className="text-sm text-muted-foreground">
              Revise e tome ações sobre comentários reportados pelos usuários
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar comentários denunciados por autor ou conteúdo..."
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
                  <SelectItem value="reviewed">Em Análise</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                  <SelectItem value="deleted">Deletado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabela de Comentários */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conteúdo</TableHead>
                    <TableHead>Denúncias</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Carregando comentários denunciados...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredComments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhum comentário denunciado no momento
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComments.map((reportedComment) => (
                      <TableRow key={reportedComment.comment.id}>
                        <TableCell className="max-w-md">
                          <div className="space-y-1 ">
                            <div className="flex items-center gap-2 ">
                              <span className="font-medium text-sm">
                                {reportedComment.comment.user.name}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {reportedComment.comment.text}
                            </p>
                            {reportedComment.comment.imageUrl && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground ">
                                <Image className="h-3 w-3" />
                                <span>Com mídia</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="bg-red-600">
                            {reportedComment.totalReports} denúncias
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              reportedComment.status === "pending"
                                ? "border-yellow-500 text-yellow-600"
                                : reportedComment.status === "reviewed"
                                  ? "border-blue-500 text-blue-600"
                                  : reportedComment.status === "resolved"
                                    ? "border-green-500 text-green-600"
                                    : reportedComment.status === "hidden"
                                      ? "border-orange-500 text-orange-600"
                                      : "border-red-500 text-red-600"
                            }
                          >
                            {reportedComment.status === "pending"
                              ? "Pendente"
                              : reportedComment.status === "reviewed"
                                ? "Em Análise"
                                : reportedComment.status === "resolved"
                                  ? "Resolvido"
                                  : reportedComment.status === "hidden"
                                    ? "Oculto"
                                    : "Deletado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getTimeAgoSimple(reportedComment.comment.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReviewComment(reportedComment)}
                          >
                            {reportedComment.status === "deleted"
                              ? "Restaurar"
                              : "Revisar"}
                          </Button>
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
          onActionComplete={loadReportedComments}
        />
      </div>
    </AdminLayout>
  );
}
