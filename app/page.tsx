import type { Metadata } from "next";
import { TotpGenerator } from "@/components/TotpGenerator";
import { webApplicationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Free 2FA Code Generator",
  description:
    "Generate standard 6-digit 2FA TOTP codes from a Base32 secret. Free, browser-based, no account, no upload.",
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">2fafree.com</p>
          <h1>Free 2FA Code Generator</h1>
          <p className="hero-subtitle">
            Generate a standard 6-digit authenticator code from a Base32 secret directly in your browser.
          </p>
        </div>
        <TotpGenerator />
      </section>

      <section className="trust-grid" aria-label="Security promises">
        <article>
          <h2>No upload</h2>
          <p>Your 2FA secret is processed in the browser and is never sent to a server.</p>
        </article>
        <article>
          <h2>No account</h2>
          <p>Open the site, paste a secret, generate a code, and leave. No login is required.</p>
        </article>
        <article>
          <h2>No storage</h2>
          <p>The app does not write your secret to LocalStorage, SessionStorage, IndexedDB, or cookies.</p>
        </article>
      </section>

      <section className="info-band">
        <div>
          <p className="eyebrow">Standard TOTP</p>
          <h2>Built for common authenticator secrets</h2>
        </div>
        <p>
          This first version supports the common Google Authenticator style setup: Base32 secret, SHA-1, 6
          digits, and 30-second time windows.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema()) }}
      />
    </main>
  );
}
