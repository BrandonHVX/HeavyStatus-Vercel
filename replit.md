# Political Aficionado - Headless WordPress Blog

## Overview

Political Aficionado is a headless WordPress blog built with Next.js 15 App Router and TypeScript. The application fetches content from a WordPress backend via GraphQL and presents it through a modern, Vogue-inspired frontend. It functions as a news/blog platform with features including article browsing, category filtering, search functionality, RSS feeds, and SEO optimization for Google News.

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
- `/[slug]` - Individual article pages with SEO metadata (root-level routing)
- `/headlines` - Article listing with pagination, search, and category filtering
- `/headlines/[slug]` - Redirects to `/[slug]`
- `/posts` - Redirects to `/headlines`
- `/posts/[slug]` - Redirects to `/[slug]`
- `/explore` - Explore page with search bar and popular categories/tags
- `/blog` - Legacy article listing (redirects available)
- `/blog/[slug]` - Legacy individual article pages
- `/about`, `/contact` - Static pages
- `/rss.xml` - RSS feed route
- `/news-sitemap.xml` - Google News sitemap
- `/sitemap.ts` - Dynamic sitemap generation

### Authentication & Subscriptions
- **NextAuth.js** for authentication (email/password)
- **Stripe** for subscription payments ($9.99/month)
- **PostgreSQL** (Replit built-in) for user/subscription data
- Key files: `src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/stripe.ts`

### API Endpoints
- `/api/search` - Real-time search for posts, categories, and tags
- `/api/topics` - Fetches all categories and tags for the explore page
- `/api/init` - Initialize database tables (run once on setup)
- `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `/api/stripe/checkout` - Create Stripe checkout session for subscriptions
- `/api/stripe/portal` - Create Stripe customer portal session
- `/api/stripe/webhook` - Handle Stripe webhook events
- `/tag/notify` - Webhook endpoint for OneSignal push notifications

## Recent Changes

### February 2, 2026
- Implemented subscription system with Stripe payments ($9.99/month)
- Added NextAuth.js authentication (email/password + Google OAuth)
- Created PostgreSQL database schema using Replit built-in database
- Built subscription pages: `/subscribe`, `/account`, `/auth/signin`, `/auth/register`
- Added `Paywall` component for exclusive content gating
- Stripe webhooks configured for subscription lifecycle management
- Added Google OAuth sign-in support
- Created `SubscriptionPrompt` component - shows centered modal after 5 seconds asking visitors to register

### February 1, 2026
- Changed post routes from `/headlines/{slug}` to `/{slug}` (root-level routing)
- Added redirects from `/headlines/[slug]` and `/posts/[slug]` to `/[slug]`
- Created Explore page at `/explore` with dynamic search bar and popular categories/tags
- Added `/api/topics` endpoint to fetch all categories and tags
- Added Explore link to main navigation and mobile menu

### January 31, 2026
- Fixed post routing: Links now correctly point to `/headlines/{slug}` instead of `/{slug}`
- Added `/posts` and `/posts/[slug]` redirects to `/headlines` routes
- Updated Next.js from 15.0.4 to 15.5.11 (security fix for CVE-2025-66478)
- Configured OneSignal push notifications for posts tagged with "notify"
- OneSignal API endpoint updated to `https://api.onesignal.com/notifications`

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
- `DATABASE_URL` - PostgreSQL connection string (auto-set by Replit)
- `NEXTAUTH_SECRET` - Secret for NextAuth.js JWT signing
- `NEXTAUTH_URL` - Base URL for NextAuth.js callbacks
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional, for Google sign-in)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional)
- `STRIPE_SECRET_KEY` - Stripe API secret key (managed via Replit integration)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `SUBSCRIPTION_PRICE_ID` - Stripe price ID for the $9.99/month subscription