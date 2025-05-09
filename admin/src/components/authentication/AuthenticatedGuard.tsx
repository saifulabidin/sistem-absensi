import { Navigate, Outlet } from 'react-router-dom';
import { useAuthentication } from './useAuthentication';

type Props = {
  redirectTo?: string;
};

const AuthenticatedGuard = ({ redirectTo = '/login' }: Props) => {
  const { user, isLoading } = useAuthentication();

  if (isLoading) {
    // Display a loading indicator while checking authentication
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} />;
  }

  // Render the protected routes
  return <Outlet />;
};

export default AuthenticatedGuard;
