"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme, useCart } from "@/app/providers";
import { Menu, X, ShoppingCart, Sun, Moon, Phone } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Academy", href: "/academy" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
  ];

  const activeLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    return isActive
      ? "text-brand-gold font-semibold border-b-2 border-brand-gold pb-1"
      : "text-text-secondary hover:text-brand-plum dark:hover:text-brand-gold transition-colors pb-1";
  };

  return (
    <>
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-bg-secondary/90 dark:bg-bg-secondary/90 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Wordmark & Monogram */}
            <Link href="/" className="flex items-center gap-2 group">
              <svg
                className="h-8 w-8 text-brand-gold group-hover:scale-105 transition-transform"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Monogram V styled as a needle and golden thread */}
                <path
                  d="M15 15 L50 85 L85 15"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Needle Eye */}
                <ellipse cx="50" cy="28" rx="2" ry="6" fill="#F6F1E7" />
                {/* Fabric Stitches looping around V */}
                <path
                  d="M30 46 C 45 42, 55 58, 70 54"
                  stroke="#5B1A2E"
                  strokeWidth="3"
                  strokeDasharray="4,4"
                  className="dark:stroke-brand-cream"
                />
              </svg>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-brand-plum dark:text-brand-gold">
                  Victory Fashion
                </span>
                <span className="text-[10px] uppercase tracking-wider text-text-tertiary">
                  Design & Academy
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={activeLinkClass(link.href)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Header Buttons */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-bg-tertiary transition-colors text-text-secondary"
                aria-label="Toggle Theme"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 rounded-full hover:bg-bg-tertiary transition-colors text-text-secondary relative"
                aria-label="Open Cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Primary Call to Action */}
              <a
                href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 bg-brand-plum hover:bg-brand-plum/90 dark:bg-brand-gold dark:text-brand-charcoal dark:hover:bg-brand-gold/90 text-brand-cream px-4 py-2 rounded-md font-semibold transition-all shadow-md hover:-translate-y-0.5"
              >
                <span>WhatsApp Us</span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-full hover:bg-bg-tertiary transition-colors text-text-secondary"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-bg-secondary border-b border-border-custom shadow-xl animate-in slide-in-from-top duration-300">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 px-3 rounded-md transition-colors ${
                    pathname === link.href
                      ? "bg-bg-tertiary text-brand-gold font-bold"
                      : "text-text-secondary hover:bg-bg-tertiary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream py-3 rounded-md font-semibold text-center"
                onClick={() => setIsOpen(false)}
              >
                <span>WhatsApp Order / Inquiry</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Bar (visible on mobile only) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-bg-secondary/95 backdrop-blur-md border-t border-border-custom shadow-2xl flex items-center justify-around py-3 px-4">
        <a
          href="tel:+254706232927"
          className="flex-1 flex items-center justify-center gap-2 text-text-secondary hover:text-brand-plum py-2 font-medium border-r border-border-custom"
        >
          <Phone size={18} className="text-brand-gold" />
          <span>Call Studio</span>
        </a>
        <a
          href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%20Design%2C%20I%20want%20to%20book%20a%20fitting%20or%20make%20an%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 text-green-600 dark:text-green-400 py-2 font-medium"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.49-3.238l.382.227c1.545.919 3.324 1.403 5.132 1.404 5.533 0 10.038-4.501 10.04-10.04.001-2.684-1.043-5.208-2.94-7.108-1.897-1.899-4.417-2.943-7.102-2.944-5.541 0-10.048 4.507-10.05 10.047-.001 1.892.493 3.74 1.43 5.361l.248.428-1.002 3.66 3.743-.981zm11.386-5.493c-.31-.156-1.838-.907-2.117-1.008-.28-.101-.483-.151-.686.152-.204.304-.787.994-.965 1.197-.177.203-.355.228-.665.072-1.093-.547-1.862-.892-2.585-1.53-.418-.368-.696-.81-.777-1.12-.08-.31-.009-.477.069-.554.069-.069.155-.183.233-.274.078-.09.104-.152.155-.254.052-.101.026-.19-.013-.291-.039-.101-.355-.856-.487-1.17-.129-.311-.26-.269-.355-.274-.092-.004-.197-.005-.303-.005-.106 0-.278.04-.424.197-.146.157-.557.545-.557 1.329 0 .783.57 1.54.649 1.646.08.106 1.12 1.71 2.713 2.397.379.164.675.261.905.334.381.121.727.104 1.001.063.305-.045.908-.371 1.035-.73.127-.358.127-.665.089-.73-.038-.063-.14-.1-.45-.256z" />
          </svg>
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
}
