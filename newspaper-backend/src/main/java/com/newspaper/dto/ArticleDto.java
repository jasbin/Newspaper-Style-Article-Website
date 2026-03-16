package com.newspaper.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

public class ArticleDto {

    public record ArticleRequest(
            @NotBlank(message = "Title is required") String title,
            @NotBlank(message = "Content is required") String content,
            String excerpt,
            @NotBlank(message = "Category is required") String category,
            String author,
            String imageUrl,
            boolean featured
    ) {}

    public record ArticleResponse(
            Long id,
            String title,
            String content,
            String excerpt,
            String category,
            String author,
            String imageUrl,
            boolean featured,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {}

    public record PagedArticleResponse(
            List<ArticleResponse> articles,
            int currentPage,
            int totalPages,
            long totalElements,
            boolean hasNext,
            boolean hasPrevious
    ) {}
}
