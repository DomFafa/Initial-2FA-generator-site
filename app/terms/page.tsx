import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the Free 2FA Code Generator.",
  alternates: {
    canonical: "/terms/"
  }
};

export default function TermsPage() {
  return (
    <main className="page-shell narrow-page">
      <p className="eyebrow">Terms</p>
      <h1>Terms of use</h1>
      <p className="lead">
        This free tool is provided for convenience. Use it only with 2FA secrets that you are authorized to use.
      </p>

      <section className="content-section">
        <h2>No warranty</h2>
        <p>
          The service is provided as is, without warranties of availability, accuracy, or fitness for a particular
          purpose.
        </p>
      </section>

      <section className="content-section">
        <h2>User responsibility</h2>
        <p>
          You are responsible for protecting your own 2FA secrets, devices, browser profile, and account recovery
          methods.
        </p>
      </section>

      <section className="content-section">
        <h2>Changes</h2>
        <p>These terms may be updated as the product evolves, especially if advertising or new features are added.</p>
      </section>
    </main>
  );
}
