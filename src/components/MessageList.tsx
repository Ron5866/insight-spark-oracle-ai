
import { useRef, useEffect } from 'react';
import { Message } from "@/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Brain } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isProcessing: boolean;
}

const MessageList = ({ messages, isProcessing }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Brain className="h-16 w-16 text-insight-300" />
            <h2 className="mt-4 text-2xl font-bold text-insight-800">
              Ask me anything about your business data
            </h2>
            <p className="mt-2 text-muted-foreground">
              I can answer complex analytical questions, generate insights, and visualize trends from your database.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <Card
              key={message.id}
              className={cn(
                "px-4 py-3",
                message.role === "user" ? "bg-muted" : "bg-card border"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border",
                    message.role === "user"
                      ? "bg-background"
                      : "bg-insight-500 text-primary-foreground"
                  )}
                >
                  {message.role === "user" ? "U" : <Brain className="h-4 w-4" />}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
        {isProcessing && (
          <Card className="px-4 py-3 bg-card border">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-insight-500 text-primary-foreground">
                <Brain className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-insight-400 animate-pulse-slow"></div>
                  <div className="h-2 w-2 rounded-full bg-insight-400 animate-pulse-slow" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 rounded-full bg-insight-400 animate-pulse-slow" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </Card>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
