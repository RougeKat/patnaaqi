import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import patnaaqiLogo from '/patnaaqi_logo.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Stations', path: '/stations' },
  { name: 'Map', path: '/map' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Reports', path: '/reports' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  // { name: 'API', path: '/api' },
];

export default function DesktopNav() {
  const location = useLocation();

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] sticky top-0 z-50">
      <div className="flex items-center cursor-default">
        <img src={patnaaqiLogo} alt="PatnaAQI Logo" className="h-8 object-contain" />
      </div>
      
      <nav className="flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[15px] font-medium transition-colors ${
                isActive 
                  ? 'text-[var(--color-accent-light)] dark:text-[var(--color-accent-dark)]' 
                  : 'text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)] hover:text-[var(--color-text-primary-light)] dark:hover:text-[var(--color-text-primary-dark)]'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="flex items-center ml-4 border-l border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] pl-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
