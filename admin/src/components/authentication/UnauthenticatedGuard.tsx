import { Navigate, Outlet } from 'react-router-dom';
import { useAuthentication } from './useAuthentication';

type Props = {
  redirectTo?: string;
};

const UnauthenticatedGuard = ({ redirectTo = '/dashboard' }: Props) => {
  const { user, isLoading } = useAuthentication();

  if (isLoading) {
    // Display a loading indicator while checking authentication
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect to dashboard if authenticated
  if (user) {
    return <Navigate to={redirectTo} />;
  }

  // Render the public routes
  return <Outlet />;
};

export default UnauthenticatedGuard;
