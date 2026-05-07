import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthProvider';
import { LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { session, isLoading, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
}
