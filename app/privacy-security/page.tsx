import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Security - Local 2FA Code Generation",
  description: "Privacy and security details for the Free 2FA Code Generator.",
  alternates: {
    canonical: "/privacy-security/"
  }
};

export default function PrivacySecurityPage() {
  return (
    <main className="page-shell narrow-page">
      <p className="eyebrow">Privacy & Security</p>
      <h1>Your secret stays in your browser</h1>
      <p className="lead">
        This site is built as a static browser tool. It does not have accounts, a database, or server-side
        storage for user input.
      </p>

      <section className="content-section">
        <h2>What happens to your 2FA secret</h2>
        <p>
          The secret you paste is normalized and used by your browser to generate a standard TOTP code. It is
          not uploaded to 2fafree.com and is not saved by the app.
        </p>
      </section>

      <section className="content-section">
        <h2>Storage policy</h2>
        <p>
          The app does not write your secret to LocalStorage, SessionStorage, IndexedDB, cookies, or a remote
          database. Your browser may still offer its own autofill behavior, which is controlled by your browser.
        </p>
      </section>

      <section className="content-section">
        <h2>Analytics</h2>
        <p>
          The site may use Cloudflare Web Analytics for anonymous traffic statistics. Analytics scripts must not
          read, listen to, or record the 2FA secret input.
        </p>
      </section>

      <section className="content-section">
        <h2>Time accuracy</h2>
        <p>
          TOTP codes depend on your device clock. If a generated code is rejected, make sure your operating
          system is set to automatic time synchronization.
        </p>
      </section>
    </main>
  );
}
