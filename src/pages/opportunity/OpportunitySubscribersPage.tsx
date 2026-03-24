import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpportunitySubscribers } from "@/components/opportunity/OpportunitySubscribers";
import { useGetOpportunities } from "@/state/useOpportunities";
import { useAuthStore } from "@/stores/useAuthStore";
import { getInitials } from "@/utils/getInitials";
import { getTimeAgo } from "@/hooks/useGetTimeAgo";
import type { Opportunity } from "@/@types/opportunity.types";

export function OpportunitySubscribersPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Buscar lista de oportunidades para obter os dados da oportunidade
  const { data: opportunitiesData, isLoading: isLoadingOpportunities } =
    useGetOpportunities();
  const opportunities: Opportunity[] = opportunitiesData?.data || [];
  const opportunity = opportunities.find(
    (opp) => opp.id === Number(opportunityId),
  );

  const isLoading = isLoadingOpportunities;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando candidatos...</p>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            Oportunidade não encontrada
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Verificar se o usuário é o dono da oportunidade
  const isOwner = opportunity.company?.id === user?.id;

  if (!isOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Acesso negado</p>
          <p className="text-muted-foreground mb-4">
            Você não tem permissão para visualizar os candidatos desta
            oportunidade
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const companyInitials = getInitials(opportunity.company?.username || "");
  const opportunityDate = new Date(opportunity.dateEnd).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  return (
    <div className="flex justify-center w-full pt-4">
      <div className="max-w-[45em] w-full px-4">
        {/* Botão Voltar */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Card de Detalhes da Oportunidade */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={opportunity.company?.profileImg} />
                <AvatarFallback className="bg-third/10 text-third font-semibold">
                  {companyInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {opportunity.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-3">
                  {opportunity.company?.username} • Publicado há{" "}
                  {getTimeAgo(opportunity.createdAt)}
                </p>

                {/* Informações básicas */}
                <div className="flex flex-wrap gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Até {opportunityDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      {opportunity.subscribersCount || 0}{" "}
                      {opportunity.subscribersCount === 1
                        ? "candidato"
                        : "candidatos"}
                    </span>
                  </div>
                </div>

                {/* Habilidades */}
                {opportunity.skills && opportunity.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Descrição */}
          {opportunity.description && (
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {opportunity.description}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Lista de Candidatos */}
        <OpportunitySubscribers
          opportunityId={Number(opportunityId)}
          opportunityTitle={opportunity.title}
        />
      </div>
    </div>
  );
}
