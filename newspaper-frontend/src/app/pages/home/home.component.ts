import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { Article, PagedArticleResponse } from '../../models/article.model';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { ArticleDetailComponent } from '../../components/article-detail/article-detail.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ArticleCardComponent, HeroComponent, ArticleDetailComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredArticles: Article[] = [];
  pagedResponse: PagedArticleResponse | null = null;
  categories: string[] = [];
  selectedCategory = 'All';
  searchKeyword = '';
  currentPage = 0;
  pageSize = 9;
  loading = false;
  error = '';
  selectedArticle: Article | null = null;
  Math = Math;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeatured();
    this.loadArticles();

    // Debounce search input
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadArticles();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFeatured(): void {
    this.articleService.getFeaturedArticles().subscribe({
      next: (articles) => this.featuredArticles = articles,
      error: () => {}
    });
  }

  loadCategories(): void {
    this.articleService.getCategories().subscribe({
      next: (cats) => this.categories = ['All', ...cats],
      error: () => {}
    });
  }

  loadArticles(): void {
    this.loading = true;
    this.error = '';
    this.articleService.getArticles(
      this.searchKeyword,
      this.selectedCategory,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.pagedResponse = response;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load articles. Please try again.';
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchKeyword);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 0;
    this.loadArticles();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openArticle(article: Article): void {
    this.selectedArticle = article;
  }

  closeArticle(): void {
    this.selectedArticle = null;
  }

  get pages(): number[] {
    if (!this.pagedResponse) return [];
    return Array.from({ length: this.pagedResponse.totalPages }, (_, i) => i);
  }
}
