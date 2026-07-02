"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { Scissors, Ruler, ChevronRight, Phone } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      slug: "custom-dressmaking",
      title: "Bespoke Custom Dressmaking",
      description: "Made-to-measure custom skirts, blouses, evening outfits, and dresses tailored to fit your body and showcase your personal elegance.",
      price: "From KES 3,500",
      time: "2-3 weeks turnaround",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
    },
    {
      slug: "bridal-and-occasion-wear",
      title: "Bridal & Occasion Wear",
      description: "Custom bridal gowns, bridesmaid dresses, evening robes, and wedding party wear tailored to make your special day absolute victory.",
      price: "From KES 15,000",
      time: "4-6 weeks turnaround",
      img: "https://images.unsplash.com/photo-1594484208280-eae0044d6589?w=800&auto=format&fit=crop&q=80",
    },
    {
      slug: "mens-wear",
      title: "Men's Custom Wear",
      description: "Perfectly tailored formal dress shirts, custom t-shirts, formal wear, and bespoke trousers crafted for modern men's silhouettes.",
      price: "From KES 2,500",
      time: "1-2 weeks turnaround",
      img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
    },
    {
      slug: "choir-robes-and-group-orders",
      title: "Choir Robes & Group Orders",
      description: "Cohesive matching outfits and elegant robes tailored for church choirs, bridal parties, chamas, and family matching groups.",
      price: "Request Group Quote",
      time: "2-3 weeks turnaround",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    },
    {
      slug: "corporate-uniforms",
      title: "Corporate & Salon Uniforms",
      description: "Premium branded staff uniforms, kitchen chef attire, restaurant aprons, and professional salon uniforms tailored for Kiambu/Ruiru businesses.",
      price: "From KES 1,800 / pc",
      time: "2 weeks turnaround",
      img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    },
    {
      slug: "repairs-and-alterations",
      title: "Repairs & Alterations",
      description: "Fast and reliable repair services including zip replacements, dress resizing, shortening trousers, and general garments modifications.",
      price: "From KES 200",
      time: "Same day / 48 hrs",
      img: "https://images.unsplash.com/photo-1506812779316-934ccd483a53?w=800&auto=format&fit=crop&q=80",
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
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">What We Offer</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Tailoring & Styling Services
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Explore our range of premium custom tailoring specialties in Ruiru. High-margin dressmaking, occasion wear, and repairs.
            </p>
          </div>
        </section>

        {/* Services List */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {services.map((service, idx) => (
                <div
                  key={service.slug}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image Frame */}
                  <div
                    className={`lg:col-span-5 relative ${
                      idx % 2 === 1 ? "lg:order-last" : ""
                    }`}
                  >
                    <div className="rounded-xl overflow-hidden aspect-4/3 border border-border-custom shadow-lg">
                      <img
                        src={service.img}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Copy Details */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="font-serif text-2xl font-bold text-brand-plum dark:text-brand-gold">
                      {service.title}
                    </h3>
                    <div className="flex gap-4 text-xs font-bold text-brand-gold uppercase tracking-wider">
                      <span>{service.price}</span>
                      <span className="text-text-tertiary font-normal">|</span>
                      <span className="text-text-secondary">{service.time}</span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <div className="pt-2 flex gap-4">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider border border-border-custom transition-all"
                      >
                        <span>View Details</span>
                        <ChevronRight size={14} />
                      </Link>
                      <a
                        href={`https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I'm%20inquiring%20about%20your%20${encodeURIComponent(service.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal px-5 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow"
                      >
                        <span>WhatsApp Inquiry</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Studio Directions / CTA */}
        <section className="py-16 bg-bg-secondary border-t border-border-custom text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-plum dark:text-brand-gold">
              Ready for your perfect fit?
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed max-w-lg mx-auto">
              Book a custom tailoring fitting at our Ruiru atelier. Antonina Harrison will personally consult on fabrics and silhouettes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I%27d%20like%20to%20book%20a%20fitting%20at%20your%20Ruiru%20studio."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-8 py-3.5 rounded-md font-bold text-sm uppercase tracking-wider shadow hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Ruler size={16} />
                <span>Book Fitting now</span>
              </a>
              <Link
                href="/contact"
                className="bg-bg-primary text-text-primary border border-border-custom px-8 py-3.5 rounded-md font-bold text-sm uppercase tracking-wider hover:bg-bg-tertiary transition-all"
              >
                Get Studio Location
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
