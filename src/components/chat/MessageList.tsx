import { useEffect, useRef } from "react";
import { Message } from "@/components/chat/Message";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageType {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
  read: boolean;
  createdAt: string;
}

interface MessageListProps {
  messages: MessageType[];
  conversationId: number;
  currentUserId: number;
}

export const MessageList = ({
  messages,
  conversationId,
  currentUserId,
}: MessageListProps) => {
  // Removido o useEffect de scroll daqui pois o ChatContainer já gerencia isso
  // de forma mais inteligente (baseado apenas em novas mensagens)

  const getMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return "Hoje";
    } else if (isYesterday(date)) {
      return "Ontem";
    } else {
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  let lastDate: string | null = null;

  return (
    <div className="p-4 md:p-6 h-full">
      <div className="space-y-4 pb-4">
        {messages.map((message) => {
          const messageDate = getMessageDate(message.createdAt);
          const showDate = messageDate !== lastDate;
          lastDate = messageDate;

          return (
            <div key={message.id}>
              {showDate && (
                <div className="flex justify-center my-6">
                  <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    {messageDate}
                  </span>
                </div>
              )}
              <Message
                message={message}
                conversationId={conversationId}
                currentUserId={currentUserId}
              />
            </div>
          );
        })}
        {/* Elemento vazio para referência de scroll removido */}
      </div>
    </div>
  );
};
