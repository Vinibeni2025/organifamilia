
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
<<<<<<< HEAD
import { useAuth } from '@/hooks/useCustomAuth';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    username: '', 
    password: '', 
=======
import { useAuth } from '@/hooks/useAuth';

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    username: '', 
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
    fullName: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
<<<<<<< HEAD
    const { error } = await signIn(loginData.username, loginData.password);
    
    if (error) {
      setError(error.message || 'Usuário ou senha incorretos');
=======
    const { error } = await signIn(loginData.email, loginData.password);
    
    if (error) {
      setError('Email ou senha incorretos');
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await signUp(
<<<<<<< HEAD
      signupData.username, 
      signupData.password, 
=======
      signupData.email, 
      signupData.password, 
      signupData.username, 
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
      signupData.fullName
    );
    
    if (error) {
<<<<<<< HEAD
      setError(error.message || 'Erro ao criar conta');
=======
      setError('Erro ao criar conta: ' + error.message);
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">🛡️ Organização Angular 1.0</CardTitle>
<<<<<<< HEAD
          <p className="text-gray-600">Sistema de organização com base Angular</p>
=======
          <p className="text-gray-600">Sistema de Gestão Pessoal</p>
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Registrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
<<<<<<< HEAD
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    placeholder="Digite seu nome de usuário"
=======
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="Digite seu email"
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Digite sua senha"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
<<<<<<< HEAD

              <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <div className="font-semibold mb-1">Usuários de teste:</div>
                <div className="space-y-1">
                  <div><strong>vinicius2025</strong> / juntoftn1</div>
                  <div><strong>mariana</strong> / junto123</div>
                  <div><strong>emanuel</strong> / junto567</div>
                  <div><strong>bruna</strong> / junto890</div>
                </div>
              </div>
=======
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Nome de usuário</Label>
                  <Input
                    id="signup-username"
                    type="text"
                    value={signupData.username}
                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
<<<<<<< HEAD
                    placeholder="Ex: usuario123"
=======
                    placeholder="Ex: vinicius2025"
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname">Nome completo</Label>
                  <Input
                    id="signup-fullname"
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                
                <div className="space-y-2">
<<<<<<< HEAD
=======
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="Digite seu email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
>>>>>>> 6c1222520196260cabbb9b0cc5dfbd5944c51f3e
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="Digite sua senha"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
