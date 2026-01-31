import Link from "next/link";

export function Footer(){
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-2xl tracking-[0.2em] uppercase text-black">
              Heavy Status
            </Link>
            <p className="text-sm text-gray-600 mt-4 max-w-md leading-relaxed">
              Your source for the latest news, insights, and stories that matter.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-4">Navigate</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Today
                </Link>
              </li>
              <li>
                <Link href="/headlines" className="text-sm text-gray-600 hover:text-black transition-colors">
                  Headlines
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-4">Subscribe</h4>
            <p className="text-sm text-gray-600 mb-4">Get the latest stories delivered to your inbox.</p>
            <Link 
              href="/rss.xml" 
              className="text-xs uppercase tracking-widest text-black border border-black px-4 py-2 inline-block hover:bg-black hover:text-white transition-colors"
            >
              RSS Feed
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            &copy; {currentYear} Heavy Status. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
