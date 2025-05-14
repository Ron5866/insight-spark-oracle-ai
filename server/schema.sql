
-- Create a messy database
CREATE DATABASE IF NOT EXISTS dirty_business_data;
USE dirty_business_data;

-- Sales table with poorly named columns
CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  dt DATETIME,                      -- date/time (poorly named)
  amt DECIMAL(10, 2),               -- amount (poorly named)
  qty INT,                          -- quantity (poorly named)
  c_id INT,                         -- customer ID (poorly named)
  p_id INT,                         -- product ID (poorly named)
  st_id INT,                        -- store ID (poorly named)
  reg VARCHAR(20),                  -- region (poorly named)
  x_13 VARCHAR(50),                 -- city name (very poorly named)
  is_holiday TINYINT(1),            -- holiday flag
  promo TINYINT(1),                 -- promotion flag
  col1 VARCHAR(100),                -- product name (terribly named)
  t1 DECIMAL(5, 2),                 -- tax percentage (poorly named)
  q VARCHAR(10),                    -- quarter (poorly named, e.g., "Q1", "Q2")
  yr INT                            -- year
);

-- Customers table with inconsistent naming
CREATE TABLE IF NOT EXISTS customers (
  CustomerID INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),                -- full name (inconsistent with other tables)
  email TEXT,                       -- email address
  signup DATE,                      -- signup date
  type VARCHAR(50),                 -- customer type
  ltv DECIMAL(10, 2),               -- lifetime value
  seg VARCHAR(20),                  -- segment
  loc_id INT                        -- location ID
);

-- Products with mixed naming conventions
CREATE TABLE IF NOT EXISTS products (
  product_id INT AUTO_INCREMENT PRIMARY KEY, -- different naming convention
  product_name VARCHAR(100),
  cat VARCHAR(50),                  -- category (abbreviated)
  sub_cat VARCHAR(50),              -- subcategory (abbreviated)
  price DECIMAL(10, 2),
  cost DECIMAL(10, 2),
  supplier VARCHAR(100),
  stock INT,
  min_stock INT,
  department VARCHAR(50),
  Flag TINYINT(1)                   -- active flag (inconsistent capitalization)
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  ID INT AUTO_INCREMENT PRIMARY KEY, -- inconsistent with other tables
  NAME VARCHAR(100),                 -- inconsistent capitalization
  ADDR VARCHAR(200),                 -- address (abbreviated and capitalized)
  CITY VARCHAR(100),                 -- inconsistent capitalization
  STATE VARCHAR(2),
  ZIP VARCHAR(10),
  MGR VARCHAR(100),                  -- manager (abbreviated)
  open_date DATE,                    -- inconsistent with capitalization above
  region_id INT,
  status VARCHAR(20)
);

-- Returns table with ambiguous columns
CREATE TABLE IF NOT EXISTS returns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  s_id INT,                         -- sale ID (abbreviated)
  date DATETIME,
  reason TEXT,
  amount DECIMAL(10, 2),
  proc_by VARCHAR(100),             -- processed by (abbreviated)
  approved TINYINT(1),
  x1 INT,                           -- store ID (very poorly named)
  x2 VARCHAR(50),                   -- product name (very poorly named)
  flag INT                          -- suspicious flag (1=suspicious)
);

-- Branch performance with unnamed columns
CREATE TABLE IF NOT EXISTS branch_perf (
  id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT,
  period VARCHAR(20),               -- time period (month/quarter/year)
  y DECIMAL(15, 2),                 -- revenue (extremely poorly named)
  x DECIMAL(15, 2),                 -- expenses (extremely poorly named)
  z DECIMAL(15, 2),                 -- profit (extremely poorly named)
  a INT,                            -- number of transactions (extremely poorly named)
  b INT,                            -- number of customers (extremely poorly named)
  c DECIMAL(5, 2),                  -- growth percentage (extremely poorly named)
  d VARCHAR(10),                    -- performance rating (extremely poorly named)
  e INT,                            -- year (extremely poorly named)
  f VARCHAR(10)                     -- quarter (extremely poorly named)
);

-- Insert sample data into sales
INSERT INTO sales (dt, amt, qty, c_id, p_id, st_id, reg, x_13, is_holiday, promo, col1, t1, q, yr)
VALUES 
  ('2023-11-24', 1250.99, 5, 1, 101, 1, 'North', 'Chicago', 1, 1, 'Deluxe Laptop', 8.25, 'Q4', 2023),
  ('2023-11-25', 650.50, 2, 2, 102, 1, 'North', 'Chicago', 1, 1, 'Standard Desktop', 8.25, 'Q4', 2023),
  ('2023-12-05', 199.99, 1, 3, 103, 2, 'South', 'Miami', 0, 0, 'Wireless Headphones', 7.00, 'Q4', 2023),
  ('2023-12-15', 1499.99, 1, 4, 101, 2, 'South', 'Miami', 0, 1, 'Deluxe Laptop', 7.00, 'Q4', 2023),
  ('2023-12-24', 89.99, 3, 5, 104, 3, 'East', 'Boston', 1, 0, 'Keyboard', 6.25, 'Q4', 2023),
  ('2023-01-15', 2199.99, 1, 1, 105, 1, 'North', 'Chicago', 0, 0, 'Gaming PC', 8.25, 'Q1', 2023),
  ('2023-02-10', 599.99, 2, 6, 106, 4, 'West', 'Seattle', 0, 1, 'Tablet', 9.50, 'Q1', 2023),
  ('2023-03-21', 399.99, 4, 7, 107, 5, 'Central', 'Dallas', 0, 0, 'Monitor', 8.25, 'Q1', 2023),
  ('2023-04-05', 349.99, 3, 8, 108, 6, 'Northeast', 'New York', 0, 1, 'Printer', 8.88, 'Q2', 2023),
  ('2023-05-12', 129.99, 5, 9, 109, 7, 'Southwest', 'Phoenix', 0, 0, 'External Drive', 8.00, 'Q2', 2023),
  ('2023-06-30', 179.99, 2, 10, 110, 7, 'Southwest', 'Phoenix', 0, 1, 'Router', 8.00, 'Q2', 2023),
  ('2023-07-04', 1299.99, 1, 11, 111, 3, 'East', 'Boston', 1, 1, 'Ultrabook', 6.25, 'Q3', 2023),
  ('2023-08-15', 799.99, 1, 12, 112, 4, 'West', 'Seattle', 0, 0, 'Smartphone', 9.50, 'Q3', 2023),
  ('2023-09-22', 249.99, 3, 13, 113, 5, 'Central', 'Dallas', 0, 1, 'Smartwatch', 8.25, 'Q3', 2023),
  ('2023-10-31', 59.99, 10, 14, 114, 6, 'Northeast', 'New York', 0, 0, 'Mouse', 8.88, 'Q4', 2023),
  ('2022-01-15', 1999.99, 1, 1, 105, 1, 'North', 'Chicago', 0, 0, 'Gaming PC', 8.25, 'Q1', 2022),
  ('2022-04-05', 1299.99, 1, 4, 101, 2, 'South', 'Miami', 0, 0, 'Deluxe Laptop', 7.00, 'Q2', 2022),
  ('2022-04-15', 1199.99, 1, 8, 101, 6, 'Northeast', 'New York', 0, 1, 'Deluxe Laptop', 8.88, 'Q2', 2022),
  ('2022-05-20', 99.99, 5, 9, 104, 7, 'Southwest', 'Phoenix', 0, 0, 'Keyboard', 8.00, 'Q2', 2022),
  ('2022-06-01', 159.99, 3, 10, 109, 7, 'Southwest', 'Phoenix', 0, 0, 'External Drive', 8.00, 'Q2', 2022);

-- Insert sample data into branch_perf
INSERT INTO branch_perf (branch_id, period, y, x, z, a, b, c, d, e, f)
VALUES
  (7, 'Q2', 245000.50, 220000.75, 25000.25, 1250, 850, 2.5, 'Poor', 2022, 'Q2'),
  (7, 'Q3', 285000.75, 225000.50, 60000.25, 1450, 950, 15.5, 'Good', 2022, 'Q3'),
  (7, 'Q4', 410000.25, 330000.00, 80000.25, 2250, 1200, 22.5, 'Excellent', 2022, 'Q4'),
  (7, 'Q1', 320000.00, 260000.50, 60000.50, 1850, 1050, 12.5, 'Good', 2023, 'Q1'),
  (7, 'Q2', 255000.25, 240000.75, 15000.50, 1350, 800, -5.5, 'Poor', 2023, 'Q2'),
  (7, 'Q3', 275000.50, 235000.25, 40000.25, 1550, 900, 8.5, 'Average', 2023, 'Q3'),
  (7, 'Q4', 425000.75, 350000.00, 75000.75, 2350, 1250, 20.5, 'Excellent', 2023, 'Q4');

-- Insert sample returns data with suspicious activities
INSERT INTO returns (s_id, date, reason, amount, proc_by, approved, x1, x2, flag)
VALUES
  (1, '2023-11-30', 'Defective product', 1250.99, 'John Smith', 1, 1, 'Deluxe Laptop', 0),
  (3, '2023-12-10', 'Wrong item', 199.99, 'Sarah Johnson', 1, 2, 'Wireless Headphones', 0),
  (5, '2023-12-30', 'Changed mind', 89.99, 'Mike Davis', 0, 3, 'Keyboard', 0),
  (7, '2023-02-15', 'Does not match description', 599.99, 'Emily Brown', 1, 4, 'Tablet', 0),
  (9, '2023-04-10', 'Better price elsewhere', 349.99, 'Alex Wilson', 0, 6, 'Printer', 0),
  (11, '2023-07-10', 'Not working properly', 1299.99, 'John Smith', 1, 3, 'Ultrabook', 0),
  (12, '2023-08-20', 'Buyer remorse', 799.99, 'Sarah Johnson', 0, 4, 'Smartphone', 0),
  (13, '2023-09-25', 'Customer complaint', 249.99, 'Mike Davis', 1, 5, 'Smartwatch', 0),
  (14, '2023-11-05', 'Missing parts', 59.99, 'Emily Brown', 1, 6, 'Mouse', 0),
  (15, '2023-07-15', 'Unusual return pattern', 1299.99, 'Alex Wilson', 1, 7, 'Unknown', 1),
  (16, '2023-07-16', 'Multiple returns', 1299.99, 'Alex Wilson', 1, 7, 'Unknown', 1),
  (17, '2023-07-17', 'No receipt', 899.99, 'Alex Wilson', 0, 7, 'Unknown', 1),
  (18, '2023-07-18', 'After hours return', 799.99, 'Alex Wilson', 1, 7, 'Unknown', 1),
  (19, '2023-07-19', 'Manager override', 699.99, 'Alex Wilson', 1, 7, 'Unknown', 1);
