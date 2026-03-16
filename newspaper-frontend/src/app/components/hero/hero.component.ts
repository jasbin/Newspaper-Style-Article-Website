import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() articles: Article[] = [];
  @Output() articleClicked = new EventEmitter<Article>();

  get featured(): Article | null {
    return this.articles.length ? this.articles[0] : null;
  }

  get secondary(): Article[] {
    return this.articles.slice(1, 3);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
