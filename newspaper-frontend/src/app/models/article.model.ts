export interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleRequest {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  imageUrl: string;
  featured: boolean;
}

export interface PagedArticleResponse {
  articles: Article[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  expiresIn: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
