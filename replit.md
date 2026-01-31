# replit.md

## Overview

This is a headless WordPress blog built with Next.js 15 App Router and TypeScript, featuring a premium editorial design inspired by Vogue magazine. The application fetches content exclusively from heavy-status.com via GraphQL API, providing a fast, modern frontend while leveraging WordPress as a content management system. The project includes Progressive Web App (PWA) capabilities, advanced SEO optimization for Google/Yahoo News inclusion, Yoast SEO integration, and a fully responsive design using Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Jan 31, 2026**: Added OneSignal push notifications integration:
  - OneSignal SDK for user subscription prompts
  - Service worker at `/public/OneSignalSDKWorker.js`
  - API endpoint `/api/notify` for WordPress webhook integration
  - Sends notifications for posts tagged with "notify"
- **Jan 31, 2026**: Added mobile navigation enhancements (≤768px):
  - Fixed header at top of screen
  - Floating pill-shaped bottom navigation bar with TODAY and HEADLINES
  - iOS-style "Add to Home Screen" notification banner
  - Session-based dismissal (reappears on next visit)
- **Jan 29, 2026**: Complete UI/UX redesign to match Vanity Fair magazine editorial style:
  - Full-width 16:9 hero image with headline/category overlay and gradient
  - Sticky header with centered logo, left navigation, right search/subscribe
  - Top Stories grid (4 columns) below hero
  - Latest Stories section with 16:9 thumbnails and author bylines
  - Most Popular sidebar with 1:1 square images
  - Categories sidebar with tag-style buttons
  - Accent color changed to burgundy red (#c41e3a)
  - ALL CAPS category labels with accent color
  - Author attribution on every article card
  - Article pages with full-width featured image header
- **Jan 28, 2026**: Added dynamic search bar with live typing and autocomplete for posts, categories, and tags from WordPress GraphQL
- **Jan 28, 2026**: Added featured image support via GraphQL with proper Next.js Image optimization

## System Architecture

### Frontend Framework
- **Next.js 14.2.35** with App Router for server-side rendering and routing
- **TypeScript** for type safety across the codebase
- **Tailwind CSS** for utility-first styling with custom Vanity Fair-inspired theme
- **React 18** as the UI library

### Design System (Vanity Fair-Inspired)
- **Background**: Pure white (#ffffff)
- **Primary text**: Black (#000000)
- **Accent color**: Burgundy red (#c41e3a)
- **Typography**: Georgia serif for headlines, Helvetica Neue sans-serif for body
- Centered logo with wide letter spacing (0.25em)
- Sticky header that appears on scroll
- Full-width hero with 16:9 aspect ratio and gradient overlay
- Category labels in ALL CAPS with accent color
- Author bylines on all article cards ("By Author Name")
- 16:9 aspect ratio for article thumbnails
- 1:1 square images for Most Popular section
- Hover effects with smooth image zoom and color transition

### Content Management
- **WordPress** serves as the headless CMS backend (heavy-status.com)
- **WPGraphQL plugin** exposes WordPress content through GraphQL API
- **Yoast SEO plugin** provides meta titles, descriptions, and social images
- Content is fetched at request time using `graphql-request` library

### Routing Structure
- `/` - Home page (TODAY) with hero, category bar, and latest posts
- `/headlines` - Headlines listing with search and cursor-based pagination
- `/headlines/[slug]` - Individual post pages with dynamic Yoast SEO metadata
- `/api/notify` - POST endpoint for WordPress push notification webhook
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
- OneSignal service worker at `public/OneSignalSDKWorker.js`

### Push Notifications (OneSignal)
- App ID stored in `NEXT_PUBLIC_ONESIGNAL_APP_ID` environment variable
- REST API Key stored in `ONESIGNAL_REST_API_KEY` secret
- WordPress webhook calls `/api/notify` endpoint
- Only posts with "notify" tag trigger push notifications

### Component Architecture
- Reusable components in `src/components/`
- Client components marked with `'use client'` directive:
  - `Header` - Navigation with search modal
  - `AddToHomeScreen` - iOS-style PWA install prompt
  - `OneSignalInit` - Push notification SDK initialization
- Server components handle data fetching by default
- Mobile-first responsive design with floating bottom navigation (≤768px)

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
