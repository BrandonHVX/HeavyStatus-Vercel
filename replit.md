# Political Aficionado - Headless WordPress Blog

## Overview

Political Aficionado is a headless WordPress blog built with Next.js 15 App Router and TypeScript. The application fetches content from a WordPress backend via GraphQL. It functions as a news/blog platform with features including article browsing, category filtering, search functionality, RSS feeds, and SEO optimization for Google News. **All pages are unstyled** bare HTML ready for redesign.

## User Preferences

Preferred communication style: Simple, everyday language.

## Current State

- **All pages unstyled**: Every page renders as bare HTML with no className attributes (except required exceptions below)
- **globals.css**: Contains only `@tailwind base/components/utilities` directives
- **tailwind.config.ts**: Default config, no custom extensions
- **Header**: Unstyled — site title link, nav links with active indicator via brackets `[Page]`, hamburger text `☰`, search `🔍`, auth/session display, slide-out mobile menu, search modal with categorized results
- **Footer**: Unstyled — navigation links, policies, copyright
- **LayoutWrapper**: Shows Header and Footer on ALL pages (no exceptions)
- **Homepage (`/`)**: Unstyled — h1 "Headlines", category nav links, post list with images/titles/excerpts/authors/dates
- **Featured (`/featured`)**: Unstyled — post list with images/titles/excerpts
- **Explore (`/explore`)**: Unstyled — search input, categories, tags, recent posts
- **Live (`/live`)**: Unstyled — featured post image/title/excerpt, description with read more, Up Next list with autoplay checkbox and save buttons
- **Article (`/[slug]`)**: Unstyled — back button, image, title, author, content, tags, share buttons, related posts
- **Data layer**: Fully intact — GraphQL queries, API endpoints, search, pagination, auth, Stripe all work
- **nuws-helpers.tsx**: Contains only pure utility functions (timeAgo, fmtMonthYear, commentCount, stripHtml, postImg, postHref, postCat, postCatSlug, postAuthor, postAuthorSlug)
- **Exceptions**: `className="adsbygoogle"` kept in AdUnit.tsx (required by Google AdSense), `className="user-menu-container"` kept in header.tsx (used for click-outside detection), `className='article'` kept in [slug]/page.tsx (for WordPress content styling)

## System Architecture

### Frontend Framework
- **Next.js 15** with App Router for server-side rendering and routing
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** available (base directives loaded, no custom config)

### Content Management
- **Headless WordPress** as the CMS backend
- **WPGraphQL plugin** required on WordPress to expose content via GraphQL
- Content is fetched server-side using `graphql-request` library

### Data Fetching Pattern
- GraphQL queries are centralized in `src/lib/queries.ts`
- Types are defined in `src/lib/types.ts` (Post, Category, Author)
- Server components fetch data directly without client-side state management
- Search API endpoint at `/api/search` for real-time search functionality

### Progressive Web App (PWA)
- Configured via `@ducanh2912/next-pwa`
- Service worker caches images, videos, and API responses
- Manifest file at `public/manifest.json`

### Routing Structure
- `/` - Headlines page (unstyled post listing with category filter)
- `/featured` - Featured posts page (unstyled, top stories / editor picks)
- `/explore` - Explore page (unstyled, search bar and popular categories/tags)
- `/live` - Live page (unstyled, featured post + up next list, revalidates every 30s)
- `/[slug]` - Individual article pages with SEO metadata (root-level routing)
- `/headlines` - Redirects to `/` (preserves query params)
- `/headlines/[slug]` - Redirects to `/[slug]`
- `/posts` - Redirects to `/`
- `/posts/[slug]` - Redirects to `/[slug]`
- `/gallery` - Photo gallery page
- `/about`, `/contact` - Static pages
- `/privacy`, `/editorial-policy`, `/corrections` - Policy pages
- `/rss.xml` - RSS feed route
- `/news-sitemap.xml` - Google News sitemap
- `/sitemap.ts` - Dynamic sitemap generation
- `/author/[slug]` - Author profile pages with article listings

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

### Key Components
- `Header` - Unstyled: site title, nav links, search modal, mobile menu, auth display
- `Footer` - Unstyled: navigation links, policies, copyright
- `BottomNav` - Unstyled: simple text nav links (not currently rendered)
- `LiveClientWrapper` - Unstyled: featured post display, description expand, Up Next list with autoplay/save
- `BackButton` - Unstyled: client-side back navigation (router.back with fallback)
- `ShareButtons` - Unstyled: social sharing links (X, Facebook, LinkedIn, WhatsApp, Email, copy)
- `PhotoGallery` - Unstyled: image grid with lightbox (keyboard navigation, inline styles for lightbox only)
- `Paywall` / `PaywallCheck` - Unstyled: subscription gating for exclusive content
- `AdUnit` - Google AdSense ad placements (keeps `adsbygoogle` className)
- `SearchBar` - Unstyled: standalone search with debounce and dropdown results

### Utility Functions (src/lib/nuws-helpers.tsx)
- `timeAgo(dateStr)` - Relative time formatting
- `fmtMonthYear(dateStr)` - Month/year formatting
- `commentCount(post)` - Deterministic comment count from post ID
- `stripHtml(html, maxLen)` - Strip HTML tags and truncate
- `postImg(post)` - Get featured image URL with fallback
- `postHref(post)` - Get post URL path
- `postCat(post)` / `postCatSlug(post)` - Get category name/slug
- `postAuthor(post)` / `postAuthorSlug(post)` - Get author name/slug

## External Dependencies

### WordPress Backend
- **URL**: Configured via `WORDPRESS_URL` environment variable (defaults to `https://heavy-status.com`)
- **Required Plugin**: WPGraphQL (https://www.wpgraphql.com/)
- **GraphQL Endpoint**: `${WORDPRESS_URL}/graphql`

### NPM Packages
- `graphql-request` - GraphQL client for fetching WordPress content
- `@ducanh2912/next-pwa` - PWA support with Workbox
- `gsap` - GreenSock Animation Platform (installed but not currently used)
- `next-auth` - Authentication
- `@stripe/stripe-js` / `stripe` - Payment processing

### Environment Variables
- `WORDPRESS_URL` - Base URL for the WordPress installation (required for GraphQL queries)
- `DATABASE_URL` - PostgreSQL connection string (auto-set by Replit)
- `NEXTAUTH_SECRET` - Secret for NextAuth.js JWT signing
- `NEXTAUTH_URL` - Base URL for NextAuth.js callbacks
- `STRIPE_SECRET_KEY` - Stripe API secret key (managed via Replit integration)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `SUBSCRIPTION_PRICE_ID` - Stripe price ID for the $9.99/month subscription
- `NEXT_PUBLIC_ONESIGNAL_APP_ID` - OneSignal App ID for push notifications
- `ONESIGNAL_REST_API_KEY` - OneSignal REST API key for sending notifications
- `NEXT_PUBLIC_AD_SLOT_ABOVE_FOLD` - AdSense slot ID for above-fold ad placement
- `NEXT_PUBLIC_AD_SLOT_IN_CONTENT` - AdSense slot ID for in-content ad placement
- `NEXT_PUBLIC_AD_SLOT_SIDEBAR` - AdSense slot ID for sidebar ad placement (optional)
