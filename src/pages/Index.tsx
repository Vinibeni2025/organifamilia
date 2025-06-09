
<<<<<<< HEAD
import { useAuth } from '@/hooks/useCustomAuth';
=======
import { useAuth } from '@/hooks/useAuth';
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Dashboard />;
};

export default Index;
