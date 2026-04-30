import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact 2FA Free - Bug Reports and Security Questions",
  description: "Contact 2FA Free for bug reports, security concerns, or advertising inquiries.",
  alternates: {
    canonical: "/contact/"
  }
};

export default function ContactPage() {
  return (
    <main className="page-shell narrow-page">
      <p className="eyebrow">Contact</p>
      <h1>Contact 2FA Free</h1>
      <p className="lead">Send bug reports, security concerns, or advertising inquiries by email.</p>

      <section className="contact-panel">
        <p>Email</p>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </section>
    </main>
  );
}
