import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchExampleQueries } from '@/utils/apiService';

interface ExampleQueriesProps {
  onSelectQuery: (query: string) => void;
}

const ExampleQueries = ({ onSelectQuery }: ExampleQueriesProps) => {
  const [examples, setExamples] = useState([
    {
      title: "Sales Performance",
      query: "What were our top 3 performing products last quarter by revenue, and how did they compare to the previous quarter?",
      category: "Sales"
    },
    {
      title: "Customer Segmentation",
      query: "Which customer segment has the highest retention rate, and what are their common purchasing patterns?",
      category: "Marketing"
    },
    {
      title: "Market Trends",
      query: "How has our market share evolved over the past year compared to our top 3 competitors?",
      category: "Strategy"
    },
    {
      title: "Operational Efficiency",
      query: "Which distribution centers have the longest fulfillment times, and what factors correlate with these delays?",
      category: "Operations"
    },
    {
      title: "Financial Analysis",
      query: "What's our customer acquisition cost trend over the last 6 months broken down by marketing channel?",
      category: "Finance"
    }
  ]);

  useEffect(() => {
    const loadExampleQueries = async () => {
      try {
        const queries = await fetchExampleQueries();
        if (queries && queries.length > 0) {
          const categoryOptions = ["Sales", "Marketing", "Strategy", "Finance", "Operations"];
          
          const formattedExamples = queries.map((query, index) => ({
            title: getQueryTitle(query),
            query: query,
            category: categoryOptions[index % categoryOptions.length]
          }));
          
          setExamples(formattedExamples);
        }
      } catch (error) {
        console.error('Failed to load example queries:', error);
        // Keep the default examples
      }
    };
    
    loadExampleQueries();
  }, []);

  // Helper function to generate a title from a query
  const getQueryTitle = (query: string): string => {
    // Take the first few words of the query
    const words = query.split(' ').slice(0, 3).join(' ');
    return words.charAt(0).toUpperCase() + words.slice(1) + '...';
  };

  return (
    <Card className="mt-8" id="examples">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-insight-500" />
          Example Analytical Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example, index) => (
          <Card key={index} className="cursor-pointer transition-all hover:bg-muted/50" onClick={() => onSelectQuery(example.query)}>
            <CardContent className="p-4">
              <div className="rounded-full w-fit bg-insight-100 px-2 py-0.5 text-xs font-medium text-insight-700 mb-2">
                {example.category}
              </div>
              <h3 className="font-medium mb-1">{example.title}</h3>
              <p className="text-sm text-muted-foreground">{example.query}</p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExampleQueries;
