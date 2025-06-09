
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
      
      const { data, error } = await supabase.rpc('authenticate_user', {
        username_input: username,
        password_input: password
      });

      if (error) {
        console.error('Erro na autenticação:', error);
        return { error: { message: 'Erro ao conectar com o servidor' } };
      }

      console.log('Resposta da autenticação:', data);

      if (!data || data.length === 0) {
        return { error: { message: 'Usuário não encontrado' } };
      }

      const authResult = data[0];
      
      if (!authResult.success) {
        return { error: { message: 'Senha incorreta' } };
      }

      const userProfile = {
        id: authResult.user_id,
        username: authResult.username,
        full_name: authResult.full_name
      };

      setUser(userProfile);
      localStorage.setItem('angular_user', JSON.stringify(userProfile));

      return { error: null };
    } catch (error) {
      console.error('Erro na função signIn:', error);
      return { error: { message: 'Erro interno do sistema' } };
    }
  };

  const signUp = async (username: string, password: string, fullName: string) => {
    try {
      // Verificar se usuário já existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        return { error: { message: 'Nome de usuário já existe' } };
      }

      // Criar hash da senha usando a função do banco
      const { data: hashResult, error: hashError } = await supabase.rpc('hash_password', {
        password: password
      });

      if (hashError) {
        console.error('Erro ao gerar hash:', hashError);
        return { error: { message: 'Erro ao processar senha' } };
      }

      // Inserir novo usuário
      const { data: newUser, error: insertError } = await supabase
        .from('profiles')
        .insert({
          username: username,
          full_name: fullName,
          password_hash: hashResult
        })
        .select()
        .single();

      if (insertError) {
        console.error('Erro ao criar usuário:', insertError);
        return { error: { message: 'Erro ao criar usuário' } };
      }

      // Criar configurações padrão de seções
      await supabase
        .from('user_sections')
        .insert({
          user_id: newUser.id,
          agua: true,
          cigarros: true,
          refeicoes: true,
          polichinelos: true
        });

      const userProfile = {
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.full_name
      };

      setUser(userProfile);
      localStorage.setItem('angular_user', JSON.stringify(userProfile));

      return { error: null };
    } catch (error) {
      console.error('Erro na função signUp:', error);
      return { error: { message: 'Erro interno do sistema' } };
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
