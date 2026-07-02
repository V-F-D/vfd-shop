"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { Scissors, Award, Users, Star, ArrowRight, Sparkles, MapPin, CheckCircle, ChevronRight, Ruler } from "lucide-react";
import { useCart } from "@/app/providers";

export default function HomePage() {
  const { addToCart } = useCart();

  const trustStats = [
    { label: "Years of Experience", value: "20+", icon: Award },
    { label: "Custom Outfits Tailored", value: "5,000+", icon: Scissors },
    { label: "Academy Graduates", value: "150+", icon: Users },
    { label: "Google Business Rating", value: "4.9/5 ★", icon: Star },
  ];

  const services = [
    {
      title: "Bespoke Custom Dressmaking",
      description: "Made-to-measure premium custom gowns, skirts, and dresses tailored to accent your unique silhouette.",
      price: "From KES 3,500",
      link: "/services/custom-dressmaking",
    },
    {
      title: "Bridal & Occasion Wear",
      description: "Bespoke wedding gowns, evening wear, and bridesmaid dresses for your most unforgettable milestones.",
      price: "From KES 15,000",
      link: "/services/bridal-and-occasion-wear",
    },
    {
      title: "Men's Custom Wear",
      description: "Perfectly tailored formal shirts, custom t-shirts, and tailored trousers designed for confidence.",
      price: "From KES 2,500",
      link: "/services/mens-wear",
    },
    {
      title: "Choir Robes & Group Orders",
      description: "Cohesive matching outfits and elegant robes for church choirs, weddings, and family chama groups.",
      price: "Special Group Pricing",
      link: "/services/choir-robes-and-group-orders",
    },
    {
      title: "Corporate & Staff Uniforms",
      description: "Premium, durable, branded staff uniforms tailored for restaurants, salons, offices, and SACCOs.",
      price: "From KES 1,800 / pc",
      link: "/services/corporate-uniforms",
    },
    {
      title: "Repairs & Alterations",
      description: "Breathe new life into your wardrobe with our prompt, precision alterations and repair service.",
      price: "From KES 200",
      link: "/services/repairs-and-alterations",
    },
  ];

  const featuredWorks = [
    { title: "Plum & Gold Wedding Gown", category: "Bridal", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60" },
    { title: "Custom Ankara Silhouette", category: "African-Modern", img: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=800&auto=format&fit=crop&q=60" },
    { title: "Bespoke Charcoal Double-Breasted", category: "Men's Wear", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=60" },
  ];

  const testimonials = [
    {
      quote: "Antonina Harrison is a master of her craft. She designed my wedding gown and it fit like a dream. Absolutely stunning work!",
      author: "Grace Wambui",
      location: "Ruiru",
      stars: 5,
    },
    {
      quote: "We ordered 40 custom choir robes for our church, and Victory delivered them in less than 2 weeks. High quality and professional service.",
      author: "Pastor Samuel Njenga",
      location: "Thika",
      stars: 5,
    },
  ];

  const faqs = [
    { q: "What is your turnaround time for custom orders?", a: "Standard turnaround time is 2 to 4 weeks depending on the complexity of the design and our current bookings. We offer expedited services for emergencies." },
    { q: "Do you offer payment plans for training courses?", a: "Yes, our Flagship Fashion Training Academy offers flexible monthly installment payment plans to ensure career training is accessible to everyone." },
    { q: "How do I book a fitting at your studio?", a: "You can book directly by tapping our WhatsApp button or calling +254 706 232 927. Walk-ins are also welcome!" },
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-20">
        {/* Editorial Hero Section */}
        <section className="relative min-h-[85vh] flex items-center bg-bg-secondary overflow-hidden py-12 md:py-24">
          <div className="absolute inset-0 z-0 opacity-15 dark:opacity-5">
            {/* Background design accents */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-plum rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-gold rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Hero Copy */}
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blush/60 dark:bg-brand-charcoal border border-brand-gold/30 rounded-full text-brand-plum dark:text-brand-gold text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={12} className="animate-spin-slow" />
                  <span>Where Creativity Meets Craftsmanship</span>
                </div>
                
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-plum dark:text-brand-gold leading-none">
                  Bespoke. Bold.<br />
                  <span className="text-text-primary">Made in Ruiru.</span>
                </h1>
                
                <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Led by Antonina Harrison, Master Tailor with 20 years of experience, we specialize in high-end bespoke garments and train the next generation of designers.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I%20would%20like%20to%20book%20a%20fitting%20or%20make%20a%20custom%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-plum hover:bg-brand-plum/95 dark:bg-brand-gold dark:text-brand-charcoal dark:hover:bg-brand-gold/90 text-brand-cream px-8 py-3.5 rounded-md font-bold text-sm tracking-wider uppercase shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Ruler size={16} />
                    <span>Book a Fitting</span>
                  </a>
                  <Link
                    href="/academy"
                    className="bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary px-8 py-3.5 rounded-md font-bold text-sm tracking-wider uppercase border border-border-custom hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Explore Academy</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Hero Image / Card */}
              <div className="relative mx-auto lg:ml-auto max-w-md w-full">
                <div className="relative rounded-2xl overflow-hidden aspect-4/5 shadow-2xl border-4 border-brand-cream dark:border-brand-charcoal outline-none">
                  {/* Hero image placeholder, premium editorial feel */}
                  <img
                    src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80"
                    alt="Bespoke Tailoring at Victory Fashion Design"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-brand-cream">
                    <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Bridal & Occasion Wear</span>
                    <h3 className="font-serif text-xl font-bold mt-1">Antonina Harrison Collection</h3>
                    <p className="text-xs text-brand-cream/80 mt-1">Hand-crafted custom couture, shipped nationwide.</p>
                  </div>
                </div>
                {/* Stitch Motif */}
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand-gold/15 dark:bg-brand-gold/10 rounded-full blur-xl -z-10"></div>
              </div>

            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-brand-plum dark:bg-bg-secondary text-brand-cream py-10 border-y border-brand-gold/20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {trustStats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-center text-brand-gold mb-1">
                    <stat.icon size={24} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-brand-gold">
                    {stat.value}
                  </div>
                  <div className="text-xs tracking-wider uppercase text-brand-cream/85">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-bg-primary" id="services">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center space-y-3 mb-16">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Premium Tailoring</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-plum dark:text-brand-gold">
                Bespoke Design Specialties
              </h2>
              <div className="stitch-divider max-w-xs mx-auto"></div>
              <p className="text-text-secondary max-w-lg mx-auto text-sm">
                Each garment is individually patterned, cut, and tailored to perfection in our Ruiru studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-bg-secondary p-8 rounded-xl border border-border-custom hover:border-brand-gold hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="h-10 w-10 bg-brand-plum/10 dark:bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-plum dark:text-brand-gold">
                      <Scissors size={20} />
                    </div>
                    <h3 className="font-serif text-lg font-bold group-hover:text-brand-plum dark:group-hover:text-brand-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-border-custom flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                      {service.price}
                    </span>
                    <Link
                      href={service.link}
                      className="text-text-primary hover:text-brand-plum dark:hover:text-brand-gold font-semibold text-xs flex items-center gap-1"
                    >
                      <span>Learn More</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Academy Flagship Teaser */}
        <section className="py-20 bg-bg-secondary relative border-y border-border-custom overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-blush/30 dark:bg-brand-charcoal/50 skew-x-12 -z-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-6">
                <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Flagship Academy</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-plum dark:text-brand-gold">
                  Victory Fashion Training Academy
                </h2>
                <div className="stitch-divider max-w-sm"></div>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  Turn your creative passions into a rewarding career. Our Ruiru-based academy offers beginner to advanced training courses in tailoring, dressmaking, fashion sketching, and business management.
                </p>

                <ul className="space-y-3 text-sm">
                  {[
                    "Hands-on practice (Max 15 students per class)",
                    "Comprehensive 2-Year Diploma & Certificate courses",
                    "Flexible payment installments available",
                    "Mentorship & career business placement assistance",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-brand-gold shrink-0" />
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link
                    href="/academy"
                    className="inline-flex items-center gap-2 bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-8 py-3.5 rounded-md font-bold text-sm tracking-wider uppercase shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <span>View Courses & Enroll</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Academy Mockup */}
              <div className="relative max-w-md mx-auto lg:mr-0">
                <div className="relative rounded-2xl overflow-hidden aspect-3/2 shadow-2xl border-4 border-brand-cream dark:border-brand-charcoal">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80"
                    alt="Students cutting pattern designs"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Stitch badge overlay */}
                <div className="absolute -bottom-6 -right-6 bg-brand-gold text-brand-charcoal p-4 rounded-xl shadow-lg border-2 border-brand-cream text-center font-bold">
                  <div className="text-lg">Next Intake</div>
                  <div className="text-xs uppercase tracking-wider text-brand-plum font-extrabold">Enrolling Now</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Portfolio Showcase Grid */}
        <section className="py-20 bg-bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Our Work</span>
                <h2 className="font-serif text-3xl font-bold text-brand-plum dark:text-brand-gold mt-1">
                  Signature Creations
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 border border-brand-gold hover:bg-brand-gold hover:text-brand-charcoal text-text-primary px-6 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>View Full Gallery</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredWorks.map((item, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl overflow-hidden aspect-3/4 shadow-md border border-border-custom hover:shadow-xl transition-all"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-transparent opacity-90 p-6 flex flex-col justify-end text-brand-cream">
                    <span className="text-[10px] uppercase tracking-wider text-brand-gold font-extrabold">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-base font-bold mt-1">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-bg-secondary border-t border-border-custom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center space-y-3 mb-16">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Client Success</span>
              <h2 className="font-serif text-3xl font-bold text-brand-plum dark:text-brand-gold">
                Loved by the Community
              </h2>
              <div className="stitch-divider max-w-xs mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((test, idx) => (
                <div
                  key={idx}
                  className="bg-bg-primary p-8 rounded-xl shadow-sm border border-border-custom relative stitch-border"
                >
                  <div className="text-brand-gold flex gap-0.5 mb-4">
                    {Array.from({ length: test.stars }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-text-secondary text-sm italic leading-relaxed mb-6">
                    "{test.quote}"
                  </p>
                  <div>
                    <h4 className="font-serif text-sm font-bold">{test.author}</h4>
                    <span className="text-xs text-text-tertiary">{test.location}, Kenya</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Studio Fitting Location / CTA block */}
        <section className="py-20 bg-bg-primary relative" id="location">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-bg-secondary border border-border-custom rounded-2xl p-8 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-brand-gold">
                  <MapPin size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest">Visit the Studio</span>
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold">
                  What to expect at your first fitting
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  We invite you to our studio on 2nd Sunrise Ave in Ruiru. At your first fitting, Antonina Harrison will personally take your measurements, discuss fabric designs and silhouettes, and sketch your custom order details.
                </p>
                <div className="p-4 bg-bg-primary rounded-lg border border-border-custom space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Address:</span>
                    <span className="text-text-secondary">2nd Sunrise Ave, Ruiru, Kenya</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Hours:</span>
                    <span className="text-text-secondary">Mon – Sat, 8:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Map embed / CTA button */}
              <div className="space-y-6 lg:pl-6">
                <div className="rounded-xl overflow-hidden aspect-video border border-border-custom shadow-md bg-bg-tertiary flex items-center justify-center text-center p-4">
                  <div>
                    <MapPin size={32} className="text-brand-plum dark:text-brand-gold mx-auto mb-2" />
                    <span className="font-bold block text-sm">Google Map Location</span>
                    <span className="text-xs text-text-tertiary">2nd Sunrise Ave, Ruiru, near Rainbow Resort</span>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block text-xs bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-4 py-2 rounded font-bold uppercase tracking-wider"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
                <div className="text-center">
                  <a
                    href="https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I'd%20like%20to%20discuss%20a%20tailoring%20job%20or%20alteration."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-block bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-md font-bold text-sm uppercase tracking-wider shadow"
                  >
                    Chat on WhatsApp +254 706 232 927
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
