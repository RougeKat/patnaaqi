import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Map, FileText, Menu } from 'lucide-react';

const mobileLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Stations', path: '/stations', icon: MapPin },
  { name: 'Map', path: '/map', icon: Map },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'More', path: '/more', icon: Menu },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border-t border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] pb-safe z-50">
      <div className="flex items-center justify-around h-16">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
          
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive 
                  ? 'text-[var(--color-accent-light)] dark:text-[var(--color-accent-dark)]' 
                  : 'text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
