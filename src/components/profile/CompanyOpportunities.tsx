import OpportunityCard from "../opportunity/OpportunityCard";
import type { Opportunity } from "@/@types/opportunity.types";
import { useGetOpportunitiesCompany } from "@/state/useOpportunities";
import { Loader2 } from "lucide-react";

interface CompanyOpportunitiesProps {
  companyId: number;
}

export default function CompanyOpportunities({
  companyId,
}: CompanyOpportunitiesProps) {
  const { data, isLoading, isError } = useGetOpportunitiesCompany(companyId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-red-500">Erro ao carregar oportunidades</p>
      </div>
    );
  }

  const opportunities = data?.data || [];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {opportunities.length > 0 ? (
        opportunities.map((opportunity: Opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))
      ) : (
        <p className="text-gray-500 mt-8">Nenhuma oportunidade encontrada</p>
      )}
    </div>
  );
}
