
import axios from 'axios';
import { InsightResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Get example queries from the API
export const fetchExampleQueries = async (): Promise<string[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/example-queries`);
    return response.data;
  } catch (error) {
    console.error('Error fetching example queries:', error);
    return [];
  }
};

// Process a query through the AI engine
export const processQuery = async (query: string): Promise<InsightResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, { question: query });
    return response.data;
  } catch (error) {
    console.error('Error processing query:', error);
    throw new Error('Failed to process your query. Please try again.');
  }
};

// Fallback to mock data if API is not available
export const fallbackToMock = async (query: string): Promise<InsightResponse> => {
  console.log('Falling back to mock data for query:', query);
  // Import the mock service dynamically to avoid circular dependencies
  const { processQuery: mockProcessQuery } = await import('./mockDataService');
  return mockProcessQuery(query);
};
