
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryResult, ChartData } from "@/types";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon, Table as TableIcon, Code as CodeIcon, AlertCircle, Gauge } from 'lucide-react';

interface ResultVisualizerProps {
  answer: string;
  queryResults?: QueryResult[];
  charts?: ChartData[];
  sqlQuery?: string;
  confidence?: number;
}

const ResultVisualizer = ({ answer, queryResults, charts, sqlQuery, confidence }: ResultVisualizerProps) => {
  const [activeTab, setActiveTab] = useState('table');

  // Generate chart data from query results if not provided
  const chartData = charts || (queryResults && queryResults.length > 0 ? generateChartData(queryResults[0]) : null);

  // Format data for visualization if needed
  const renderChart = (chart: ChartData) => {
    if (!chart?.data) return null;

    const width = 600;
    const height = 300;

    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  // Logic to determine if we have results to show
  const hasResults = queryResults && queryResults.length > 0;
  const hasCharts = chartData && chartData.length > 0;

  if (!hasResults && !hasCharts) {
    return null;
  }

  // Get confidence color
  const getConfidenceColor = (conf?: number) => {
    if (!conf) return "text-gray-500";
    if (conf >= 80) return "text-green-500";
    if (conf >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <Card className="my-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Analysis Results</span>
          {confidence !== undefined && (
            <div className="flex items-center text-sm font-normal">
              <Gauge className={`h-4 w-4 mr-1 ${getConfidenceColor(confidence)}`} />
              <span className={getConfidenceColor(confidence)}>
                Confidence: {confidence}%
              </span>
            </div>
          )}
        </CardTitle>
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
            {hasCharts && chartData?.map((chart, index) => (
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

          {hasCharts && chartData?.map((chart, index) => (
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

// Helper function to generate chart data from query results
function generateChartData(queryResult: QueryResult): ChartData[] | null {
  if (!queryResult || !queryResult.rows || queryResult.rows.length === 0) {
    return null;
  }

  const columns = queryResult.columns;
  const numericColumns = columns.filter(col => {
    // Check if this column has numeric values
    return queryResult.rows.some(row => typeof row[col] === 'number');
  });

  const nonNumericColumns = columns.filter(col => !numericColumns.includes(col));

  if (numericColumns.length === 0 || nonNumericColumns.length === 0) {
    // Can't make a meaningful chart without both category and numeric data
    return null;
  }

  // Choose one category column (first non-numeric) and one numeric column (first numeric)
  const categoryColumn = nonNumericColumns[0];
  const valueColumn = numericColumns[0];

  // Determine best chart type based on data
  let chartType: 'bar' | 'line' | 'pie' | 'area' = 'bar'; // Default
  
  // If we have few categories, pie chart could work well
  if (new Set(queryResult.rows.map(row => row[categoryColumn])).size <= 8) {
    chartType = 'pie';
  }
  
  // If column names suggest time series, use line or area
  const timeKeywords = ['date', 'time', 'year', 'month', 'quarter', 'period', 'week', 'day'];
  if (timeKeywords.some(keyword => categoryColumn.toLowerCase().includes(keyword))) {
    chartType = queryResult.rows.length > 5 ? 'line' : 'area';
  }

  // Format the data for the chart
  const data = queryResult.rows.map(row => ({
    name: String(row[categoryColumn]),
    value: Number(row[valueColumn])
  }));

  return [{
    type: chartType,
    data: data
  }];
}

export default ResultVisualizer;
