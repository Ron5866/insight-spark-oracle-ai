
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import HeaderWrapper from '@/components/HeaderWrapper';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import ResultVisualizer from '@/components/ResultVisualizer';
import ExampleQueries from '@/components/ExampleQueries';
import AboutSection from '@/components/AboutSection';
import { Message } from '@/types';
import { processQuery, fetchExampleQueries, fallbackToMock } from '@/utils/apiService';
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<{
    answer: string;
    queryResults?: any;
    charts?: any;
    sqlQuery?: string;
    confidence?: number;
  } | null>(null);
  
  const [exampleQueries, setExampleQueries] = useState<string[]>([]);

  useEffect(() => {
    const loadExampleQueries = async () => {
      try {
        const queries = await fetchExampleQueries();
        setExampleQueries(queries);
      } catch (error) {
        console.error('Failed to load example queries:', error);
        // Import mock queries as fallback
        const { getExampleQueries } = require('@/utils/mockDataService');
        setExampleQueries(getExampleQueries());
      }
    };
    
    loadExampleQueries();
  }, []);

  const handleSendMessage = async (content: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Process the query using our API
      const response = await processQuery(content).catch(() => fallbackToMock(content));
      
      // Add assistant message to the chat
      const assistantMessage: Message = {
        id: uuidv4(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Set the current response for visualization
      setCurrentResponse({
        answer: response.answer,
        queryResults: response.queryResults,
        charts: response.charts,
        sqlQuery: response.queryResults?.[0]?.sql,
        confidence: response.confidence
      });

      // Show confidence level if available
      if (response.confidence) {
        const confidenceLevel = 
          response.confidence >= 80 ? 'high' : 
          response.confidence >= 50 ? 'moderate' : 'low';
        
        toast({
          title: `Analysis Confidence: ${confidenceLevel}`,
          description: `The AI's confidence in this answer is ${response.confidence}%`,
          variant: response.confidence >= 70 ? "default" : "destructive"
        });
      }
    } catch (error) {
      console.error('Error processing query:', error);
      
      // Add error message to the chat
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'Sorry, there was an error processing your query. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderWrapper />
      <div className="flex flex-1 flex-col">
        <div className="container mx-auto flex flex-1 flex-col">
          <MessageList messages={messages} isProcessing={isProcessing} />
          
          {currentResponse && (
            <div className="mx-auto max-w-3xl w-full px-4">
              <ResultVisualizer 
                answer={currentResponse.answer}
                queryResults={currentResponse.queryResults}
                charts={currentResponse.charts}
                sqlQuery={currentResponse.sqlQuery}
                confidence={currentResponse.confidence}
              />
            </div>
          )}
          
          {messages.length === 0 && (
            <div className="container mx-auto px-4">
              <ExampleQueries onSelectQuery={handleSendMessage} />
              <AboutSection />
            </div>
          )}
        </div>
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isProcessing={isProcessing}
          exampleQueries={messages.length === 0 ? [] : exampleQueries.slice(0, 3)}
        />
      </div>
    </div>
  );
};

export default Index;
