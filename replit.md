# Political Aficionado - Headless WordPress Blog

## Overview

Political Aficionado is a headless WordPress blog built with Next.js 15 App Router and TypeScript. The application fetches content from a WordPress backend via GraphQL and presents it through a modern, mobile-app-inspired frontend with card-based layouts, EB Garamond typography, and Inter body text. It functions as a news/blog platform with features including article browsing, category filtering, search functionality, RSS feeds, and SEO optimization for Google News.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Modern News & Article Mobile App UI Kit style - card-based layouts, rounded corners, category chips, read time indicators, mobile bottom navigation, frosted glass header.

## Design System

### Typography
- **Headings**: EB Garamond (serif) via `font-heading` class
- **Body text**: Inter (sans-serif)
- **Accent color**: #e94560 (pink-red)

### Visual Tokens
- **Card radius**: 16px (`rounded-card`)
- **Card shadow**: `0 2px 12px rgba(0,0,0,0.06)`
- **Background**: #f8fafc (light gray)
- **Surfaces**: white cards on gray background
- **Category chips**: Pill-shaped with accent-light bg + accent text

### CSS Utility Classes
- `.card` / `.card-sm` / `.card-flat` - Card containers with shadows and hover effects
- `.category-chip` / `.category-chip-sm` - Pill-shaped category labels
- `.read-time` - Read time indicator with dot separator
- `.section-header` / `.section-title` / `.section-link` - Section layout helpers
- `.bottom-nav-item` - Mobile bottom nav styling
- `.trending-dot` - Pulsing accent dot for trending section
- `.nb-category` - Category labels (uppercase, accent color, small)
- `.nb-title` - Article titles (heading font, hover accent)
- `.nb-byline` - Author/date lines (small, uppercase, tracking)
- `.nb-section-title` - Section headers with bottom border
- `.nb-card` - Card wrapper with hover effects
- `.nb-divider` / `.nb-divider-dark` - Horizontal dividers
- `.back-button` - Back navigation styling
- `.hero-overlay` - Gradient overlay for hero images
- `.img-hover-scale` - Scale images on hover
- `.text-limit-2-row` / `.text-limit-3-row` - Text clamping

### Key Components
- `PageTransition` - GSAP fade-in animation on route changes
- `BackButton` - Client-side back navigation (uses router.back() with fallback)
- `Header` - Responsive header with mobile slide-out menu
- `Footer` - Dark-themed footer with navigation links

## System Architecture

### Frontend Framework
- **Next.js 15** with App Router for server-side rendering and routing
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** for styling with NewsBoard-inspired custom theme
- **GSAP** for page transition animations

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
- `/` - Homepage with featured post hero and recent stories sidebar
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

## Recent Changes

### February 25, 2026 (v6 - Citizens Lens Dashboard Homepage)
- Homepage redesigned to match CitizensLens 3-column dashboard layout
- 3-column grid: Left (hero + lifestyle + global) | Center (opinion + lifestyle advocacy + tech) | Right sidebar (most viewed + trending lists)
- Cards use white bg with subtle borders (#e7e7e7), rounded-[8px], on #f5f5f5 container over #efefef page bg
- Left column: "Politics & Culture" hero card, "Lifestyle & Fairs" 3-col grid (thumb | text-only featured | thumb), "Global Affairs" 3-col thumbnails
- Center column: "Opinion & Analysis" 4-col grid (3 articles + Special feature CTA with blue button), "Lifestyle & Advocacy" 4-col (3 images + Podcast CTA), "Technology & Society" 3-col grid
- Right sidebar: "Most Viewed" and "Trending Now" lists with circular avatar thumbnails
- Georgia serif for featured text blocks, grayscale filter on select images
- Eye/heart stat pills, "Read More" blue buttons (#1f4f93)
- All data from WordPress GraphQL, no hardcoded content
- Removed unused HomeMostPopular, HomeTabs, HomeSearchBar components
- Other pages retain original pink accent styling unchanged

### February 23, 2026 (v2 - Modern App UI Kit)
- Complete UX/UI overhaul to match Modern News & Article Mobile App UI Kit
- New design system: rounded cards (16px), Inter body font, pink-red accent (#e94560), subtle shadows
- Frosted glass header with backdrop-blur and pill-shaped navigation items
- Mobile bottom navigation bar (BottomNav) with filled/outlined icon states
- Homepage redesign: hero card, horizontal "Trending Now" carousel, list-style "Latest News", topic pills, card grid
- Category chips (pill-shaped), read time indicators, time-ago labels throughout
- Article page: author avatar circle, category chips, rounded featured images
- Updated BackButton with circular icon + label design
- Updated latest-posts component with modern card grid and styled pagination buttons
- Light gray background (#f8fafc) with white card surfaces
- Body padding for mobile bottom nav, scrollbar styling

### February 23, 2026 (v1 - NewsBoard)
- Initial NewsBoard-inspired redesign with EB Garamond fonts
- Added GSAP page transitions via PageTransition component
- Added BackButton component to all sub-pages
- Fixed CSS @import ordering for Google Fonts
- Updated next.config with proper allowedDevOrigins for Replit

### February 4, 2026
- Added ads.txt and robots.txt for AdSense verification and crawler guidance
- Created AdUnit component for ad placements (above-fold + in-content)
- Built comprehensive About page with mission, coverage areas, and editorial standards
- Added PWA icons (72px to 512px) for app install prompts
- Updated manifest.json with proper icon references
- Author pages now display Gravatar avatars and link from article bylines

### February 2, 2026 (Update)
- Removed Google OAuth (using email/password only now)
- Added ISR (Incremental Static Regeneration) with 60-second revalidation for homepage and post pages
- Pages load instantly from cache while staying fresh with automatic background updates

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
- `gsap` - GreenSock Animation Platform for page transitions
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
