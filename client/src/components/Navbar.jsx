import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderGit2, LogOut, User, Menu, X, CheckSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-glass sticky top-0 z-50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group" id="navbar-logo">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500/20 rounded-lg blur-md group-hover:bg-primary-500/30 transition-all duration-300" />
              <CheckSquare className="relative h-7 w-7 text-primary-400 group-hover:text-primary-300 transition-colors duration-300" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white hidden sm:block">
              Task<span className="gradient-text">Flow</span>
            </span>
          </Link>
          
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                id={`nav-link-${label.toLowerCase()}`}
                className={`
                  relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${isActive(to) 
                    ? 'text-white bg-white/8' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {isActive(to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* User badge */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-300 glass px-3 py-1.5 rounded-full" id="user-badge">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                {user.name?.charAt(0)}
              </div>
              <span className="font-medium text-gray-200 max-w-[120px] truncate">{user.name}</span>
              <span className="bg-primary-500/15 text-primary-400 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="tooltip text-gray-500 hover:text-red-400 transition-all duration-300 p-2 rounded-lg hover:bg-red-500/10"
              data-tooltip="Logout"
              id="logout-btn"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              id="mobile-menu-toggle"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 animate-fade-in-down">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(to) 
                    ? 'text-white bg-primary-500/10 border border-primary-500/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            {/* Mobile user info */}
            <div className="flex items-center space-x-2 px-4 py-3 mt-2 border-t border-white/5 text-sm text-gray-400">
              <User className="h-4 w-4 text-primary-400" />
              <span>{user.name}</span>
              <span className="bg-primary-500/15 text-primary-400 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
