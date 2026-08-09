import { NavLink, Outlet } from 'react-router-dom';
import { Bot, ChartNoAxesColumnIncreasing, Home, Map, UserRound } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/plan', label: 'Plan', icon: Map },
  { to: '/coach', label: 'Coach', icon: Bot },
  { to: '/progress', label: 'Progress', icon: ChartNoAxesColumnIncreasing },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export function AppLayout() {
  return (
    <div className="product-shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="logo"><span>✦</span> SkillPilot AI</div>
        <nav>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <header className="mobile-bar"><strong>SkillPilot AI</strong></header>
      <Outlet />
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'bottom-link active' : 'bottom-link')}>
            <Icon size={18} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
