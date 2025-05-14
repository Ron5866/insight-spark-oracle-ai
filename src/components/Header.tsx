
import { Brain } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-insight-600" />
          <span className="text-xl font-bold text-insight-800">InsightSpark</span>
          <span className="rounded-md bg-insight-100 px-2 py-1 text-xs font-medium text-insight-700">
            Data Agent
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <a 
            href="#about" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </a>
          <a 
            href="#examples" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Example Queries
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
