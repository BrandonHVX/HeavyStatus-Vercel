# Heavy Status - Headless WordPress Blog

## Overview

Heavy Status is a headless WordPress blog built with Next.js 15 App Router and TypeScript. The application fetches content from a WordPress backend via GraphQL and presents it through a modern, Vogue-inspired frontend. It functions as a news/blog platform with features including article browsing, category filtering, search functionality, RSS feeds, and SEO optimization for Google News.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 15** with App Router for server-side rendering and routing
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** for styling with a custom theme (serif fonts, minimal design)

### Content Management
- **Headless WordPress** as the CMS backend
- **WPGraphQL plugin** required on WordPress to expose content via GraphQL
- Content is fetched server-side using `graphql-request` library

### Data Fetching Pattern
- GraphQL queries are centralized in `src/lib/queries.ts`
- Types are defined in `src/lib/types.ts` (Post, Category)
- Server components fetch data directly without client-side state management
- Search API endpoint at `/api/search` for real-time search functionality

### Progressive Web App (PWA)
- Configured via `@ducanh2912/next-pwa`
- Service worker caches images, videos, and API responses
- Manifest file at `public/manifest.json`

### Routing Structure
- `/` - Homepage with featured post and recent stories
- `/blog` - Article listing with pagination, search, and category filtering
- `/blog/[slug]` - Individual article pages with SEO metadata
- `/about`, `/contact` - Static pages
- `/rss.xml` - RSS feed route
- `/news-sitemap.xml` - Google News sitemap
- `/sitemap.ts` - Dynamic sitemap generation

### SEO Implementation
- Dynamic metadata generation using WordPress SEO fields
- OpenGraph and Twitter card support
- Google News sitemap for news indexing
- RSS feed for syndication

## External Dependencies

### WordPress Backend
- **URL**: Configured via `WORDPRESS_URL` environment variable (defaults to `https://heavy-status.com`)
- **Required Plugin**: WPGraphQL (https://www.wpgraphql.com/)
- **GraphQL Endpoint**: `${WORDPRESS_URL}/graphql`

### NPM Packages
- `graphql-request` - GraphQL client for fetching WordPress content
- `@ducanh2912/next-pwa` - PWA support with Workbox
- `@octokit/rest` - GitHub API client (present but usage not visible in provided files)

### Environment Variables
- `WORDPRESS_URL` - Base URL for the WordPress installation (required for GraphQL queries)