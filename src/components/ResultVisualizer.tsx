
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryResult, ChartData } from "@/types";
import { AreaChart, BarChart, LineChart, PieChart } from "recharts";
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon, Table as TableIcon, Code as CodeIcon } from 'lucide-react';

interface ResultVisualizerProps {
  answer: string;
  queryResults?: QueryResult[];
  charts?: ChartData[];
  sqlQuery?: string;
}

const ResultVisualizer = ({ answer, queryResults, charts, sqlQuery }: ResultVisualizerProps) => {
  const [activeTab, setActiveTab] = useState('table');

  // Format data for visualization if needed
  const renderChart = (chart: ChartData) => {
    if (!chart?.data) return null;

    const width = 600;
    const height = 300;

    switch (chart.type) {
      case 'bar':
        return (
          <BarChart width={width} height={height} data={chart.data}>
            {/* Add relevant chart components */}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart width={width} height={height} data={chart.data}>
            {/* Add relevant chart components */}
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart width={width} height={height}>
            {/* Add relevant chart components */}
          </PieChart>
        );
      case 'area':
        return (
          <AreaChart width={width} height={height} data={chart.data}>
            {/* Add relevant chart components */}
          </AreaChart>
        );
      default:
        return null;
    }
  };

  // Logic to determine if we have results to show
  const hasResults = queryResults && queryResults.length > 0;
  const hasCharts = charts && charts.length > 0;

  if (!hasResults && !hasCharts) {
    return null;
  }

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{answer}</p>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            {hasResults && (
              <TabsTrigger value="table">
                <TableIcon className="h-4 w-4 mr-2" />
                Table
              </TabsTrigger>
            )}
            {hasCharts && charts?.map((chart, index) => (
              <TabsTrigger key={`chart-${index}`} value={`chart-${index}`}>
                {chart.type === 'bar' && <BarChartIcon className="h-4 w-4 mr-2" />}
                {chart.type === 'line' && <LineChartIcon className="h-4 w-4 mr-2" />}
                {chart.type === 'pie' && <PieChartIcon className="h-4 w-4 mr-2" />}
                {chart.type === 'area' && <AreaChartIcon className="h-4 w-4 mr-2" />}
                {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart
              </TabsTrigger>
            ))}
            {sqlQuery && (
              <TabsTrigger value="sql">
                <CodeIcon className="h-4 w-4 mr-2" />
                SQL Query
              </TabsTrigger>
            )}
          </TabsList>

          {hasResults && (
            <TabsContent value="table" className="overflow-x-auto">
              <div className="border rounded-md">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      {queryResults[0].columns.map((column, i) => (
                        <th key={i} className="px-4 py-2 text-left font-medium">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResults[0].rows.map((row, i) => (
                      <tr key={i} className="border-b">
                        {queryResults[0].columns.map((column, j) => (
                          <td key={j} className="px-4 py-2">
                            {row[column] !== null && row[column] !== undefined ? String(row[column]) : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}

          {hasCharts && charts?.map((chart, index) => (
            <TabsContent key={`chart-${index}`} value={`chart-${index}`}>
              <div className="flex justify-center p-4">
                {renderChart(chart)}
              </div>
            </TabsContent>
          ))}

          {sqlQuery && (
            <TabsContent value="sql">
              <div className="rounded-md bg-muted p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {sqlQuery}
                </pre>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultVisualizer;
