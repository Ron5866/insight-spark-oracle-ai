
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import ResultVisualizer from '@/components/ResultVisualizer';
import ExampleQueries from '@/components/ExampleQueries';
import AboutSection from '@/components/AboutSection';
import { Message } from '@/types';
import { processQuery, getExampleQueries } from '@/utils/mockDataService';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<{
    answer: string;
    queryResults?: any;
    charts?: any;
    sqlQuery?: string;
  } | null>(null);
  
  const exampleQueries = getExampleQueries();

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
      // Process the query (in a real app, this would call an API endpoint)
      const response = await processQuery(content);
      
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
        sqlQuery: response.queryResults?.[0]?.sql
      });
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
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
