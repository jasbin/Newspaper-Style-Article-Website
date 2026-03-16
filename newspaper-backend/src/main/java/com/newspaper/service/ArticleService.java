package com.newspaper.service;

import com.newspaper.dto.ArticleDto.*;
import com.newspaper.entity.Article;
import com.newspaper.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    public PagedArticleResponse getArticles(String keyword, String category, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<Article> result;

        boolean hasKeyword = keyword != null && !keyword.isBlank();
        boolean hasCategory = category != null && !category.isBlank() && !category.equalsIgnoreCase("All");

        if (hasKeyword && hasCategory) {
            result = articleRepository.searchByKeywordAndCategory(keyword, category, pageable);
        } else if (hasKeyword) {
            result = articleRepository.searchArticles(keyword, pageable);
        } else if (hasCategory) {
            result = articleRepository.findByCategory(category, pageable);
        } else {
            result = articleRepository.findAll(pageable);
        }

        List<ArticleResponse> articles = result.getContent().stream()
                .map(this::toResponse)
                .toList();

        return new PagedArticleResponse(
                articles,
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements(),
                result.hasNext(),
                result.hasPrevious()
        );
    }

    public ArticleResponse getArticleById(Long id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new com.newspaper.exception.ResourceNotFoundException("Article not found with id: " + id));
        return toResponse(article);
    }

    public List<ArticleResponse> getFeaturedArticles() {
        return articleRepository.findByFeaturedTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<String> getCategories() {
        return articleRepository.findDistinctCategories();
    }

    public ArticleResponse createArticle(ArticleRequest request) {
        Article article = Article.builder()
                .title(request.title())
                .content(request.content())
                .excerpt(request.excerpt())
                .category(request.category())
                .author(request.author())
                .imageUrl(request.imageUrl())
                .featured(request.featured())
                .build();
        return toResponse(articleRepository.save(article));
    }

    public ArticleResponse updateArticle(Long id, ArticleRequest request) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new com.newspaper.exception.ResourceNotFoundException("Article not found with id: " + id));
        article.setTitle(request.title());
        article.setContent(request.content());
        article.setExcerpt(request.excerpt());
        article.setCategory(request.category());
        article.setAuthor(request.author());
        article.setImageUrl(request.imageUrl());
        article.setFeatured(request.featured());
        return toResponse(articleRepository.save(article));
    }

    public void deleteArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new com.newspaper.exception.ResourceNotFoundException("Article not found with id: " + id);
        }
        articleRepository.deleteById(id);
    }

    private ArticleResponse toResponse(Article a) {
        return new ArticleResponse(
                a.getId(), a.getTitle(), a.getContent(), a.getExcerpt(),
                a.getCategory(), a.getAuthor(), a.getImageUrl(),
                a.isFeatured(), a.getCreatedAt(), a.getUpdatedAt()
        );
    }
}
