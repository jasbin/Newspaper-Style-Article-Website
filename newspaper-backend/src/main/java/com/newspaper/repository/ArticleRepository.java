package com.newspaper.repository;

import com.newspaper.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    Page<Article> findByCategory(String category, Pageable pageable);

    @Query("SELECT a FROM Article a WHERE " +
           "LOWER(a.title) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
           "LOWER(a.author) LIKE LOWER(CONCAT('%',:kw,'%'))")
    Page<Article> searchArticles(@Param("kw") String keyword, Pageable pageable);

    @Query("SELECT a FROM Article a WHERE " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%',:kw,'%'))) " +
           "AND LOWER(a.category) = LOWER(:category)")
    Page<Article> searchByKeywordAndCategory(@Param("kw") String keyword,
                                              @Param("category") String category,
                                              Pageable pageable);

    List<Article> findByFeaturedTrue();

    @Query("SELECT DISTINCT a.category FROM Article a ORDER BY a.category")
    List<String> findDistinctCategories();
}
