# replit.md

## Overview

This is a headless WordPress blog built with Next.js 15 App Router and TypeScript. The application fetches content from a WordPress backend via GraphQL API, providing a fast, modern frontend while leveraging WordPress as a content management system. The project includes Progressive Web App (PWA) capabilities, server-side rendering, and a responsive design using Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 15** with App Router for server-side rendering and routing
- **TypeScript** for type safety across the codebase
- **Tailwind CSS** for utility-first styling
- **React 19** as the UI library

### Content Management
- **WordPress** serves as the headless CMS backend
- **WPGraphQL plugin** exposes WordPress content through GraphQL API
- Content is fetched at request time using `graphql-request` library

### Routing Structure
- `/` - Home page with hero, social icons, categories, and latest posts
- `/blog` - Blog listing with search and pagination
- `/blog/[slug]` - Individual post pages with dynamic metadata
- `/about` - Static about page
- `/contact` - Static contact page
- `/rss.xml` - Dynamic RSS feed generation

### Data Fetching Pattern
- GraphQL queries are centralized in `src/lib/queries.ts`
- Type definitions for WordPress data in `src/lib/types.ts`
- Server-side data fetching in page components using async/await
- Cursor-based pagination for blog posts

### PWA Configuration
- Uses `@ducanh2912/next-pwa` for Progressive Web App features
- Service worker disabled in development mode
- Manifest file at `public/manifest.json`

### Component Architecture
- Reusable components in `src/components/`
- Client components marked with `'use client'` directive (e.g., SearchBar)
- Server components handle data fetching by default

## External Dependencies

### WordPress Backend
- Requires WordPress installation with WPGraphQL plugin
- GraphQL endpoint: `{WORDPRESS_URL}/graphql`
- Environment variable: `WORDPRESS_URL` must be set to the WordPress domain

### Environment Configuration
```
WORDPRESS_URL="https://yourwebsite.com"
```

### Third-Party Libraries
- `graphql-request` - Lightweight GraphQL client for API calls
- `@ducanh2912/next-pwa` - PWA support for Next.js
- `tailwindcss` - Utility CSS framework
- `postcss` - CSS transformation tool

### Development Dependencies
- ESLint with Next.js configuration for code quality
- TypeScript for static type checking