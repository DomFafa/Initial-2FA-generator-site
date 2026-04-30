import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell narrow-page">
      <h1>Page not found</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <Link className="primary-link" href="/">
        Go back to the generator
      </Link>
    </main>
  );
}
