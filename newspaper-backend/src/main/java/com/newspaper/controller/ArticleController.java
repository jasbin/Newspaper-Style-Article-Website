package com.newspaper.controller;

import com.newspaper.dto.ArticleDto.*;
import com.newspaper.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    // GET /api/articles?keyword=&category=&page=0&size=10&sortBy=createdAt
    @GetMapping
    public ResponseEntity<PagedArticleResponse> getArticles(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy
    ) {
        return ResponseEntity.ok(articleService.getArticles(keyword, category, page, size, sortBy));
    }

    // GET /api/articles/featured
    @GetMapping("/featured")
    public ResponseEntity<List<ArticleResponse>> getFeatured() {
        return ResponseEntity.ok(articleService.getFeaturedArticles());
    }

    // GET /api/articles/categories
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(articleService.getCategories());
    }

    // GET /api/articles/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponse> getArticle(@PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }

    // POST /api/articles (Admin only)
    @PostMapping
    public ResponseEntity<ArticleResponse> createArticle(@Valid @RequestBody ArticleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.createArticle(request));
    }

    // PUT /api/articles/{id} (Admin only)
    @PutMapping("/{id}")
    public ResponseEntity<ArticleResponse> updateArticle(
            @PathVariable Long id,
            @Valid @RequestBody ArticleRequest request
    ) {
        return ResponseEntity.ok(articleService.updateArticle(id, request));
    }

    // DELETE /api/articles/{id} (Admin only)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}
