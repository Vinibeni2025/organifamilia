import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signUp: (username: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('angular_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('angular_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      console.log('Tentando fazer login com:', username);

      // Usar signInWithPassword do Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username, // O campo 'username' do seu formulário agora é o e-mail
        password: password
      });

      if (error) {
        console.error('Erro no login:', error.message);
        return { error: { message: error.message || 'Erro ao conectar com o servidor' } };
      }

      if (!data.user) {
        return { error: { message: 'Usuário não encontrado ou credenciais inválidas' } };
      }

      // Buscar o perfil do usuário na tabela 'profiles' após o login bem-sucedido
      const { data: userProfileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError.message);
        return { error: { message: 'Erro ao carregar dados do usuário' } };
      }

      const userProfile = {
        id: userProfileData.id,
        username: userProfileData.username,
        full_name: userProfileData.full_name
      };

      setUser(userProfile);
      localStorage.setItem('angular_user', JSON.stringify(userProfile));

      return { error: null };
    } catch (error: any) {
      console.error('Erro na função signIn:', error);
      return { error: { message: error.message || 'Erro interno do sistema' } };
    }
  };

  const signUp = async (username: string, password: string, fullName: string) => {
    try {
      // Usar signUp do Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: username, // O campo 'username' do seu formulário agora é o e-mail
        password: password,
        options: {
          data: {
            username: username, // Passa o username para a trigger handle_new_user
            full_name: fullName // Passa o nome completo para a trigger
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error.message);
        return { error: { message: error.message || 'Erro ao criar usuário' } };
      }

      if (!data.user) {
        return { error: { message: 'Falha ao criar usuário (verifique as credenciais)' } };
      }

      // O perfil na tabela 'profiles' é criado pela trigger handle_new_user
      // Não precisamos inserir diretamente aqui.

      const userProfile = {
        id: data.user.id, // O ID vem do Supabase Auth
        username: username, // Usamos o username fornecido (que é o e-mail)
        full_name: fullName
      };

      setUser(userProfile);
      localStorage.setItem('angular_user', JSON.stringify(userProfile));

      return { error: null };
    } catch (error: any) {
      console.error('Erro na função signUp:', error);
      return { error: { message: error.message || 'Erro interno do sistema' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('angular_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
