import { create } from "zustand";
import type { Opportunity } from "@/@types/opportunity.types";

interface OpportunityModalState {
  isOpen: boolean;
  opportunity: Opportunity | null;
  openOpportunity: (opportunity: Opportunity) => void;
  closeOpportunity: () => void;
}

export const useOpportunityModalStore = create<OpportunityModalState>(
  (set) => ({
    isOpen: false,
    opportunity: null,
    openOpportunity: (opportunity) => set({ isOpen: true, opportunity }),
    closeOpportunity: () => set({ isOpen: false, opportunity: null }),
  }),
);
