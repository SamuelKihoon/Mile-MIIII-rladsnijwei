-- users 테이블에 필드 추가
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS handle TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS birthdate DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS organization TEXT;

-- 테이블이 없는 경우 생성
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  avatar_url TEXT,
  coins INTEGER DEFAULT 100 NOT NULL,
  handle TEXT UNIQUE,
  birthdate DATE,
  gender TEXT,
  organization TEXT
);

-- 보안 설정: RLS 정책
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 사용자 테이블 정책
CREATE POLICY IF NOT EXISTS "Users can view their own user data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own user data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Anyone can view basic user info" ON public.users
  FOR SELECT USING (true);
