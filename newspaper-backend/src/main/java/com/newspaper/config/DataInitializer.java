package com.newspaper.config;

import com.newspaper.entity.Article;
import com.newspaper.entity.User;
import com.newspaper.repository.ArticleRepository;
import com.newspaper.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build());
            System.out.println("✅ Default admin created: admin / admin123");
        }

        // Seed sample articles if empty
        if (articleRepository.count() == 0) {
            String[] categories = {"Technology", "Business", "Science", "Community", "Health", "Politics", "Sports", "Culture", "Opinion"};
            for (int i = 1; i <= 100; i++) {
                String cat = categories[i % categories.length];
                articleRepository.save(Article.builder()
                        .title("Sample Article Title " + i)
                        .content("This is the detailed content for sample article " + i + ". It contains enough text to be summarized or read by users. Artificial intelligence, global markets, rainforest discoveries, and Mediterranean diets are all popular topics right now. ".repeat(3))
                        .category(cat)
                        .author("Author " + i)
                        .featured(i <= 3)
                        .build());
            }

            System.out.println("✅ 100 Sample articles seeded successfully");
        }
    }
}
