Import { useContext } from ‘react’;
Import { AuthContext } from ‘../context/AuthContext’;
Import { Navigate } from ‘react-router-dom’;

Const PrivateRoute = ({ children, adminOnly }) => {
  Const { user, loading } = useContext(AuthContext);

  If (loading) {
    Return <div>Loading authentication...</div>;
  }

  If (!user) {
    Return <Navigate to=”/login” />;
  }

  If (adminOnly && !user.isAdmin) {
    Return <Navigate to=”/” />; // Redirect non-admins from admin routes
  }

  Return children;
};

Export default PrivateRoute;

