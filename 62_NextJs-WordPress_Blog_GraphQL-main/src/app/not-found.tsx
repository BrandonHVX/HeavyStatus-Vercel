import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we could not find the page you are looking for. It might have been moved or deleted.
        </p>
        <Link 
          href="/" 
          className="inline-block px-8 py-3 bg-accent text-white font-medium rounded hover:bg-red-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
