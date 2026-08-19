import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-lg font-bold text-indigo-600">
            TicketDesk
          </Link>
          <div className="hidden items-center gap-1 sm:flex">
            <NavLink to="/dashboard" className={linkClass}>
              My Tickets
            </NavLink>
            <NavLink to="/tickets/new" className={linkClass}>
              New Ticket
            </NavLink>
            {isAdmin && (
              <>
                <NavLink to="/admin" className={linkClass}>
                  Admin Dashboard
                </NavLink>
                <NavLink to="/admin/users" className={linkClass}>
                  Users
                </NavLink>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-600 sm:inline">
            {user?.name}
            {isAdmin && (
              <span className="ml-2 rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                Admin
              </span>
            )}
          </span>
          <button type="button" onClick={handleLogout} className="btn-secondary text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
