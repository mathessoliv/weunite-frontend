import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Calendar,
  MapPin,
  Briefcase,
  UserCheck,
  Building2,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useGetOpportunitiesCompany,
  useGetAthleteSubscriptions,
} from "@/state/useOpportunities";
import { OpportunitySubscribers } from "@/components/opportunity/OpportunitySubscribers";
import OpportunityDetailModal from "@/components/opportunity/OpportunityDetailModal";
import type { Opportunity } from "@/@types/opportunity.types";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import { useNavigate } from "react-router-dom";

export function MyOpportunities() {
  const { user } = useAuthStore();
  const { isMobile } = useBreakpoints();
  const navigate = useNavigate();
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);
  const [isSubscribersOpen, setIsSubscribersOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isCompany = user?.role === "COMPANY";
  const isAthlete = user?.role === "ATHLETE";

  // Para clubes: buscar oportunidades criadas
  const {
    data: opportunitiesResponse,
    isLoading: isLoadingCompanyOpportunities,
  } = useGetOpportunitiesCompany(Number(user?.id), {
    enabled: isCompany,
  });

  // Para atletas: buscar candidaturas
  const {
    data: subscriptionsResponse,
    isLoading: isLoadingAthleteSubscriptions,
  } = useGetAthleteSubscriptions(Number(user?.id), {
    enabled: isAthlete,
  });

  const isLoading =
    isLoadingCompanyOpportunities || isLoadingAthleteSubscriptions;

  // Para clubes: lista de oportunidades criadas
  const companyOpportunities = opportunitiesResponse?.data || [];

  // Para atletas: lista de candidaturas (extrair as oportunidades)
  const athleteSubscriptions = subscriptionsResponse?.data || [];

  // Defensive mapping: backend may return SubscriberDTO objects (with .opportunity)
  // or, in some cases, a plain Opportunity array. Normalize both cases to an
  // Opportunity[] so the UI rendering is safe and won't throw.
  const athleteOpportunities: Opportunity[] = (athleteSubscriptions || [])
    .map((sub: any) => {
      if (!sub) return null;
      // If it's a SubscriberDTO shape
      if (sub.opportunity) return sub.opportunity as Opportunity;
      // If it's already an Opportunity
      if (sub.id && sub.title) return sub as Opportunity;
      return null;
    })
    .filter(Boolean) as Opportunity[];

  const opportunities = isCompany ? companyOpportunities : athleteOpportunities;

  const handleViewSubscribers = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setIsSubscribersOpen(true);
  };

  const handleViewOpportunity = (opportunity: Opportunity) => {
    navigate(`/opportunity?opportunityId=${opportunity.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center w-full pt-4">
        <div className="max-w-[45em] w-full px-4 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex flex-col gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="flex justify-center w-full pt-4">
        <div className="max-w-[45em] w-full px-4 py-8 pb-[5em]">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {isCompany ? "Minhas Oportunidades" : "Minhas Candidaturas"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isCompany
                ? "Gerencie suas oportunidades e veja quem se inscreveu"
                : "Acompanhe as oportunidades em que você se candidatou"}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center py-16">
                {isCompany ? (
                  <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
                ) : (
                  <UserCheck className="h-16 w-16 text-muted-foreground mb-4" />
                )}
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  {isCompany
                    ? "Você ainda não criou nenhuma oportunidade"
                    : "Você ainda não se candidatou a nenhuma oportunidade"}
                </p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {isCompany
                    ? "Crie sua primeira oportunidade para começar a receber inscrições de atletas interessados"
                    : "Explore as oportunidades disponíveis e candidate-se às que mais combinam com você"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full pt-4">
      <div className="max-w-[45em] w-full px-4 py-8 pb-[5em]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isCompany ? "Minhas Oportunidades" : "Minhas Candidaturas"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isCompany
              ? "Gerencie suas oportunidades e veja quem se inscreveu"
              : "Acompanhe as oportunidades em que você se candidatou"}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {opportunities.map((opportunity: Opportunity) => {
            const subscribersCount = opportunity.subscribersCount || 0;
            // Protege parsing de data inválida
            const deadlineDate = opportunity.dateEnd
              ? new Date(opportunity.dateEnd).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "-";

            return (
              <Card
                key={opportunity.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {opportunity.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {opportunity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAthlete && opportunity.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {opportunity.company.username}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{opportunity.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span>Prazo: {deadlineDate}</span>
                  </div>

                  {opportunity.skills && opportunity.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills
                        .slice(0, 3)
                        .map((skill: { id: number; name: string }) => (
                          <Badge key={skill.id} variant="secondary">
                            {skill.name}
                          </Badge>
                        ))}
                      {opportunity.skills.length > 3 && (
                        <Badge variant="secondary">
                          +{opportunity.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t space-y-2">
                    {isCompany && (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            <span className="font-semibold text-lg">
                              {subscribersCount}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {subscribersCount === 1 ? "inscrito" : "inscritos"}
                          </span>
                        </div>

                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => handleViewSubscribers(opportunity)}
                          disabled={subscribersCount === 0}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Ver Inscritos
                        </Button>
                      </>
                    )}

                    {isAthlete && (
                      <Button
                        className="w-full"
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewOpportunity(opportunity)}
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {isCompany && (
          <Dialog open={isSubscribersOpen} onOpenChange={setIsSubscribersOpen}>
            <DialogContent className="max-w-[45em] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Atletas Inscritos</DialogTitle>
              </DialogHeader>

              {selectedOpportunity && (
                <OpportunitySubscribers
                  opportunityId={selectedOpportunity.id}
                  opportunityTitle={selectedOpportunity.title || ""}
                />
              )}
            </DialogContent>
          </Dialog>
        )}

        {isAthlete && selectedOpportunity && (
          <OpportunityDetailModal
            opportunity={selectedOpportunity}
            isOpen={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}
