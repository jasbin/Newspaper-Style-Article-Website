# 🗞️ The Daily Chronicle
### A Retro Newspaper-Style Article Sharing Website

**The Daily Chronicle** is a full-stack, retro-themed article sharing platform designed to evoke the classic feel of print journalism while delivering a modern web experience. Built with Angular 17 and Spring Boot 3.2, it offers a seamless reading experience complete with real-time search, category filtering, and an integrated offline AI summarizer that gives readers a quick story overview. The project includes a complete JWT-secured admin panel, allowing creators to effortlessly publish, manage, and feature content on a responsive, beautifully styled front page.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Java Version | Java 17 LTS |
| Backend | Spring Boot 3.2 |
| Security | Spring Security + JWT |
| Database | MySQL + Spring Data JPA |
| Build Tool | Maven |
| Frontend | Angular 17 |
| HTTP Client | Angular HttpClient |
| Styling | SCSS (Retro Newspaper theme) |
| Summarizer | Free offline JS (extractive) |

---

## Project Structure

```
newspaper-project/
├── newspaper-backend/          ← Spring Boot API (port 8080)
│   ├── src/main/java/com/newspaper/
│   │   ├── config/             ← Security, CORS, DataInitializer
│   │   ├── controller/         ← REST endpoints
│   │   ├── dto/                ← Java 17 Records
│   │   ├── entity/             ← JPA entities
│   │   ├── repository/         ← Spring Data JPA
│   │   ├── security/           ← JWT service & filter
│   │   └── service/            ← Business logic
│   └── src/main/resources/
│       └── application.properties
│
├── newspaper-frontend/         ← Angular 17 (port 4200)
│   └── src/app/
│       ├── components/         ← Navbar, HeroSection, ArticleCard, ArticleDetail
│       ├── pages/              ← Home, Login, Admin, ArticleDetailPage
│       ├── services/           ← ArticleService, AuthService, SummarizerService
│       ├── interceptors/       ← JWT auto-attach interceptor
│       ├── guards/             ← AuthGuard for admin route
│       └── models/             ← TypeScript interfaces
│
└── database/
    └── setup.sql               ← MySQL setup script
```

---

## Setup Instructions

### Step 1 — MySQL Setup

```sql
-- Run in MySQL Workbench or CLI:
mysql -u root -p < database/setup.sql
```

Or manually:
```sql
CREATE DATABASE newspaper_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Step 2 — Configure Backend

Edit `newspaper-backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Or use the dedicated user from setup.sql:
```properties
spring.datasource.username=newspaper_user
spring.datasource.password=newspaper_pass123
```

---

### Step 3 — Run the Backend

```bash
cd newspaper-backend
mvn spring-boot:run
```

Backend starts at: http://localhost:8080

Spring Boot will:
- Auto-create all database tables
- Seed a default admin user: `admin / admin123`
- Seed 5 sample articles

---

### Step 4 — Run the Frontend (Development)

```bash
cd newspaper-frontend
npm install
ng serve
```

Frontend starts at: http://localhost:4200

---

### Step 5 — Build for Production (Deploy with Spring Boot)

```bash
cd newspaper-frontend
ng build --configuration production
```

Copy the build output into Spring Boot's static folder:

```bash
cp -r dist/newspaper-frontend/* ../newspaper-backend/src/main/resources/static/
```

Then rebuild and run Spring Boot — everything served from http://localhost:8080

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login → returns JWT |
| GET | /api/articles | Get articles (supports ?keyword=&category=&page=&size=) |
| GET | /api/articles/{id} | Get single article |
| GET | /api/articles/featured | Get featured articles |
| GET | /api/articles/categories | Get all categories |

### Protected (Requires JWT Bearer Token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/articles | Create article |
| PUT | /api/articles/{id} | Update article |
| DELETE | /api/articles/{id} | Delete article |
| POST | /api/auth/register | Create new admin user |

---

## Default Credentials

```
Username: admin
Password: admin123
```

⚠️ Change these in production via the Admin panel or database.

---

## Features

- ✅ Retro newspaper design (Playfair Display, UnifrakturMaguntia fonts)
- ✅ Featured hero section on homepage
- ✅ Article grid with category filtering
- ✅ Real-time search with debounce
- ✅ Article detail modal with column layout
- ✅ Free offline AI summarizer (extractive, no API key needed)
- ✅ JWT authentication for admin
- ✅ Full CRUD admin panel (create, edit, delete, feature)
- ✅ Pagination
- ✅ Responsive design
- ✅ Angular compiles to static files for Spring Boot hosting

---

## Production Deployment

1. Build Angular: `ng build --configuration production`
2. Copy `dist/` → `src/main/resources/static/`
3. Add Spring Boot catch-all route for Angular routing:

```java
// Add to a controller:
@GetMapping(value = "/{path:[^\\.]*}")
public String redirect() {
    return "forward:/index.html";
}
```

4. `mvn clean package`
5. `java -jar target/newspaper-backend-1.0.0.jar`

Everything runs on a single port. ✅
