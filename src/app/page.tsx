import {notFound} from 'next/navigation';

// This page only renders for the root `/` path.
// It immediately calls `notFound()` to trigger the middleware to redirect
// to the default locale (e.g., `/en`).
export default function RootPage() {
  notFound();
}
