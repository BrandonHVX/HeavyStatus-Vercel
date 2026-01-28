# replit.md

## Overview

This is a headless WordPress blog built with Next.js 15 App Router and TypeScript, featuring a professional news magazine design inspired by the Zeen News theme. The application fetches content exclusively from heavy-status.com via GraphQL API, providing a fast, modern frontend while leveraging WordPress as a content management system. The project includes Progressive Web App (PWA) capabilities, advanced SEO optimization for Google/Yahoo News inclusion, Yoast SEO integration, and a fully responsive design using Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Jan 28, 2026**: Complete UI/UX redesign to match Zeen News magazine theme with dark header, category navigation bar, featured hero section with image overlays, and card-based post grids
- **Jan 28, 2026**: Fixed pagination query keys for search/category filtering, added featured image support via GraphQL, improved mobile navigation with auto-close on route change
- **Jan 28, 2026**: Added image optimization with sizes prop and priority attributes for LCP

## System Architecture

### Frontend Framework
- **Next.js 15** with App Router for server-side rendering and routing
- **TypeScript** for type safety across the codebase
- **Tailwind CSS** for utility-first styling with custom Zeen News theme
- **React 19** as the UI library

### Design System
- **Primary color**: #1a1a2e (dark navy header)
- **Secondary color**: #16213e (darker navy)
- **Accent color**: #e94560 (red for highlights and CTAs)
- Dark sticky header with site navigation
- Category bar for quick topic access
- Featured hero section with gradient overlays
- Card-based article grids with hover effects

### Content Management
- **WordPress** serves as the headless CMS backend (heavy-status.com)
- **WPGraphQL plugin** exposes WordPress content through GraphQL API
- **Yoast SEO plugin** provides meta titles, descriptions, and social images
- Content is fetched at request time using `graphql-request` library

### Routing Structure
- `/` - Home page with hero, category bar, and latest posts
- `/blog` - Blog listing with search and cursor-based pagination
- `/blog/[slug]` - Individual post pages with dynamic Yoast SEO metadata
- `/about` - About page
- `/contact` - Contact page
- `/rss.xml` - Dynamic RSS feed generation
- `/sitemap.xml` - Dynamic sitemap for SEO
- `/news-sitemap.xml` - Google/Yahoo News sitemap

### Data Fetching Pattern
- GraphQL queries are centralized in `src/lib/queries.ts`
- Type definitions for WordPress data in `src/lib/types.ts`
- Server-side data fetching in page components using async/await
- Cursor-based pagination for blog posts with search/category preservation
- Featured images fetched via `featuredImage.node.sourceUrl`

### SEO Configuration
- Yoast SEO metadata integrated via GraphQL
- OpenGraph and Twitter Card meta tags
- JSON-LD structured data for articles
- Dynamic sitemap and news sitemap generation
- RSS feed for content syndication

### PWA Configuration
- Uses `@ducanh2912/next-pwa` for Progressive Web App features
- Service worker disabled in development mode
- Manifest file at `public/manifest.json`

### Component Architecture
- Reusable components in `src/components/`
- Client components marked with `'use client'` directive (SearchBar, Header with mobile menu)
- Server components handle data fetching by default
- Mobile-first responsive design with accessible navigation

## External Dependencies

### WordPress Backend
- GraphQL endpoint: `https://heavy-status.com/graphql`
- Requires WPGraphQL and Yoast SEO plugins
- Environment variable: `WORDPRESS_URL` defaults to heavy-status.com

### Image Domains
- `heavy-status.com` configured for Next.js Image optimization

### Third-Party Libraries
- `graphql-request` - Lightweight GraphQL client for API calls
- `@ducanh2912/next-pwa` - PWA support for Next.js
- `tailwindcss` - Utility CSS framework
- `postcss` - CSS transformation tool

### Development Dependencies
- ESLint with Next.js configuration for code quality
- TypeScript for static type checking
