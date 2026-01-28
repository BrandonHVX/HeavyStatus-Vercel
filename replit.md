# replit.md

## Overview

This is a headless WordPress blog built with Next.js 15 App Router and TypeScript, featuring a premium editorial design inspired by Vogue magazine. The application fetches content exclusively from heavy-status.com via GraphQL API, providing a fast, modern frontend while leveraging WordPress as a content management system. The project includes Progressive Web App (PWA) capabilities, advanced SEO optimization for Google/Yahoo News inclusion, Yoast SEO integration, and a fully responsive design using Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Jan 28, 2026**: Added dynamic search bar with live typing and autocomplete for posts, categories, and tags from WordPress GraphQL
- **Jan 28, 2026**: Complete UI/UX redesign to match Vogue magazine editorial style with clean white background, serif typography, centered logo with wide letter spacing, uppercase navigation, and elegant article grid layout
- **Jan 28, 2026**: Fixed responsive design for mobile, centered mobile logo, removed Inter font in favor of system serif/sans fonts
- **Jan 28, 2026**: Added featured image support via GraphQL with proper Next.js Image optimization

## System Architecture

### Frontend Framework
- **Next.js 15** with App Router for server-side rendering and routing
- **TypeScript** for type safety across the codebase
- **Tailwind CSS** for utility-first styling with custom Vogue-inspired theme
- **React 19** as the UI library

### Design System (Vogue-Inspired)
- **Background**: Pure white (#ffffff)
- **Primary text**: Black (#000000)
- **Accent color**: Burgundy red (#c41e3a)
- **Typography**: Georgia serif for headlines, Helvetica Neue sans-serif for body
- Centered logo with wide letter spacing (0.3em)
- Uppercase navigation and category labels with tracking
- Clean editorial grid layouts with generous whitespace
- Minimalist hover effects (color transition to accent)

### Content Management
- **WordPress** serves as the headless CMS backend (heavy-status.com)
- **WPGraphQL plugin** exposes WordPress content through GraphQL API
- **Yoast SEO plugin** provides meta titles, descriptions, and social images
- Content is fetched at request time using `graphql-request` library

### Routing Structure
- `/` - Home page with hero, category bar, and latest posts
- `/blog` - Blog listing with search and cursor-based pagination
- `/blog/[slug]` - Individual post pages with dynamic Yoast SEO metadata
- `/about` - About page with technology overview
- `/contact` - Contact page with contact form
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
