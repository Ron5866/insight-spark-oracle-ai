
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutSection = () => {
  return (
    <Card className="mt-8" id="about">
      <CardHeader>
        <CardTitle>About InsightSpark Data Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          InsightSpark is an advanced AI data agent designed to help business users get answers to complex analytical questions without needing to write SQL or understand database schemas.
        </p>
        
        <h3 className="text-lg font-medium mt-4">Key Capabilities:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><span className="font-medium">Natural Language Understanding:</span> Ask questions in plain English, no technical syntax required.</li>
          <li><span className="font-medium">Complex Query Handling:</span> Get answers to multi-step analytical questions that would normally require multiple SQL queries.</li>
          <li><span className="font-medium">Schema-Agnostic:</span> Works even with poorly documented databases, unnamed columns, or confusing table relationships.</li>
          <li><span className="font-medium">Data Visualization:</span> Automatically generates relevant charts and tables to represent the data visually.</li>
          <li><span className="font-medium">Insight Generation:</span> Provides context and business implications alongside raw data results.</li>
        </ul>
        
        <h3 className="text-lg font-medium mt-4">Sample Dataset:</h3>
        <p>
          The system is currently connected to a sample e-commerce database with the following structure:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="font-medium">Products</h4>
            <p className="text-xs text-muted-foreground">product_id, name, category, price, cost, supplier_id</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="font-medium">Customers</h4>
            <p className="text-xs text-muted-foreground">customer_id, name, email, segment, join_date</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="font-medium">Orders</h4>
            <p className="text-xs text-muted-foreground">order_id, customer_id, order_date, status, total_amount</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="font-medium">Order_Items</h4>
            <p className="text-xs text-muted-foreground">id, order_id, product_id, quantity, price</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="font-medium">Marketing_Campaigns</h4>
            <p className="text-xs text-muted-foreground">campaign_id, name, type, start_date, end_date, budget</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-md">
            <h4 className="font-medium">Customer_Interactions</h4>
            <p className="text-xs text-muted-foreground">interaction_id, customer_id, campaign_id, date, channel, action</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
