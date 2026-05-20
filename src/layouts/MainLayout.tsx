import { Outlet } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import ThemeToggle from '../components/ThemeToggle';
import patnaaqiLogo from '/patnaaqi_logo.png';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)]">
      <DesktopNav />
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[var(--color-surface-light)] dark:bg-[var(--color-surface-dark)] border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] sticky top-0 z-40">
        <div className="flex items-center cursor-default">
          <img src={patnaaqiLogo} alt="PatnaAQI Logo" className="h-7 object-contain" />
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto pb-20 md:pb-8">
        <Outlet />
      </main>
      
      <MobileNav />
    </div>
  );
}
