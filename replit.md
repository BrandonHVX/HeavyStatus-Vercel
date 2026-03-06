# Political Aficionado - Headless WordPress Blog

## Overview

Political Aficionado is a headless WordPress blog built with Next.js 15 App Router and TypeScript. The application fetches content from a WordPress backend via GraphQL. It functions as a news/blog platform with features including article browsing, category filtering, search functionality, RSS feeds, and SEO optimization for Google News. Most pages are **unstyled** bare HTML ready for redesign. The **Live page** (`/live`) has a fully styled dark cinematic video-detail UI.

## User Preferences

Preferred communication style: Simple, everyday language.

## Current State

- **globals.css**: Contains `@tailwind base/components/utilities` directives + Inter font import, tap highlight reset, font smoothing, hide-scrollbar utility
- **tailwind.config.ts**: Extends with teal (#2BBBC0), green (#34C759) colors, card box-shadow, and `bottom-nav: 821px` breakpoint
- **Homepage (`/`)**: Fully styled "Nuws" mobile app UI with live WordPress data. Sections: hero subscription banner, category pills (real categories from WP), Latest Magazines (first 3 posts), Top News (featured card + list items), Popular Authors, Recent Video, inline bottom nav. LayoutWrapper hides Header/Footer on `/`.
- **Live page (`/live`)**: Fully styled dark cinematic video-detail page with hero video player (overlay controls, play/rewind/forward 30s, scrub bar), black background content area (category, headline, author avatar, description with "read more"), Up Next playlist (thumbnails with duration badges, bookmark icons, autoplay toggle). Uses `LiveClientWrapper` client component. LayoutWrapper hides Header/Footer on `/live`.
- **Other pages/components**: Unstyled bare HTML with zero className attributes
- **BottomNav**: Styled fixed bottom nav with 4 tabs (Headlines/Featured/Explore/Live), visible at 820px and below, hidden above 821px
- **Data layer**: Fully intact — GraphQL queries, API endpoints, search, pagination, auth, Stripe all work
- **nuws-helpers.tsx**: Contains only pure utility functions (timeAgo, fmtMonthYear, commentCount, stripHtml, postImg, postHref, postCat, postCatSlug, postAuthor, postAuthorSlug)
- **Article content**: WordPress HTML rendered via `dangerouslySetInnerHTML` with a `.article` class on the content div
- **Exceptions**: `className="adsbygoogle"` kept in AdUnit.tsx (required by Google AdSense), `className="user-menu-container"` kept in header.tsx (used for click-outside detection), `className='article'` kept in [slug]/page.tsx (for WordPress content styling)

## System Architecture

### Frontend Framework
- **Next.js 15** with App Router for server-side rendering and routing
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** available (base directives loaded)

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
- `/` - Headlines page (unstyled post listing with category filter, pagination)
- `/featured` - Featured posts page (unstyled, top stories / editor picks)
- `/explore` - Explore page (unstyled, search bar and popular categories/tags)
- `/live` - Live page (styled dark cinematic video-detail UI, revalidates every 30s)
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

### Bottom Navigation
- 4 tabs with SVG icons: Headlines (`/`), Featured (`/featured`), Explore (`/explore`), Live (`/live`)
- Active state indicator (#007AFF blue) for current page
- Fixed at bottom, visible at 820px width and below, hidden above 821px via `bottom-nav:hidden` Tailwind class
- Rendered in LayoutWrapper on all pages

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
- `Header` - Styled: fixed two-row header. Top bar (white): hamburger + search icons left, "Political Aficionado" centered in serif font with subtitle, social icons + auth right. Bottom bar (dark #1a1a1a): uppercase nav links with active page highlighted in white. Search modal overlay with categorized results. Slide-out mobile menu drawer.
- `Footer` - Unstyled: navigation links, policies, copyright
- `BottomNav` - Styled: fixed bottom nav with 4 tabs, SVG icons, active state, hidden above 821px
- `LiveClientWrapper` - Styled: dark cinematic video player page with Up Next playlist
- `BackButton` - Unstyled: client-side back navigation (router.back with fallback)
- `ShareButtons` - Unstyled: social sharing links (X, Facebook, LinkedIn, WhatsApp, Email, copy)
- `PhotoGallery` - Unstyled: image grid with lightbox (keyboard navigation, inline styles for lightbox)
- `Paywall` / `PaywallCheck` - Subscription gating for exclusive content
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

## Recent Changes

### February 28, 2026 (Full Strip + Live Page Redesign)
- Stripped ALL Tailwind CSS classes and custom CSS from homepage, globals.css, and tailwind.config.ts
- Homepage now renders as plain unstyled HTML with categories, post list, and pagination
- globals.css reduced to only @tailwind directives + Inter font import
- tailwind.config.ts reset to default with only `bottom-nav: 821px` custom breakpoint
- LayoutWrapper simplified: shows Header/Footer on all pages except `/live`; BottomNav on all pages
- BottomNav styled with fixed positioning, visible at 820px and below
- Live page (`/live`) redesigned as dark cinematic video-detail UI matching reference design:
  - Server component fetches posts, passes serialized data to LiveClientWrapper
  - Hero video player with featured post image, overlay transport controls (back, PiP, more)
  - Play button with rewind/forward 30s skip controls
  - Scrub/progress bar with timestamps and fullscreen toggle
  - Black background content area: category label, bold headline, author row with avatar initials
  - Description section with truncation and "read more" blue accent link
  - Up Next playlist with autoplay toggle, compact rows (thumbnail, duration badge, title, category/time, bookmark icon)

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
