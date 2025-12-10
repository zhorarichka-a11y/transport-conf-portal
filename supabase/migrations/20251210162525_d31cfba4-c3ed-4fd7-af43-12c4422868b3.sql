-- Create table for conferences
CREATE TABLE public.conferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  format TEXT NOT NULL,
  cost TEXT NOT NULL,
  location TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  university TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conferences ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view conferences" 
ON public.conferences 
FOR SELECT 
USING (true);

-- Create policy for public insert access (since no auth required per user request)
CREATE POLICY "Anyone can insert conferences" 
ON public.conferences 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public delete access
CREATE POLICY "Anyone can delete conferences" 
ON public.conferences 
FOR DELETE 
USING (true);

-- Insert real conferences from PGUPS 2025
INSERT INTO public.conferences (title, date, format, cost, location, topic, description, university, source_url)
VALUES 
(
  'Транспорт: проблемы, идеи, перспективы',
  '14-18 апреля 2025',
  'Очный',
  'Бесплатно',
  'ПГУПС, Санкт-Петербург',
  'Транспорт, Логистика, Инженерия',
  'Всероссийская научно-техническая конференция студентов, аспирантов и молодых ученых. Главное событие Фестиваля «Неделя науки 2025». Работа ведётся по 6 секциям с участием более 1000 студентов и аспирантов.',
  'ПГУПС',
  'https://www.pgups.ru/science/research/student-science/week-of-science/'
),
(
  'Автоматизация и интеллектуальные технологии на транспорте',
  '15-16 апреля 2025',
  'Очный',
  'Бесплатно',
  'ПГУПС, Санкт-Петербург',
  'Автоматизация, IT, Транспорт',
  'Секция в рамках конференции «Транспорт: проблемы, идеи, перспективы». Рассматриваются вопросы внедрения современных цифровых технологий и систем автоматизации на железнодорожном транспорте.',
  'ПГУПС',
  'https://www.pgups.ru/science/research/student-science/week-of-science/'
),
(
  'Железнодорожный транспорт — драйвер экономики России',
  '15-16 апреля 2025',
  'Очный',
  'Бесплатно',
  'ПГУПС, Санкт-Петербург',
  'Железнодорожный транспорт, Экономика',
  'Секция конференции «Транспорт: проблемы, идеи, перспективы». Обсуждаются перспективы развития железнодорожной отрасли как ключевого драйвера экономического роста страны.',
  'ПГУПС',
  'https://www.pgups.ru/science/research/student-science/week-of-science/'
),
(
  'Новые технологии и материалы в строительстве',
  '15-16 апреля 2025',
  'Очный',
  'Бесплатно',
  'ПГУПС, Санкт-Петербург',
  'Строительство, Инновации, Материалы',
  'Секция в рамках конференции «Транспорт: проблемы, идеи, перспективы». Рассматриваются инновационные строительные технологии и материалы для транспортной инфраструктуры.',
  'ПГУПС',
  'https://www.pgups.ru/science/research/student-science/week-of-science/'
);