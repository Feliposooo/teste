import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { AdminDashboard } from '@/components/AdminDashboard';
import { ResidentDashboard } from '@/components/ResidentDashboard';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (user?.type === 'admin') {
    return <AdminDashboard />;
  }

  return <ResidentDashboard />;
};

export default Index;
