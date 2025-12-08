import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { ROUTES } from '../constants';

export function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link to={ROUTES.DASHBOARD} className="text-xl font-bold text-indigo-600">
                FixSync
              </Link>
              <nav className="flex space-x-4">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.DEVICES}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Thiết bị
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to={ROUTES.USERS}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Người dùng
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.fullName}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-indigo-600"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

