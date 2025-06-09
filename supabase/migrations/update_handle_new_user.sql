-- Atualizar a função handle_new_user para capturar username e full_name do metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_username text;
  v_full_name text;
BEGIN
  -- Tenta pegar o username do metadata (enviado pelo frontend), se não existir usa o e-mail ou o id
  v_username := COALESCE(new.raw_user_meta_data->>'username', new.email, new.id::text);
  v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', '');

  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    v_username,
    v_full_name
  );

  -- Opcional: Criar configurações padrão de seções
  INSERT INTO public.user_sections (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN new;
END;
$$; 