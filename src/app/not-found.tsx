import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-serif text-8xl text-black mb-4">404</h1>
        <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-8">Page Not Found</h2>
        <p className="text-gray-600 mb-10 max-w-md mx-auto font-serif italic">
          We could not find the page you are looking for.
        </p>
        <Link 
          href="/" 
          className="text-xs uppercase tracking-widest text-black border border-black px-8 py-3 inline-block hover:bg-black hover:text-white transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
