import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div>
        <div>
          <Link href="/">Political Aficionado</Link>
          <p>Power. Personality. And freedom of the press.</p>
        </div>

        <div>
          <h4>Navigate</h4>
          <ul>
            <li><Link href="/">Headlines</Link></li>
            <li><Link href="/featured">Featured</Link></li>
            <li><Link href="/explore">Explore</Link></li>
            <li><Link href="/live">Live</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Policies</h4>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/editorial-policy">Editorial Policy</Link></li>
            <li><Link href="/corrections">Corrections</Link></li>
          </ul>
        </div>

        <div>
          <h4>Stay Connected</h4>
          <p>Get the latest stories delivered to your inbox.</p>
          <div>
            <Link href="/subscribe">Subscribe</Link>
            <Link href="/rss.xml">RSS</Link>
          </div>
        </div>
      </div>

      <div>
        <p>&copy; {currentYear} Political Aficionado. All rights reserved.</p>
        <p>Featured in Google News and Yahoo News</p>
      </div>
    </footer>
  );
}
