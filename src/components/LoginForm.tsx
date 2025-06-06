
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula verificação de login
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === 'Vinícius' && password === 'dabdabdab1') {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Login Master",
      });
      onLogin();
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">🛡️ Login Master</CardTitle>
          <CardDescription>Acesso seguro ao seu dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p><strong>Usuário:</strong> Vinícius</p>
            <p><strong>Senha:</strong> dabdabdab1</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
