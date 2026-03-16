import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../models/article.model';
import { SummarizerService } from '../../services/summarizer.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  @Input() article!: Article;
  @Output() closed = new EventEmitter<void>();

  summary = '';
  isSummarizing = false;
  showSummary = false;

  constructor(private summarizerService: SummarizerService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    document.body.style.overflow = '';
    this.closed.emit();
  }

  summarize(): void {
    if (this.summary) {
      this.showSummary = !this.showSummary;
      return;
    }
    this.isSummarizing = true;
    // Simulate slight delay for UX feel
    setTimeout(() => {
      this.summary = this.summarizerService.summarize(this.article.content, 4);
      this.showSummary = true;
      this.isSummarizing = false;
    }, 600);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close();
    }
  }
}
