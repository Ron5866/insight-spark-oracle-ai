
import Header from './Header';
import { ThemeToggle } from './ThemeToggle';

const HeaderWrapper = () => {
  return (
    <div className="relative">
      <Header />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default HeaderWrapper;
