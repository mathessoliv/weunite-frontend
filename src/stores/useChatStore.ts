import { create } from "zustand";

interface ChatStore {
  isConversationOpen: boolean;
  setIsConversationOpen: (isOpen: boolean) => void;
  pendingConversationId: number | null;
  setPendingConversationId: (conversationId: number | null) => void;
  shouldRefetchConversation: boolean;
  triggerConversationRefetch: () => void;
  clearRefetchTrigger: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isConversationOpen: false,
  setIsConversationOpen: (isOpen: boolean) =>
    set({ isConversationOpen: isOpen }),
  pendingConversationId: null,
  setPendingConversationId: (conversationId: number | null) =>
    set({ pendingConversationId: conversationId }),
  shouldRefetchConversation: false,
  triggerConversationRefetch: () => set({ shouldRefetchConversation: true }),
  clearRefetchTrigger: () => set({ shouldRefetchConversation: false }),
}));
