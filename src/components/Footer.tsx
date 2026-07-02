"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowUp } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-bg-secondary border-t border-border-custom text-text-secondary pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="h-8 w-8 text-brand-gold"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 15 L50 85 L85 15"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <ellipse cx="50" cy="28" rx="2" ry="6" fill="#F6F1E7" />
              </svg>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-brand-plum dark:text-brand-gold">
                  Victory Fashion
                </span>
                <span className="text-[9px] uppercase tracking-wider text-text-tertiary">
                  Designers & Training
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary">
              Transforming your fashion dreams into bespoke masterpieces since 2008. Ruiru's premier tailoring house and professional fashion academy.
            </p>
            {/* Payment Badges */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary block mb-2">
                Accepted Payments
              </span>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="bg-bg-tertiary dark:bg-bg-primary text-text-primary px-2 py-1 rounded text-xs font-bold border border-border-custom">
                  M-Pesa STK
                </span>
                <span className="bg-bg-tertiary dark:bg-bg-primary text-text-primary px-2 py-1 rounded text-xs font-bold border border-border-custom">
                  Cash / Transfer
                </span>
                <span className="bg-bg-tertiary dark:bg-bg-primary text-text-primary px-2 py-1 rounded text-xs font-bold border border-border-custom">
                  Visa / Mastercard
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-bold text-text-primary mb-4 border-b border-border-custom pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  About Antonina
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Bespoke Services
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Client Portfolio
                </Link>
              </li>
              <li>
                <Link href="/academy" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors font-semibold text-brand-plum dark:text-brand-gold">
                  Fashion Academy
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Ready-to-Wear Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="font-serif text-base font-bold text-text-primary mb-4 border-b border-border-custom pb-2">
              Our Specialties
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/custom-dressmaking" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Bespoke Dressmaking
                </Link>
              </li>
              <li>
                <Link href="/services/bridal-and-occasion-wear" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Bridal & Occasion Gowns
                </Link>
              </li>
              <li>
                <Link href="/services/mens-wear" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Men's Custom Wear
                </Link>
              </li>
              <li>
                <Link href="/services/choir-robes-and-group-orders" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Choir Robes & Group Orders
                </Link>
              </li>
              <li>
                <Link href="/services/corporate-uniforms" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Corporate & Salon Uniforms
                </Link>
              </li>
              <li>
                <Link href="/services/repairs-and-alterations" className="hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                  Repairs & Alterations
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-text-primary mb-4 border-b border-border-custom pb-2">
              Contact & Studio
            </h4>
            <div className="flex items-start gap-2 text-sm leading-relaxed">
              <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
              <span>
                2nd Sunrise Ave, Ruiru, Kenya<br />
                Near Rainbow Resort,<br />
                Off Thika Superhighway
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={18} className="text-brand-gold shrink-0" />
              <span>Mon – Sat: 8:00 AM – 6:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Phone size={18} className="text-brand-gold shrink-0" />
              <a href="tel:+254706232927" className="hover:underline">
                +254 706 232 927
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={18} className="text-brand-gold shrink-0" />
              <span>info@victoryfashion.co.ke</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border-custom pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
          <p>
            &copy; {currentYear} Victory Fashion Designers & Training. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p>
              Designed with ❤️ by{" "}
              <a
                href="https://wa.me/254706036754"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-gold underline"
              >
                ToniDev
              </a>
            </p>
            <button
              onClick={handleScrollToTop}
              className="bg-bg-tertiary p-2 rounded-full hover:bg-brand-plum hover:text-brand-cream dark:hover:bg-brand-gold dark:hover:text-brand-charcoal transition-all"
              aria-label="Back to Top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
