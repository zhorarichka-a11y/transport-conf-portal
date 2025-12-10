export interface Conference {
  id: string;
  title: string;
  date: string;
  format: string;
  cost: string;
  location: string;
  topic: string;
  description: string | null;
  university: string;
  source_url: string | null;
  created_at: string;
}
