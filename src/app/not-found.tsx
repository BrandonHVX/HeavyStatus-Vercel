import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>We could not find the page you are looking for.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
