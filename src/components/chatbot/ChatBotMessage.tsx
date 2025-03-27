import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageType } from "@/hooks/use-website-chatbot";

interface ChatBotMessageProps {
  message: MessageType;
}

export default function ChatBotMessage({ message }: ChatBotMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <Avatar className="h-8 w-8">
        {isUser ? (
          <>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/logo.svg" alt="EdumoAi" />
            <AvatarFallback>ES</AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={cn(
          "p-3 rounded-lg max-w-[80%]",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
