
import { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  exampleQueries: string[];
}

const ChatInput = ({ onSendMessage, isProcessing, exampleQueries }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleExampleClick = (query: string) => {
    onSendMessage(query);
  };

  return (
    <div className="border-t bg-white p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {exampleQueries.length > 0 && !isProcessing && (
          <div className="flex flex-wrap gap-2">
            <Sparkles className="h-5 w-5 text-insight-500" />
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(query)}
                  className="rounded-full border border-insight-200 bg-insight-50 px-4 py-1 text-sm text-insight-700 hover:bg-insight-100"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a complex question about your data..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={isProcessing}
          />
          <Button type="submit" disabled={isProcessing || !input.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
