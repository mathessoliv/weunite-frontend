import { useAuthStore } from "@/stores/useAuthStore";
import { useGetSavedOpportunities } from "@/state/useOpportunities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Calendar, MapPin, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function SavedOpportunitiesPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: savedOpportunitiesData, isLoading } = useGetSavedOpportunities(
    Number(user?.id),
    { enabled: !!user?.id && user?.role === "ATHLETE" },
  );

  // Mapear dados do backend para o formato esperado
  const savedOpportunities = (savedOpportunitiesData?.data || []).map(
    (saved: any) => ({
      id: saved.id,
      athleteId: saved.athleteId,
      savedAt: saved.savedAt,
      // Dados da oportunidade
      opportunityId: saved.opportunity.id,
      title: saved.opportunity.title,
      description: saved.opportunity.description,
      location: saved.opportunity.location,
      dateEnd: saved.opportunity.dateEnd,
      skills: saved.opportunity.skills,
      company: saved.opportunity.company,
    }),
  );

  const handleViewDetails = (savedOpp: any) => {
    navigate(`/opportunity?opportunityId=${savedOpp.opportunityId}`);
  };

  if (user?.role !== "ATHLETE") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Apenas atletas podem salvar oportunidades.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full pt-4">
      <div className="max-w-[45em] w-full px-4 py-8 pb-[5em]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Oportunidades Salvas
            </h1>
          </div>
          <p className="text-muted-foreground">
            {savedOpportunities.length} oportunidade
            {savedOpportunities.length !== 1 ? "s" : ""} salva
            {savedOpportunities.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Lista de Oportunidades */}
        {savedOpportunities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                Nenhuma oportunidade salva ainda
              </h3>
              <p className="text-muted-foreground mb-6">
                Salve oportunidades para acessá-las rapidamente depois!
              </p>
              <Button onClick={() => navigate("/opportunity")}>
                Explorar Oportunidades
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {savedOpportunities.map((savedOpp: any) => (
              <Card
                key={savedOpp.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {savedOpp.title}
                    </CardTitle>
                    <Bookmark className="h-5 w-5 text-primary fill-primary flex-shrink-0 ml-2" />
                  </div>

                  {savedOpp.company && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span className="truncate">{savedOpp.company.name}</span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Descrição */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {savedOpp.description}
                  </p>

                  {/* Informações */}
                  <div className="space-y-2">
                    {savedOpp.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{savedOpp.location}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Até {format(new Date(savedOpp.dateEnd), "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  {savedOpp.skills && savedOpp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {savedOpp.skills.slice(0, 3).map((skill: any) => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {savedOpp.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                          +{savedOpp.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleViewDetails(savedOpp)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
