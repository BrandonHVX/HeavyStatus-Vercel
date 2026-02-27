# Political Aficionado - Headless WordPress Blog

## Overview

Political Aficionado is a headless WordPress blog built with Next.js 15 App Router and TypeScript. The application fetches content from a WordPress backend via GraphQL. It functions as a news/blog platform with features including article browsing, category filtering, search functionality, RSS feeds, and SEO optimization for Google News. The frontend is currently **unstyled** — all Tailwind CSS classes, custom CSS, and layout styling have been stripped to allow a fresh redesign from scratch.

## User Preferences

Preferred communication style: Simple, everyday language.

## Current State

- **globals.css**: Contains only `@tailwind base/components/utilities` directives — no custom CSS
- **tailwind.config.ts**: Default config with only background/foreground CSS variable colors — no custom extensions
- **Homepage**: Unstyled, fetches real WordPress data via `getAllPosts()` and `getCategories()`. Renders Hero, Categories, and remaining posts as plain HTML
- **Headlines Page**: Unstyled, fetches real WordPress data with search/category/pagination support. Uses LatestPosts and Categories components
- **Layout**: LayoutWrapper always shows Header and Footer on all pages. No BottomNav in layout
- **All pages/components**: Unstyled bare HTML with zero className attributes
- **Data layer**: Fully intact — GraphQL queries, API endpoints, search, pagination, auth, Stripe all work
- **nuws-helpers.tsx**: Contains only pure utility functions (timeAgo, fmtMonthYear, commentCount, stripHtml, postImg, postHref, postCat, postCatSlug, postAuthor, postAuthorSlug) — no React components
- **Article content**: WordPress HTML rendered via `dangerouslySetInnerHTML` with a `.article` class on the content div (may need prose styling when redesigning)
- **Exceptions**: `className="adsbygoogle"` kept in AdUnit.tsx (required by Google AdSense), `className="user-menu-container"` kept in header.tsx (used for click-outside detection), `className="article"` kept in [slug]/page.tsx (for WordPress content styling)

## System Architecture

### Frontend Framework
- **Next.js 15** with App Router for server-side rendering and routing
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** available (base directives loaded, no custom config used yet)

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
- `/` - Homepage with post listing from WordPress
- `/[slug]` - Individual article pages with SEO metadata (root-level routing)
- `/headlines` - Article listing with pagination, search, and category filtering
- `/headlines/[slug]` - Redirects to `/[slug]`
- `/posts` - Redirects to `/headlines`
- `/posts/[slug]` - Redirects to `/[slug]`
- `/explore` - Explore page with search bar and popular categories/tags
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

### Key Components (all unstyled)
- `Header` - Site title, nav links, search modal, mobile menu, auth/session
- `Footer` - Navigation links, policies, copyright
- `BackButton` - Client-side back navigation (router.back with fallback)
- `ShareButtons` - Social sharing links (X, Facebook, LinkedIn, WhatsApp, Email, copy)
- `PhotoGallery` - Image grid with lightbox (keyboard navigation)
- `Paywall` / `PaywallCheck` - Subscription gating for exclusive content
- `AdUnit` - Google AdSense ad placements
- `SearchBar` - Standalone search with debounce and dropdown results
- `LatestPosts` - Post grid with pagination (unstyled shell)
- `Hero` - Featured post with sidebar (unstyled shell)
- `Categories` - Category navigation links (unstyled shell)
- `BottomNav` - Bottom navigation (unstyled shell, not used in layout)
- `PullToRefresh`, `SubscriptionPrompt`, `AddToHomeScreen`, `PageTransition` - UI feature shells (not used in layout)

### Utility Functions (src/lib/nuws-helpers.tsx)
- `timeAgo(dateStr)` - Relative time formatting
- `fmtMonthYear(dateStr)` - Month/year formatting
- `commentCount(post)` - Deterministic comment count from post ID
- `stripHtml(html, maxLen)` - Strip HTML tags and truncate
- `postImg(post)` - Get featured image URL with fallback
- `postHref(post)` - Get post URL path
- `postCat(post)` / `postCatSlug(post)` - Get category name/slug
- `postAuthor(post)` / `postAuthorSlug(post)` - Get author name/slug

## Recent Changes

### February 27, 2026 (Complete Strip — Blank Slate)
- Stripped ALL Tailwind CSS classes, custom CSS, and layout styling from every page and component
- globals.css: only `@tailwind base/components/utilities` — removed Inter font import, tap highlight, font smoothing, hide-scrollbar
- tailwind.config.ts: reset to default — removed teal, green custom colors and card box-shadow
- Homepage: rewrote to fetch real WordPress data via getAllPosts/getCategories — removed all hardcoded Nuws UI
- Headlines: rewrote to fetch real WordPress data with search/category/pagination — removed hardcoded static feed
- LayoutWrapper: simplified to always show Header/Footer — removed conditional hiding and BottomNav
- BottomNav: reset to unstyled shell (not used in layout)
- layout.tsx: removed `className="bg-white"` from body
- All pages render as plain unstyled HTML while preserving data fetching, routing, pagination, search, JSON-LD/SEO, AdUnits, ShareButtons

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
