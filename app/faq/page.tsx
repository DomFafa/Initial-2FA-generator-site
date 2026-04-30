import type { Metadata } from "next";
import { faqPageSchema } from "@/lib/schema";

const faqs = [
  {
    question: "What is a 2FA code?",
    answer:
      "A 2FA code is a short one-time code used as a second login factor. This tool generates standard time-based TOTP codes from a Base32 secret."
  },
  {
    question: "Does this site upload my 2FA secret?",
    answer:
      "No. The secret is processed in your browser. The site does not send it to a server and does not save it in browser storage."
  },
  {
    question: "Why is my 2FA code not working?",
    answer:
      "Most failures come from an incorrect secret or device time drift. Check that the full Base32 secret was copied and that your device time is set automatically."
  },
  {
    question: "Which 2FA format is supported?",
    answer:
      "The first version supports standard TOTP: Base32 secret, SHA-1, 6 digits, and 30-second periods."
  },
  {
    question: "Can I save multiple accounts?",
    answer:
      "No. This version is designed as a quick code generator and does not save secrets, accounts, or generated codes."
  }
];

export const metadata: Metadata = {
  title: "2FA Generator FAQ - Privacy and TOTP Help",
  description: "Answers about the Free 2FA Code Generator, local TOTP generation, privacy, and supported formats.",
  alternates: {
    canonical: "/faq/"
  }
};

export default function FaqPage() {
  return (
    <main className="page-shell narrow-page">
      <p className="eyebrow">FAQ</p>
      <h1>Frequently asked questions</h1>
      <p className="lead">
        Short answers about how this browser-based 2FA generator works and what it does not store.
      </p>

      <div className="faq-list">
        {faqs.map((item) => (
          <article key={item.question} className="text-card">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }}
      />
    </main>
  );
}
