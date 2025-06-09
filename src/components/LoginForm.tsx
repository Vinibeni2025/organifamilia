
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credenciais mockadas
    if (username === 'Vinícius' && password === 'dabdabdab1') {
      setError('');
      onLogin();
    } else {
      setError('Usuário ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">🛡️ Login Master</CardTitle>
          <p className="text-gray-600">Acesso Seguro ao Dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
            <div className="font-semibold mb-1">Credenciais de acesso:</div>
            <div>Usuário: <code className="bg-white px-1 rounded">Vinícius</code></div>
            <div>Senha: <code className="bg-white px-1 rounded">dabdabdab1</code></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
