import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { SummarizerService } from '../../services/summarizer.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-article-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: Article | null = null;
  loading = false;
  error = '';
  summary = '';
  isSummarizing = false;
  showSummary = false;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private summarizerService: SummarizerService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.articleService.getArticleById(id).subscribe({
      next: (article) => {
        this.article = article;
        this.loading = false;
      },
      error: () => {
        this.error = 'Article not found.';
        this.loading = false;
      }
    });
  }

  summarize(): void {
    if (!this.article) return;
    if (this.summary) { this.showSummary = !this.showSummary; return; }
    this.isSummarizing = true;
    setTimeout(() => {
      this.summary = this.summarizerService.summarize(this.article!.content, 4);
      this.showSummary = true;
      this.isSummarizing = false;
    }, 600);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  get paragraphs(): string[] {
    return this.article?.content.split('\n\n').filter(p => p.trim()) ?? [];
  }
}
