import { useOpportunityModalStore } from "@/stores/useOpportunityModalStore";
import OpportunityDetailModal from "@/components/opportunity/OpportunityDetailModal";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function OpportunityModalManager() {
  const isOpen = useOpportunityModalStore((s) => s.isOpen);
  const opportunity = useOpportunityModalStore((s) => s.opportunity);
  const closeOpportunity = useOpportunityModalStore((s) => s.closeOpportunity);
  const isMobile = useIsMobile();

  if (!opportunity) return null;

  return (
    <OpportunityDetailModal
      opportunity={opportunity}
      isOpen={isOpen}
      onOpenChange={closeOpportunity}
      isMobile={isMobile}
    />
  );
}
