import { useState } from "react";
import {
  Check,
  FileText,
  Download,
  MoreVertical,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { ImageModal } from "@/components/chat/ImageModal";
import { AudioPlayer } from "@/components/chat/AudioPlayer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMessage, useEditMessage } from "@/state/useChat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageType {
  id: number;
  text: string;
  sender: "me" | "other";
  time: string;
  read: boolean;
}

interface MessageProps {
  message: MessageType;
  conversationId: number;
  currentUserId: number;
}

export const Message = ({
  message,
  conversationId,
  currentUserId,
}: MessageProps) => {
  const isSender = message.sender === "me";
  const [showImageModal, setShowImageModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.text);

  const { mutate: deleteMessage } = useDeleteMessage();
  const { mutate: editMessage } = useEditMessage();

  const handleDelete = (deleteForEveryone: boolean) => {
    deleteMessage({
      messageId: message.id,
      userId: currentUserId,
      deleteForEveryone,
      conversationId,
    });
  };

  const handleEdit = () => {
    if (editContent.trim() !== message.text) {
      editMessage({
        messageId: message.id,
        newContent: editContent,
        conversationId,
        userId: currentUserId,
      });
    }
    setIsEditing(false);
  };

  const isImageUrl = (text: string) => {
    return text.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  const isAudioUrl = (text: string) => {
    return text.match(/\.(mp3|wav|ogg|m4a|webm)$/i);
  };

  const isFileUrl = (text: string) => {
    return text.startsWith("/uploads/") || text.startsWith("http");
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "arquivo";
  };

  const hasImage = isFileUrl(message.text) && isImageUrl(message.text);
  const hasAudio = isFileUrl(message.text) && isAudioUrl(message.text);

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="h-8 text-sm bg-white/10 border-white/20 text-inherit placeholder:text-white/50"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") setIsEditing(false);
            }}
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-white/20"
            onClick={handleEdit}
          >
            <Check size={16} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:bg-white/20"
            onClick={() => setIsEditing(false)}
          >
            <X size={16} />
          </Button>
        </div>
      );
    }

    if (isFileUrl(message.text)) {
      const fullUrl = `http://localhost:8080${message.text}`;

      if (isImageUrl(message.text)) {
        return (
          <>
            <div className="w-[240px] md:w-[280px] h-[240px] md:h-[280px]">
              <img
                src={fullUrl}
                alt="Imagem enviada"
                className="rounded-lg w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity hover:scale-[1.02] duration-200"
                onClick={() => setShowImageModal(true)}
              />
            </div>
            {showImageModal && (
              <ImageModal
                imageUrl={fullUrl}
                onClose={() => setShowImageModal(false)}
              />
            )}
          </>
        );
      } else if (isAudioUrl(message.text)) {
        return (
          <AudioPlayer
            src={fullUrl}
            variant={isSender ? "sender" : "receiver"}
          />
        );
      } else {
        return (
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <FileText size={20} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {getFileName(message.text)}
              </p>
              <p className="text-xs opacity-70">Clique para baixar</p>
            </div>
            <Download size={16} />
          </a>
        );
      }
    }

    return (
      <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
    );
  };

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex flex-col max-w-[75%] md:max-w-[60%]`}>
        <div className="group/message relative">
          <div
            className={`${hasImage ? "p-1" : "p-2 md:p-3"} rounded-lg ${
              isSender
                ? hasAudio
                  ? "bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-br-none dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                  : "bg-primary text-primary-foreground rounded-br-none"
                : "bg-white text-zinc-900 rounded-bl-none border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800"
            }`}
          >
            {renderContent()}
          </div>

          <div
            className={`absolute top-1 ${isSender ? "left-[-32px]" : "right-[-32px]"} md:opacity-0 md:group-hover/message:opacity-100 transition-opacity`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-muted"
                >
                  <MoreVertical size={16} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isSender ? "end" : "start"}>
                {isSender && (
                  <>
                    <DropdownMenuItem onClick={() => handleDelete(true)}>
                      <Trash2 size={14} className="mr-2" />
                      Apagar mensagem
                    </DropdownMenuItem>
                    {!hasImage && !hasAudio && !isFileUrl(message.text) && (
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit2 size={14} className="mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div
          className={`flex items-center mt-1 text-xs text-muted-foreground ${
            isSender ? "justify-end" : "justify-start"
          }`}
        >
          <span>{message.time}</span>
          {isSender && (
            <span className="ml-1 flex items-center">
              <Check
                size={14}
                className={
                  message.read ? "text-blue-500" : "text-muted-foreground"
                }
              />
              <Check
                size={14}
                className={`-ml-1.5 ${message.read ? "text-blue-500" : "text-muted-foreground"}`}
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
