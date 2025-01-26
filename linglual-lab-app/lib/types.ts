export interface Record {
  id: string;
  date: string;
  content: string;
  topic: string;
  level?: 'Beginner' | 'Intermediate' | 'Upper Intermediate' | 'Advanced' | 'Master';
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TavilySearchResult {
  title: string
  content: string
  url: string
  score: number
}

export interface TavilyResponse {
  results: TavilySearchResult[]
  query: string
  answer?: string
} 