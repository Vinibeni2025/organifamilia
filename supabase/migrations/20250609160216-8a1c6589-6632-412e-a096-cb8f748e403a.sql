-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela para dados diários
CREATE TABLE public.daily_data (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  agua integer DEFAULT 0,
  cigarros integer DEFAULT 0,
  refeicoes_medias integer DEFAULT 0,
  refeicoes_grandes integer DEFAULT 0,
  polichinelos integer DEFAULT 0,
  notas text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, date)
);

-- Criar tabela para configurações de seções
CREATE TABLE public.user_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agua boolean DEFAULT true,
  cigarros boolean DEFAULT true,
  refeicoes boolean DEFAULT true,
  polichinelos boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id)
);

-- Criar tabela para listas de compras
CREATE TABLE public.shopping_lists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  month text NOT NULL, -- formato: "2024-01"
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  UNIQUE (user_id, month)
);

-- Criar tabela para itens da lista de compras
CREATE TABLE public.shopping_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  shopping_list_id uuid NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  text text NOT NULL,
  completed boolean DEFAULT false,
  date_added timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas RLS para daily_data
CREATE POLICY "Users can view their own daily data" ON public.daily_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily data" ON public.daily_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily data" ON public.daily_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily data" ON public.daily_data
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para user_sections
CREATE POLICY "Users can view their own sections" ON public.user_sections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sections" ON public.user_sections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sections" ON public.user_sections
  FOR UPDATE USING (auth.uid() = user_id);

-- Políticas RLS para shopping_lists
CREATE POLICY "Users can view their own shopping lists" ON public.shopping_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shopping lists" ON public.shopping_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shopping lists" ON public.shopping_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shopping lists" ON public.shopping_lists
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para shopping_items (usando JOIN para verificar propriedade)
CREATE POLICY "Users can view their own shopping items" ON public.shopping_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own shopping items" ON public.shopping_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own shopping items" ON public.shopping_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own shopping items" ON public.shopping_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.shopping_lists 
      WHERE shopping_lists.id = shopping_list_id 
      AND shopping_lists.user_id = auth.uid()
    )
  );

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  );
  
  -- Criar configurações padrão de seções
  INSERT INTO public.user_sections (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Policy para permitir INSERT em profiles para todos (apenas para testes)
CREATE POLICY "Allow insert for all"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (true);
