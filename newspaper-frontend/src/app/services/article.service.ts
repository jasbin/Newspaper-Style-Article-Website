import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Article,
  ArticleRequest,
  PagedArticleResponse
} from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {

  private apiUrl = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  getArticles(
    keyword: string = '',
    category: string = '',
    page: number = 0,
    size: number = 9
  ): Observable<PagedArticleResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (keyword) params = params.set('keyword', keyword);
    if (category && category !== 'All') params = params.set('category', category);
    return this.http.get<PagedArticleResponse>(this.apiUrl, { params });
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  getFeaturedArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/featured`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  createArticle(request: ArticleRequest): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, request);
  }

  updateArticle(id: number, request: ArticleRequest): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, request);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
