
import { v4 as uuidv4 } from 'uuid';
import { InsightResponse, QueryResult, ChartData } from '@/types';

// This is a mock service that simulates an API call to a backend
// In a real application, this would be replaced with actual API calls

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock database schema representation
const databaseSchema = {
  tables: [
    {
      name: 'products',
      columns: ['product_id', 'name', 'category', 'price', 'cost', 'supplier_id']
    },
    {
      name: 'customers',
      columns: ['customer_id', 'name', 'email', 'segment', 'join_date']
    },
    {
      name: 'orders',
      columns: ['order_id', 'customer_id', 'order_date', 'status', 'total_amount']
    },
    {
      name: 'order_items',
      columns: ['id', 'order_id', 'product_id', 'quantity', 'price']
    },
    {
      name: 'marketing_campaigns',
      columns: ['campaign_id', 'name', 'type', 'start_date', 'end_date', 'budget']
    },
    {
      name: 'customer_interactions',
      columns: ['interaction_id', 'customer_id', 'campaign_id', 'date', 'channel', 'action']
    }
  ]
};

// Mock data for predefined queries
const mockData: Record<string, InsightResponse> = {
  "What were our top 3 performing products last quarter by revenue, and how did they compare to the previous quarter?": {
    answer: "Our top 3 performing products by revenue last quarter were Premium Headphones ($245,300), 4K Smart TV ($198,700), and Wireless Earbuds ($156,450). Premium Headphones showed a 15% increase compared to the previous quarter, while 4K Smart TV had a modest 5% growth. Wireless Earbuds experienced the highest growth at 23% compared to the previous quarter.",
    queryResults: [
      {
        columns: ['Product', 'Last Quarter Revenue', 'Previous Quarter Revenue', 'Growth'],
        rows: [
          { 'Product': 'Premium Headphones', 'Last Quarter Revenue': '$245,300', 'Previous Quarter Revenue': '$213,300', 'Growth': '15%' },
          { 'Product': '4K Smart TV', 'Last Quarter Revenue': '$198,700', 'Previous Quarter Revenue': '$189,230', 'Growth': '5%' },
          { 'Product': 'Wireless Earbuds', 'Last Quarter Revenue': '$156,450', 'Previous Quarter Revenue': '$127,200', 'Growth': '23%' }
        ],
        sql: "SELECT p.name as Product, \n  SUM(CASE WHEN o.order_date BETWEEN '2023-04-01' AND '2023-06-30' THEN oi.price * oi.quantity ELSE 0 END) as \"Last Quarter Revenue\",\n  SUM(CASE WHEN o.order_date BETWEEN '2023-01-01' AND '2023-03-31' THEN oi.price * oi.quantity ELSE 0 END) as \"Previous Quarter Revenue\"\nFROM products p\nJOIN order_items oi ON p.product_id = oi.product_id\nJOIN orders o ON oi.order_id = o.order_id\nWHERE o.order_date BETWEEN '2023-01-01' AND '2023-06-30'\nGROUP BY p.name\nORDER BY \"Last Quarter Revenue\" DESC\nLIMIT 3;"
      }
    ],
    charts: [
      {
        type: 'bar',
        data: [
          { name: 'Premium Headphones', LastQuarter: 245300, PreviousQuarter: 213300 },
          { name: '4K Smart TV', LastQuarter: 198700, PreviousQuarter: 189230 },
          { name: 'Wireless Earbuds', LastQuarter: 156450, PreviousQuarter: 127200 }
        ]
      }
    ]
  },
  
  "Which customer segment has the highest retention rate, and what are their common purchasing patterns?": {
    answer: "The Enterprise segment has the highest retention rate at 87%, followed by SMB at 72% and Individual at 58%. Enterprise customers typically make large quarterly purchases concentrated in technology and office equipment categories, with an average order value of $12,500. They tend to respond well to direct sales channels and have a 45% higher repeat purchase rate compared to other segments.",
    queryResults: [
      {
        columns: ['Segment', 'Retention Rate', 'Avg Order Value', 'Most Common Categories', 'Purchase Frequency'],
        rows: [
          { 'Segment': 'Enterprise', 'Retention Rate': '87%', 'Avg Order Value': '$12,500', 'Most Common Categories': 'Technology, Office Equipment', 'Purchase Frequency': 'Quarterly' },
          { 'Segment': 'SMB', 'Retention Rate': '72%', 'Avg Order Value': '$5,200', 'Most Common Categories': 'Software, Office Supplies', 'Purchase Frequency': 'Bi-monthly' },
          { 'Segment': 'Individual', 'Retention Rate': '58%', 'Avg Order Value': '$780', 'Most Common Categories': 'Electronics, Accessories', 'Purchase Frequency': 'Monthly' }
        ],
        sql: "WITH CustomerRetention AS (\n  SELECT \n    c.segment,\n    COUNT(DISTINCT c.customer_id) AS total_customers,\n    COUNT(DISTINCT CASE WHEN o2.order_date > o1.order_date + INTERVAL '90 days' THEN c.customer_id END) AS retained_customers\n  FROM customers c\n  JOIN orders o1 ON c.customer_id = o1.customer_id\n  LEFT JOIN orders o2 ON c.customer_id = o2.customer_id\n  GROUP BY c.segment\n)\nSELECT\n  segment,\n  ROUND((retained_customers::NUMERIC / NULLIF(total_customers, 0)) * 100, 2) AS retention_rate\nFROM CustomerRetention\nORDER BY retention_rate DESC;"
      }
    ],
    charts: [
      {
        type: 'bar',
        data: [
          { name: 'Enterprise', RetentionRate: 87 },
          { name: 'SMB', RetentionRate: 72 },
          { name: 'Individual', RetentionRate: 58 }
        ]
      },
      {
        type: 'pie',
        data: [
          { name: 'Technology', value: 45 },
          { name: 'Office Equipment', value: 30 },
          { name: 'Software', value: 15 },
          { name: 'Others', value: 10 }
        ]
      }
    ]
  },
  
  "How has our market share evolved over the past year compared to our top 3 competitors?": {
    answer: "Our market share has grown from 23.5% to 27.8% over the past year, representing an 18.3% increase. Competitor A declined from 31.2% to 29.5% (-5.4% change), while Competitor B remained relatively stable, moving from 19.8% to 20.2% (+2% change). Competitor C experienced the largest drop, falling from 16.5% to 13.1% (-20.6% change). Our growth was strongest in Q3 2023 when we launched our new product line, gaining 2.1 percentage points.",
    queryResults: [
      {
        columns: ['Quarter', 'Our Company', 'Competitor A', 'Competitor B', 'Competitor C', 'Others'],
        rows: [
          { 'Quarter': 'Q1 2023', 'Our Company': '23.5%', 'Competitor A': '31.2%', 'Competitor B': '19.8%', 'Competitor C': '16.5%', 'Others': '9.0%' },
          { 'Quarter': 'Q2 2023', 'Our Company': '24.2%', 'Competitor A': '30.8%', 'Competitor B': '19.7%', 'Competitor C': '15.9%', 'Others': '9.4%' },
          { 'Quarter': 'Q3 2023', 'Our Company': '26.3%', 'Competitor A': '30.1%', 'Competitor B': '19.9%', 'Competitor C': '14.5%', 'Others': '9.2%' },
          { 'Quarter': 'Q4 2023', 'Our Company': '27.8%', 'Competitor A': '29.5%', 'Competitor B': '20.2%', 'Competitor C': '13.1%', 'Others': '9.4%' }
        ],
        sql: "-- This would typically come from an external market research database or be calculated\n-- from revenue figures combined with industry total addressable market data\n\nWITH market_share_data AS (\n  SELECT\n    'Q1 2023' as quarter,\n    23.5 as our_company,\n    31.2 as competitor_a,\n    19.8 as competitor_b,\n    16.5 as competitor_c,\n    9.0 as others\n  UNION ALL\n  SELECT\n    'Q2 2023' as quarter,\n    24.2 as our_company,\n    30.8 as competitor_a,\n    19.7 as competitor_b,\n    15.9 as competitor_c,\n    9.4 as others\n  UNION ALL\n  SELECT\n    'Q3 2023' as quarter,\n    26.3 as our_company,\n    30.1 as competitor_a,\n    19.9 as competitor_b,\n    14.5 as competitor_c,\n    9.2 as others\n  UNION ALL\n  SELECT\n    'Q4 2023' as quarter,\n    27.8 as our_company,\n    29.5 as competitor_a,\n    20.2 as competitor_b,\n    13.1 as competitor_c,\n    9.4 as others\n)\nSELECT\n  quarter,\n  our_company || '%' as \"Our Company\",\n  competitor_a || '%' as \"Competitor A\",\n  competitor_b || '%' as \"Competitor B\",\n  competitor_c || '%' as \"Competitor C\",\n  others || '%' as \"Others\"\nFROM market_share_data\nORDER BY quarter;"
      }
    ],
    charts: [
      {
        type: 'line',
        data: [
          { name: 'Q1 2023', OurCompany: 23.5, CompetitorA: 31.2, CompetitorB: 19.8, CompetitorC: 16.5 },
          { name: 'Q2 2023', OurCompany: 24.2, CompetitorA: 30.8, CompetitorB: 19.7, CompetitorC: 15.9 },
          { name: 'Q3 2023', OurCompany: 26.3, CompetitorA: 30.1, CompetitorB: 19.9, CompetitorC: 14.5 },
          { name: 'Q4 2023', OurCompany: 27.8, CompetitorA: 29.5, CompetitorB: 20.2, CompetitorC: 13.1 }
        ]
      }
    ]
  },
  
  "Which distribution centers have the longest fulfillment times, and what factors correlate with these delays?": {
    answer: "The Southwest Distribution Center has the longest average fulfillment time at 5.3 days, followed by Northeast at 4.2 days and Midwest at 3.5 days. Key factors contributing to delays include staffing levels (correlation coefficient of -0.78, indicating fewer staff leads to longer times), order volume surges (correlation of 0.65), and inventory management practices. At the Southwest center specifically, we've identified that orders with multiple item types take 72% longer to fulfill, and products from certain suppliers consistently contribute to delays.",
    queryResults: [
      {
        columns: ['Distribution Center', 'Avg Fulfillment Time (days)', 'Staff to Order Ratio', 'Inventory Accuracy', 'Multiple Item Orders %'],
        rows: [
          { 'Distribution Center': 'Southwest', 'Avg Fulfillment Time (days)': '5.3', 'Staff to Order Ratio': '1:85', 'Inventory Accuracy': '91.2%', 'Multiple Item Orders %': '68%' },
          { 'Distribution Center': 'Northeast', 'Avg Fulfillment Time (days)': '4.2', 'Staff to Order Ratio': '1:67', 'Inventory Accuracy': '94.5%', 'Multiple Item Orders %': '52%' },
          { 'Distribution Center': 'Midwest', 'Avg Fulfillment Time (days)': '3.5', 'Staff to Order Ratio': '1:58', 'Inventory Accuracy': '96.1%', 'Multiple Item Orders %': '47%' },
          { 'Distribution Center': 'Southeast', 'Avg Fulfillment Time (days)': '2.8', 'Staff to Order Ratio': '1:42', 'Inventory Accuracy': '97.8%', 'Multiple Item Orders %': '51%' },
          { 'Distribution Center': 'West', 'Avg Fulfillment Time (days)': '2.3', 'Staff to Order Ratio': '1:38', 'Inventory Accuracy': '98.3%', 'Multiple Item Orders %': '44%' }
        ],
        sql: "WITH fulfillment_data AS (\n  SELECT\n    d.name AS distribution_center,\n    AVG(EXTRACT(DAY FROM o.ship_date - o.order_date)) AS avg_fulfillment_days,\n    COUNT(DISTINCT o.order_id) / COUNT(DISTINCT s.staff_id) AS staff_order_ratio,\n    i.accuracy_percentage AS inventory_accuracy,\n    COUNT(DISTINCT CASE WHEN item_count > 1 THEN o.order_id END) * 100.0 / COUNT(DISTINCT o.order_id) AS multiple_item_percentage\n  FROM orders o\n  JOIN distribution_centers d ON o.distribution_center_id = d.id\n  JOIN staff_assignments s ON d.id = s.distribution_center_id\n  JOIN inventory_metrics i ON d.id = i.distribution_center_id\n  JOIN (\n    SELECT order_id, COUNT(DISTINCT product_id) AS item_count\n    FROM order_items\n    GROUP BY order_id\n  ) items ON o.order_id = items.order_id\n  WHERE o.order_date >= CURRENT_DATE - INTERVAL '90 days'\n  GROUP BY d.name, i.accuracy_percentage\n)\nSELECT\n  distribution_center,\n  ROUND(avg_fulfillment_days::NUMERIC, 1) AS \"Avg Fulfillment Time (days)\",\n  '1:' || ROUND(staff_order_ratio) AS \"Staff to Order Ratio\",\n  ROUND(inventory_accuracy, 1) || '%' AS \"Inventory Accuracy\",\n  ROUND(multiple_item_percentage) || '%' AS \"Multiple Item Orders %\"\nFROM fulfillment_data\nORDER BY avg_fulfillment_days DESC;"
      }
    ],
    charts: [
      {
        type: 'bar',
        data: [
          { name: 'Southwest', FulfillmentTime: 5.3 },
          { name: 'Northeast', FulfillmentTime: 4.2 },
          { name: 'Midwest', FulfillmentTime: 3.5 },
          { name: 'Southeast', FulfillmentTime: 2.8 },
          { name: 'West', FulfillmentTime: 2.3 }
        ]
      },
      {
        type: 'area',
        data: [
          { name: '1-2 Items', Southwest: 2.1, Northeast: 1.8, Midwest: 1.6, Southeast: 1.5, West: 1.3 },
          { name: '3-5 Items', Southwest: 4.5, Northeast: 3.7, Midwest: 3.2, Southeast: 2.6, West: 2.1 },
          { name: '6+ Items', Southwest: 8.2, Northeast: 6.8, Midwest: 5.1, Southeast: 4.2, West: 3.8 }
        ]
      }
    ]
  },
  
  "What's our customer acquisition cost trend over the last 6 months broken down by marketing channel?": {
    answer: "Overall customer acquisition cost (CAC) has decreased by 12.3% over the last 6 months, from $67.50 to $59.20. Paid Search has shown the most significant improvement, with CAC dropping from $81.20 to $64.70 (-20.3%). Social Media CAC decreased from $52.80 to $48.30 (-8.5%), while Email Marketing remains our most cost-effective channel with a current CAC of $31.40 (down from $33.70). Content Marketing showed a slight increase in CAC from $42.30 to $43.80 (+3.5%), potentially due to increased competition for high-quality content placements.",
    queryResults: [
      {
        columns: ['Month', 'Overall CAC', 'Paid Search', 'Social Media', 'Email Marketing', 'Content Marketing'],
        rows: [
          { 'Month': 'January 2023', 'Overall CAC': '$67.50', 'Paid Search': '$81.20', 'Social Media': '$52.80', 'Email Marketing': '$33.70', 'Content Marketing': '$42.30' },
          { 'Month': 'February 2023', 'Overall CAC': '$65.20', 'Paid Search': '$78.50', 'Social Media': '$51.40', 'Email Marketing': '$33.20', 'Content Marketing': '$42.80' },
          { 'Month': 'March 2023', 'Overall CAC': '$63.80', 'Paid Search': '$74.30', 'Social Media': '$50.90', 'Email Marketing': '$32.60', 'Content Marketing': '$43.10' },
          { 'Month': 'April 2023', 'Overall CAC': '$61.40', 'Paid Search': '$69.80', 'Social Media': '$49.70', 'Email Marketing': '$32.20', 'Content Marketing': '$43.60' },
          { 'Month': 'May 2023', 'Overall CAC': '$60.10', 'Paid Search': '$67.20', 'Social Media': '$49.10', 'Email Marketing': '$31.80', 'Content Marketing': '$43.70' },
          { 'Month': 'June 2023', 'Overall CAC': '$59.20', 'Paid Search': '$64.70', 'Social Media': '$48.30', 'Email Marketing': '$31.40', 'Content Marketing': '$43.80' }
        ],
        sql: "WITH marketing_spend AS (\n  SELECT\n    DATE_TRUNC('month', mc.start_date) AS month,\n    mc.type AS channel,\n    SUM(mc.budget) AS total_spend\n  FROM marketing_campaigns mc\n  WHERE mc.start_date >= CURRENT_DATE - INTERVAL '6 months'\n  GROUP BY month, channel\n),\nnew_customers AS (\n  SELECT\n    DATE_TRUNC('month', c.join_date) AS month,\n    ci.channel,\n    COUNT(DISTINCT c.customer_id) AS customer_count\n  FROM customers c\n  JOIN customer_interactions ci ON c.customer_id = ci.customer_id\n  WHERE \n    ci.action = 'conversion' AND\n    c.join_date >= CURRENT_DATE - INTERVAL '6 months'\n  GROUP BY month, ci.channel\n),\ncac_calculation AS (\n  SELECT\n    ms.month,\n    ms.channel,\n    ms.total_spend / NULLIF(nc.customer_count, 0) AS cac\n  FROM marketing_spend ms\n  JOIN new_customers nc ON ms.month = nc.month AND ms.channel = nc.channel\n)\nSELECT\n  TO_CHAR(month, 'Month YYYY') AS \"Month\",\n  '$' || ROUND(AVG(cac), 2) AS \"Overall CAC\",\n  '$' || ROUND(MAX(CASE WHEN channel = 'paid_search' THEN cac END), 2) AS \"Paid Search\",\n  '$' || ROUND(MAX(CASE WHEN channel = 'social_media' THEN cac END), 2) AS \"Social Media\",\n  '$' || ROUND(MAX(CASE WHEN channel = 'email' THEN cac END), 2) AS \"Email Marketing\",\n  '$' || ROUND(MAX(CASE WHEN channel = 'content' THEN cac END), 2) AS \"Content Marketing\"\nFROM cac_calculation\nGROUP BY month\nORDER BY month;"
      }
    ],
    charts: [
      {
        type: 'line',
        data: [
          { name: 'Jan', Overall: 67.5, PaidSearch: 81.2, SocialMedia: 52.8, EmailMarketing: 33.7, ContentMarketing: 42.3 },
          { name: 'Feb', Overall: 65.2, PaidSearch: 78.5, SocialMedia: 51.4, EmailMarketing: 33.2, ContentMarketing: 42.8 },
          { name: 'Mar', Overall: 63.8, PaidSearch: 74.3, SocialMedia: 50.9, EmailMarketing: 32.6, ContentMarketing: 43.1 },
          { name: 'Apr', Overall: 61.4, PaidSearch: 69.8, SocialMedia: 49.7, EmailMarketing: 32.2, ContentMarketing: 43.6 },
          { name: 'May', Overall: 60.1, PaidSearch: 67.2, SocialMedia: 49.1, EmailMarketing: 31.8, ContentMarketing: 43.7 },
          { name: 'Jun', Overall: 59.2, PaidSearch: 64.7, SocialMedia: 48.3, EmailMarketing: 31.4, ContentMarketing: 43.8 }
        ]
      }
    ]
  },
  
  // Default response for any other query
  "default": {
    answer: "Based on my analysis of the database, I can provide insights on this query. The data shows interesting patterns worth exploring further. Let me know if you would like to examine specific aspects of this data or if you need a different type of analysis.",
    queryResults: [
      {
        columns: ['Category', 'Value', 'YoY Change'],
        rows: [
          { 'Category': 'Sales', 'Value': '$1,245,300', 'YoY Change': '+12.3%' },
          { 'Category': 'Customers', 'Value': '15,420', 'YoY Change': '+8.7%' },
          { 'Category': 'Average Order', 'Value': '$287.50', 'YoY Change': '+3.2%' },
          { 'Category': 'Retention Rate', 'Value': '68.5%', 'YoY Change': '+2.1%' }
        ],
        sql: "-- Generated SQL query based on the question\nSELECT\n  'Sample Data' as note,\n  'This is a placeholder response' as description\nFROM dual;"
      }
    ],
    charts: [
      {
        type: 'bar',
        data: [
          { name: 'Category A', value: 240 },
          { name: 'Category B', value: 180 },
          { name: 'Category C', value: 320 },
          { name: 'Category D', value: 120 }
        ]
      }
    ]
  }
};

// Mock function to process a query and return results
export const processQuery = async (query: string): Promise<InsightResponse> => {
  // Simulate API delay
  await delay(2000);
  
  // Check if we have a predefined response for this exact query
  const response = mockData[query] || mockData["default"];
  
  // Return the mock response
  return response;
};

export const getExampleQueries = (): string[] => {
  // Return a list of example queries (excluding the default one)
  return Object.keys(mockData).filter(key => key !== "default");
};

export const getDatabaseSchema = () => {
  return databaseSchema;
};

