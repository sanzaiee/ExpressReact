import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loader';

/**
 * AdminRoute Component
 * 
 * Protects routes that require admin role access.
 * - Checks if user is authenticated
 * - Checks if user has admin role
 * - Redirects non-admin users (role: 'user') to home page
 * - Shows loading state while checking authentication
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  // Assuming roles: 'admin' or 'user' (default)
  // Adjust the role check based on your backend role values
  const isAdmin = user?.role === 'admin';

  // Redirect non-admin users to home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has admin role, render the protected content
  return children;
};

export default AdminRoute;
