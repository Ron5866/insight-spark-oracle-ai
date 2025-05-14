
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  sql?: string;
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: any;
}

export interface InsightResponse {
  answer: string;
  queryResults?: QueryResult[];
  charts?: ChartData[];
  relatedQuestions?: string[];
}
