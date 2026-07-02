"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqItems = [
    {
      q: "What types of clothing do you tailor?",
      a: "We specialize in premium custom dressmaking, occasion gowns, bridal dresses, men's tailored formal shirts/t-shirts, choir robes, and corporate uniforms (branded staff aprons/tunics). We purposefully de-prioritize low-margin school uniforms to focus on high-quality bespoke tailoring.",
    },
    {
      q: "What is your turnaround time for custom orders?",
      a: "Bespoke custom dressmaking and men's wear orders usually take 2 to 3 weeks. Bridal wear and custom wedding gowns take 4 to 6 weeks. Simple repairs and alterations can often be completed within 24 to 48 hours. Expedited turnaround is available for emergencies.",
    },
    {
      q: "Do you offer flexible payment plans for the Fashion Academy?",
      a: "Yes, our flagship Fashion Training Academy offers flexible monthly installment payment plans to ensure that career training remains accessible to all aspiring designers in Kiambu County.",
    },
    {
      q: "Are training courses available online?",
      a: "Currently, our core tailoring and dressmaking training modules are in-person in our Ruiru studio. This hands-on method ensures that students master pattern cutting, sewing machines, and fabric tailoring techniques with close guidance.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Lipa Na M-Pesa STK push (prompt on phone), bank wire transfers, cash at our studio, and major credit cards.",
    },
    {
      q: "Do I need to make an appointment for a fitting?",
      a: "While walk-ins are welcome at our studio on 2nd Sunrise Ave in Ruiru, we highly recommend booking a fitting appointment via WhatsApp +254 706 232 927. This ensures Antonina Harrison is available for your custom pattern consultation.",
    },
  ];

  // Schema.org FAQPage structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      {/* Structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 pt-24 bg-bg-primary">
        {/* Header */}
        <section className="py-12 bg-bg-secondary border-b border-border-custom text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Answers</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Frequently Asked Questions
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Find fast answers about custom fittings, academy enrollment, payments, and delivery details.
            </p>
          </div>
        </section>

        {/* FAQs List */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-bg-secondary p-6 sm:p-8 rounded-xl border border-border-custom shadow-sm space-y-3"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle size={20} className="text-brand-gold shrink-0 mt-1" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-brand-plum dark:text-brand-gold">
                    {item.q}
                  </h3>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed pl-8">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <section className="py-16 bg-bg-secondary border-t border-border-custom text-center">
          <div className="max-w-2xl mx-auto px-4 space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold">Still have a question?</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We are here to help. Reach out directly and we will get back to you immediately.
            </p>
            <a
              href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%20Design%2C%20I%20have%20a%20question%20not%20covered%20in%20your%20FAQ."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-6 py-3 rounded-md font-bold text-xs uppercase tracking-wider shadow"
            >
              Ask on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
