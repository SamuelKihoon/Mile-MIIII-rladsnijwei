-- 테이블 존재 여부를 확인하는 함수
CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- 위 함수를 생성하는 함수 (클라이언트에서 호출용)
CREATE OR REPLACE FUNCTION public.create_check_table_function()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 함수가 이미 존재하는지 확인
  IF EXISTS (
    SELECT FROM pg_proc
    WHERE proname = 'check_table_exists'
    AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  ) THEN
    RETURN true;
  END IF;

  -- 함수 생성
  EXECUTE $FUNC$
  CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $INNER$
  DECLARE
    table_exists boolean;
  BEGIN
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = $1
    ) INTO table_exists;
    
    RETURN table_exists;
  END;
  $INNER$;
  $FUNC$;

  RETURN true;
END;
$$;
