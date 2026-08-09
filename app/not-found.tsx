/**
 * 404 page (MASTERPLAN §3.1, §15)
 *
 * Copy from the copy bank. Offers program finder and eligibility check
 * rather than a dead end.
 */
import Link from "next/link";
import "./globals.css"; // Ensure CSS is loaded

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-paper min-h-screen flex items-center justify-center font-sans text-slate antialiased">
        <div className="mx-auto px-6 py-24 text-center max-w-2xl">
          <div className="mb-8 font-display text-9xl text-rule font-bold">404</div>
          <h1 className="text-navy mb-4 font-display text-4xl leading-tight font-bold">
            That page is not here
          </h1>
          <p className="mx-auto mb-10 text-slate text-lg max-w-prose leading-relaxed">
            It may have moved. The program finder and the eligibility check are the two
            things most people are looking for.
          </p>
          <div className="flex justify-center gap-4 flex-col sm:flex-row">
            <Link
              href="/en/programs"
              className="inline-flex items-center justify-center px-8 py-3 bg-navy text-white rounded-md font-medium transition-colors hover:bg-navy-deep on-dark"
            >
              Program finder
            </Link>
            <Link
              href="/en/eligibility"
              className="inline-flex items-center justify-center px-8 py-3 bg-seal text-white rounded-md font-medium transition-colors hover:bg-seal/90"
            >
              Check eligibility
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
