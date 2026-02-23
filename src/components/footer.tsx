import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading text-2xl font-bold tracking-wide">
              Political Aficionado
            </Link>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed">
              Power. Personality. And freedom of the press.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/headlines" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Headlines
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-4">Policies</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/corrections" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Corrections
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-500 mb-4">Stay Connected</h4>
            <p className="text-sm text-gray-400 mb-4">Get the latest stories delivered to your inbox.</p>
            <div className="flex gap-2">
              <Link
                href="/subscribe"
                className="inline-flex items-center px-4 py-2.5 bg-accent text-white text-sm font-semibold rounded-card-sm hover:bg-accent-hover transition-colors"
              >
                Subscribe
              </Link>
              <Link
                href="/rss.xml"
                className="inline-flex items-center px-4 py-2.5 border border-gray-700 text-gray-400 text-sm font-medium rounded-card-sm hover:border-gray-500 hover:text-white transition-colors"
              >
                RSS
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Political Aficionado. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Featured in Google News and Yahoo News
          </p>
        </div>
      </div>
    </footer>
  );
}
