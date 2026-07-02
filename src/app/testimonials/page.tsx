"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Star, MessageSquare, Award, Clock, Sparkles } from "lucide-react";

export default function TestimonialsPage() {
  const reviews = [
    {
      author: "Grace Wambui",
      location: "Ruiru",
      quote: "Antonina designed my wedding gown and it was absolutely magnificent. She paid attention to every single detail. I felt like a queen!",
      stars: 5,
    },
    {
      author: "Samuel Njenga",
      location: "Thika",
      quote: "Our church was looking for high-quality robes for our choir. Victory Fashion took our measurements and delivered on time for our anniversary.",
      stars: 5,
    },
    {
      author: "Joy Mwangi",
      location: "Nairobi",
      quote: "I highly recommend the Fashion Academy. The teachers are very patient and the syllabus is fully practical. I started my own shop!",
      stars: 5,
    },
    {
      author: "Charles Kamau",
      location: "Ruiru",
      quote: "The only tailor in Ruiru I trust for my custom dress shirts. Sizing is always consistent and the stitching is perfect.",
      stars: 5,
    },
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-24 bg-bg-primary">
        {/* Header */}
        <section className="py-12 bg-bg-secondary border-b border-border-custom text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Client Success</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Reviews & Case Studies
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Read how we deliver custom dressmaking victory for our clients, churches, businesses, and students.
            </p>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {reviews.map((rev, idx) => (
                <div
                  key={idx}
                  className="bg-bg-secondary p-8 rounded-xl border border-border-custom shadow-sm relative stitch-border"
                >
                  <div className="text-brand-gold flex gap-0.5 mb-4">
                    {Array.from({ length: rev.stars }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm italic leading-relaxed mb-4">
                    "{rev.quote}"
                  </p>
                  <div>
                    <h4 className="font-serif text-sm font-bold">{rev.author}</h4>
                    <span className="text-xs text-text-tertiary">{rev.location}, Kenya</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Case Studies Section */}
            <div className="space-y-12">
              <div className="text-center space-y-2 mb-12">
                <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Featured Success Stories</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold">How We Work</h2>
                <div className="stitch-divider max-w-xs mx-auto"></div>
              </div>

              {/* Case Study 1 */}
              <div className="bg-bg-secondary rounded-2xl border border-border-custom overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 md:p-8">
                <div className="lg:col-span-5 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-bg-tertiary">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
                    alt="Choir robes group orders"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider">
                    <Clock size={16} />
                    <span>Speed & Scale Case Study</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-plum dark:text-brand-gold">
                    40 Custom Choir Robes in 2 Weeks
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    A local community church approached us with an urgent request: 40 bespoke choir robes for their annual anniversary event, required in just 14 days. We drafted a uniform pattern, sourced matching heavy-grade royal blue crepe fabric, collected measurements for all 40 singers via an online chart, and deployed our studio staff. All 40 robes were embroidered, pressed, and delivered on-site with 48 hours to spare.
                  </p>
                  <div className="bg-bg-primary p-4 rounded-lg border border-border-custom text-xs sm:text-sm text-text-secondary space-y-1">
                    <div><strong>Client:</strong> Ruiru Community Church</div>
                    <div><strong>Outcome:</strong> 40 robes delivered on time, perfectly sized with embroidered details.</div>
                  </div>
                </div>
              </div>

              {/* Case Study 2 */}
              <div className="bg-bg-secondary rounded-2xl border border-border-custom overflow-hidden shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 md:p-8">
                <div className="lg:col-span-5 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-bg-tertiary lg:order-last">
                  <img
                    src="https://images.unsplash.com/photo-1594484208280-eae0044d6589?w=800&auto=format&fit=crop&q=80"
                    alt="Bridal wear fitting process"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={16} />
                    <span>Couture Bridal Case Study</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-plum dark:text-brand-gold">
                    Crafting Grace's Dream Silhouette
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Grace Wambui came to our studio with sketches of an off-shoulder gown featuring complex structured lace. Over the course of 6 weeks, Antonina Harrison drafted a custom toile mockup, adjusted lines to perfect the sweetheart neckline, hand-placed French lace appliques across the bodice, and finished a sweeping satin skirt. The gown fit flawlessly without requiring any emergency alterations on her wedding week.
                  </p>
                  <div className="bg-bg-primary p-4 rounded-lg border border-border-custom text-xs sm:text-sm text-text-secondary space-y-1">
                    <div><strong>Client:</strong> Grace Wambui (Bride)</div>
                    <div><strong>Outcome:</strong> Sweeping custom off-shoulder gown with built-in structured support.</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonial Google CTA */}
        <section className="py-16 bg-bg-secondary border-t border-border-custom text-center">
          <div className="max-w-2xl mx-auto px-4 space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold">Have you worked with us?</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We value your feedback. Help us build Ruiru's most trusted brand by leaving a review on our Google Business Profile!
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-6 py-3 rounded-md font-bold text-xs uppercase tracking-wider shadow"
            >
              Leave a Google Review
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
