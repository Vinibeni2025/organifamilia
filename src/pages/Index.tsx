
import { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';
import { UserProvider } from '@/contexts/UserContext';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já está logado no localStorage
    const loggedIn = localStorage.getItem('loginMaster_loggedIn');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('loginMaster_loggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('loginMaster_loggedIn');
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <UserProvider>
      <Dashboard onLogout={handleLogout} />
    </UserProvider>
  );
};

export default Index;
