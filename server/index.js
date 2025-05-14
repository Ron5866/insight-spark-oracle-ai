
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const { createPool } = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection pool
const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dirty_business_data',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Helper to execute SQL queries
async function executeQuery(sql) {
  try {
    const [rows] = await pool.query(sql);
    return { success: true, data: rows };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: error.message };
  }
}

// Get database schema information
async function getDatabaseSchema() {
  try {
    // Get tables
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(table => Object.values(table)[0]);
    
    const schema = {};
    
    // Get columns for each table
    for (const tableName of tableNames) {
      const [columns] = await pool.query(`DESCRIBE ${tableName}`);
      schema[tableName] = columns;
    }
    
    return schema;
  } catch (error) {
    console.error('Error fetching schema:', error);
    return {};
  }
}

// API endpoint to process queries
app.post('/api/query', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    
    // Get database schema
    const schema = await getDatabaseSchema();
    
    // Use OpenAI to generate SQL from the question
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that converts business questions into SQL queries.
            
          The database schema is as follows:
          ${JSON.stringify(schema, null, 2)}
          
          This is a messy database with poorly named columns and potentially inconsistent data.
          
          Your job is to:
          1. Interpret the user's question
          2. Generate a valid SQL query to answer it
          3. Provide a natural language explanation of what you're looking for
          4. Suggest an appropriate visualization method (bar, line, pie, etc.)
          
          Respond with a JSON object containing the following fields:
          - sql: The SQL query to be executed
          - explanation: A natural language explanation of what the query is looking for
          - visualization: Recommended visualization type
          - confidence: A score from 0-100 indicating how confident you are in the SQL translation
          `
        },
        {
          role: "user",
          content: question
        }
      ],
      response_format: { type: "json_object" }
    });
    
    const aiResponse = JSON.parse(completion.choices[0].message.content);
    
    // Execute the generated SQL
    const queryResult = await executeQuery(aiResponse.sql);
    
    // Return the complete response
    res.json({
      answer: aiResponse.explanation,
      queryResults: queryResult.success ? [
        {
          columns: queryResult.data.length > 0 ? Object.keys(queryResult.data[0]) : [],
          rows: queryResult.data,
          sql: aiResponse.sql
        }
      ] : [],
      visualizationType: aiResponse.visualization,
      confidence: aiResponse.confidence
    });
    
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ 
      error: 'Failed to process query', 
      details: error.message 
    });
  }
});

// API endpoint to get example queries
app.get('/api/example-queries', (req, res) => {
  const exampleQueries = [
    "Which city performed worst last holiday season?",
    "Show trends of customer returns over time.",
    "Is there any suspicious activity in branch 7?",
    "Why did revenue tank in Q2 last year?",
    "Which products have the highest profit margin?",
    "Compare sales performance across different regions.",
    "Identify unusual patterns in customer behavior.",
    "Which stores are underperforming expectations?"
  ];
  
  res.json(exampleQueries);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

