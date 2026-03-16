import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';
import { Article, ArticleRequest } from '../../models/article.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  articles: Article[] = [];
  loading = false;
  error = '';
  successMsg = '';

  showForm = false;
  editingId: number | null = null;
  deleteConfirmId: number | null = null;

  form: ArticleRequest = this.emptyForm();

  categories = ['Technology', 'Business', 'Science', 'Health', 'Community', 'Politics', 'Sports', 'Culture', 'Opinion'];

  constructor(
    private articleService: ArticleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading = true;
    this.articleService.getArticles('', '', 0, 100).subscribe({
      next: (res) => {
        this.articles = res.articles;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load articles.';
        this.loading = false;
      }
    });
  }

  openCreate(): void {
    this.form = this.emptyForm();
    this.editingId = null;
    this.showForm = true;
    this.error = '';
    this.successMsg = '';
  }

  openEdit(article: Article): void {
    this.form = {
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      category: article.category,
      author: article.author || '',
      imageUrl: article.imageUrl || '',
      featured: article.featured
    };
    this.editingId = article.id;
    this.showForm = true;
    this.error = '';
    this.successMsg = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.form = this.emptyForm();
  }

  saveArticle(): void {
    if (!this.form.title || !this.form.content || !this.form.category) {
      this.error = 'Title, content and category are required.';
      return;
    }
    this.loading = true;
    this.error = '';

    const request$ = this.editingId
      ? this.articleService.updateArticle(this.editingId, this.form)
      : this.articleService.createArticle(this.form);

    request$.subscribe({
      next: () => {
        this.successMsg = this.editingId ? 'Article updated successfully!' : 'Article published successfully!';
        this.showForm = false;
        this.editingId = null;
        this.form = this.emptyForm();
        this.loadArticles();
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to save article.';
        this.loading = false;
      }
    });
  }

  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
  }

  deleteArticle(id: number): void {
    this.articleService.deleteArticle(id).subscribe({
      next: () => {
        this.successMsg = 'Article deleted.';
        this.deleteConfirmId = null;
        this.loadArticles();
      },
      error: () => {
        this.error = 'Failed to delete article.';
        this.deleteConfirmId = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private emptyForm(): ArticleRequest {
    return { title: '', content: '', excerpt: '', category: '', author: '', imageUrl: '', featured: false };
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
