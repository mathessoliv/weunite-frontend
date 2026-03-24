import { create } from "zustand";

interface ActiveConversationStore {
  activeConversationId: number | null;
  setActiveConversationId: (id: number | null) => void;
}

export const useActiveConversationStore = create<ActiveConversationStore>(
  (set) => ({
    activeConversationId: null,
    setActiveConversationId: (id: number | null) =>
      set({ activeConversationId: id }),
  }),
);
