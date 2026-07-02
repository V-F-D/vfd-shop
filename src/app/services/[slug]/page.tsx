"use client";

import React, { use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ruler, Scissors, Award, CheckCircle, ArrowLeft, MessageCircle } from "lucide-react";

interface ServiceData {
  title: string;
  price: string;
  turnaround: string;
  description: string;
  longDescription: string;
  included: string[];
  process: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  img: string;
}

const serviceDictionary: Record<string, ServiceData> = {
  "custom-dressmaking": {
    title: "Bespoke Custom Dressmaking",
    price: "From KES 3,500",
    turnaround: "2 - 3 weeks",
    description: "Made-to-measure premium skirts, blouses, evening wear, and custom dresses tailored to highlight your silhouette.",
    longDescription: "Our bespoke dressmaking service is the ultimate wardrobe luxury. We do not use commercial master patterns. Instead, Antonina Harrison drafts a unique paper pattern based on over 15 body measurements. This ensures that every sleeve, dart, and hemline lands exactly where it should, highlighting your silhouette with absolute comfort.",
    included: [
      "Initial design consultation & sketching",
      "Exact body measurement session",
      "Fabric selection assistance (Ankara, silk, lace, crepe)",
      "Premium lining and interfacing materials",
      "Up to two fitting sessions in our Ruiru studio",
      "Final alterations and custom adjustments",
    ],
    process: [
      { step: "01", title: "Consultation", desc: "Share your design inspiration, choose your fabrics, and discuss silhouettes." },
      { step: "02", title: "Measurements", desc: "We take comprehensive measurements to map out your custom sewing pattern." },
      { step: "03", title: "First Fitting", desc: "Try on the basted garment structure to adjust seams, fit, and proportions." },
      { step: "04", title: "Final Polish", desc: "Precision stitching, hem finishes, pressing, and final delivery." },
    ],
    faqs: [
      { q: "Can I bring my own fabric?", a: "Yes, you are welcome to bring your own fabrics! We will inspect it for quality and let you know if it is suitable for the design you want." },
      { q: "How many fittings are required?", a: "For standard dressmaking, usually one or two fittings are necessary to make sure the garment fits perfectly." },
    ],
    img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
  },
  "bridal-and-occasion-wear": {
    title: "Bridal & Occasion Wear",
    price: "From KES 15,000",
    turnaround: "4 - 6 weeks",
    description: "Hand-crafted custom wedding gowns, bridesmaid dresses, evening robes, and event wear made to turn heads.",
    longDescription: "Your wedding or high-profile event calls for garments that capture the scale of the moment. We craft elegant custom bridal gowns, reception dresses, evening wear, and bridesmaid coordinates. From delicate beadwork and lace appliques to sweeping train structures, our gowns are built with built-in corsetry and high-grade materials to ensure a confidence-inducing fit.",
    included: [
      "Deep design consultation (sketches & mood boards)",
      "Premium imported lace, tulle, and satin selection",
      "Built-in corset structure or support elements",
      "Detailed beadwork and hand-sewn embellishments",
      "Three to four scheduled private fittings",
      "Final pressing and gown preservation packaging",
    ],
    process: [
      { step: "01", title: "Design Concept", desc: "Align on wedding theme, gown sketches, and fabric textures." },
      { step: "02", title: "Mockup (Toile)", desc: "We build a cotton mockup dress to perfect the necklines and waist fit." },
      { step: "03", title: "Lace & Details", desc: "Sewing the real gown shell and hand-placing lace appliques or beads." },
      { step: "04", title: "Perfect Reveal", desc: "Final styling fitting, hem adjustments, and release." },
    ],
    faqs: [
      { q: "How far in advance should I order my wedding gown?", a: "We recommend booking your bridal consultation at least 2 to 3 months before your wedding to allow ample time for fabric sourcing, details, and multiple fittings." },
      { q: "Do you tailor coordinates for bridesmaids?", a: "Yes, we offer custom matching packages for bridesmaids, groomsmen, and the parents of the bride/groom." },
    ],
    img: "https://images.unsplash.com/photo-1594484208280-eae0044d6589?w=800&auto=format&fit=crop&q=80",
  },
  "mens-wear": {
    title: "Men's Custom Wear",
    price: "From KES 2,500",
    turnaround: "1 - 2 weeks",
    description: "Bespoke formal dress shirts, custom t-shirts, tailored suits, and modern men's shirts designed for everyday success.",
    longDescription: "Stand out in custom-fit mens shirts and trousers that eliminate the bulkiness of off-the-rack sizing. We tailor formal dress shirts, custom t-shirts, and casual linen sets using premium, breathable cottons and blended suiting materials. We also offer double-breasted and single-breasted custom suiting orders with premium interior canvas structure.",
    included: [
      "Fit consultation (slim fit, regular fit, tailored)",
      "Collar and cuff style customization",
      "Premium cotton, linen, or suiting fabrics",
      "Starch collar stays and reinforced buttonholes",
      "Fitting adjustment review",
    ],
    process: [
      { step: "01", title: "Styling Review", desc: "Select cuff styles, collar spreads, and pocket configurations." },
      { step: "02", title: "Measurements", desc: "Precision measurements of shoulders, chest, sleeve length, and cuffs." },
      { step: "03", title: "Construction", desc: "Reinforced seam stitching for long-lasting garment wear." },
      { step: "04", title: "Fitting check", desc: "Try on the finished shirt or trousers to confirm correct drape." },
    ],
    faqs: [
      { q: "Do you tailor men's wedding suits?", a: "Yes, we tailor custom men's wedding suits, blazers, and shirts for grooms and groomsmen." },
      { q: "What fabrics do you use for shirts?", a: "We source high-grade 100% cotton, linen blends, and poplin fabrics for maximum comfort." },
    ],
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
  },
  "choir-robes-and-group-orders": {
    title: "Choir Robes & Group Orders",
    price: "Special Group Pricing",
    turnaround: "2 - 3 weeks",
    description: "Cohesive matching outfits and elegant custom robes tailored for church choirs, chamas, and family events.",
    longDescription: "Make a powerful collective statement with high-quality group outfits. We specialize in tailoring custom church choir robes, uniform matching garments for women's chamas, groom cohorts, and family members attending special group events. We support bulk ordering sizes and offer competitive wholesale pricing for groups of 10 or more.",
    included: [
      "Custom choir robe or uniform design mockup",
      "Standardized group fabric sourcing for color uniformity",
      "Embroidered logo or sash options",
      "Sizing chart profiling for group members",
      "Bulk delivery coordinates across Kenya",
    ],
    process: [
      { step: "01", title: "Concept Mockup", desc: "Design group robes or outfits and select uniform color fabrics." },
      { step: "02", title: "Size Profiling", desc: "Collect sizes for all members using our simple size charts." },
      { step: "03", title: "Bulk Tailoring", desc: "Production-line tailoring in our Ruiru studio with strict quality checks." },
      { step: "04", title: "Delivery", desc: "Courier dispatch or pick up at our Sunrise Ave studio." },
    ],
    faqs: [
      { q: "What is the minimum order for group pricing?", a: "Group discount pricing applies to orders of 10 or more identical outfits or robes." },
      { q: "Can you embroider our church logo on the robes?", a: "Yes, we offer premium custom embroidery and screen printing options for branding." },
    ],
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
  },
  "corporate-uniforms": {
    title: "Corporate & Salon Uniforms",
    price: "From KES 1,800 / pc",
    turnaround: "2 weeks",
    description: "Branded uniforms, chef attire, eateries aprons, and professional salon uniforms tailored for local businesses.",
    longDescription: "Upgrade your team's professional presentation with branded corporate uniforms, salon aprons, eatery tunics, and hospitality wear. We select durable, stain-resistant, breathable fabrics designed to withstand daily wear and washing. Our items feature secure stitching at stress points and custom pockets tailored to your industry's needs.",
    included: [
      "Team branding and embroidery options",
      "Stain-resistant and stretch-comfort fabrics",
      "Reinforced double stitching at pocket corners",
      "Bulk sample creation prior to production",
      "Local delivery in Kiambu/Nairobi",
    ],
    process: [
      { step: "01", title: "Team Needs", desc: "Identify uniform duties, pocket configurations, and color schemes." },
      { step: "02", title: "Branded Sample", desc: "Generate a sample uniform with embroidered logo for your approval." },
      { step: "03", title: "Batch Cutting", desc: "Automated precision cutting and layout for uniform batches." },
      { step: "04", title: "Quality Check", desc: "Inspecting buttons, zips, embroidery, and packing." },
    ],
    faqs: [
      { q: "Do you offer sizing samples for teams?", a: "Yes, we can provide sample size sets so your team members can try them on and select their best fit." },
      { q: "Can we re-order uniforms for new staff later?", a: "Absolutely! We keep all your pattern templates and logo configurations on file for fast re-orders." },
    ],
    img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
  },
  "repairs-and-alterations": {
    title: "Repairs & Alterations",
    price: "From KES 200",
    turnaround: "Same day / 48 hrs",
    description: "Breathe new life into your wardrobe with our prompt, precision alterations and repair service.",
    longDescription: "Don't let broken zippers, long trouser hems, or loose waistlines keep you from wearing your favorite outfits. Bring your garments to our Ruiru studio for fast, professional repair and alteration services. We offer zip replacements, custom hem shortening, waist adjustments, sleeve modifications, and dress resizing.",
    included: [
      "On-the-spot fit assessment and pinning",
      "High-grade replacement zippers and threads",
      "Trouser, skirt, and dress hemming",
      "Seamless lining restoration",
      "Rapid turnaround options (express same-day)",
    ],
    process: [
      { step: "01", title: "Pinning & Fit", desc: "Try on the garment so we can pin the exact length or width adjustments." },
      { step: "02", title: "Deconstruction", desc: "Carefully opening original seams without damaging fabrics." },
      { step: "03", title: "Precision Sew", desc: "Sewing to the new measurements and matching the original stitch style." },
      { step: "04", title: "Press & Release", desc: "Professional iron press and quick pick-up." },
    ],
    faqs: [
      { q: "How long do alterations take?", a: "Standard alterations take 24 to 48 hours. Zip replacements and trouser hems can often be done on the same day if brought in early." },
      { q: "Can you resize a dress that is too small?", a: "Depending on the seam allowance inside the dress, we can often let out the seams to gain extra width, or insert custom side panels." },
    ],
    img: "https://images.unsplash.com/photo-1506812779316-934ccd483a53?w=800&auto=format&fit=crop&q=80",
  },
};

export default function ServiceLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const service = serviceDictionary[slug];

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-24 bg-bg-primary">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-xs text-text-tertiary hover:text-brand-plum dark:hover:text-brand-gold font-bold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Services</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Copy */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold uppercase tracking-widest">
                  <Scissors size={14} />
                  <span>Bespoke Specialty</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-plum dark:text-brand-gold leading-tight">
                  {service.title}
                </h1>
                
                <div className="flex gap-6 text-sm font-bold text-brand-gold">
                  <span className="bg-bg-tertiary dark:bg-bg-secondary px-3 py-1 rounded border border-border-custom">{service.price}</span>
                  <span className="bg-bg-tertiary dark:bg-bg-secondary px-3 py-1 rounded border border-border-custom">{service.turnaround}</span>
                </div>

                <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                  {service.longDescription}
                </p>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/254706232927?text=Hello%20Victory%20Fashion%20Design%2C%20I%20want%20to%20order%20or%20book%20a%20fitting%20for%20your%20${encodeURIComponent(service.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-8 py-3.5 rounded-md font-bold text-sm tracking-wider uppercase shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    <MessageCircle size={16} />
                    <span>Inquire / Book via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Photo Frame */}
              <div className="relative max-w-md mx-auto lg:mr-0 w-full">
                <div className="rounded-2xl overflow-hidden aspect-3/4 border-4 border-brand-cream dark:border-brand-charcoal shadow-2xl">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-bg-secondary border-y border-border-custom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-brand-plum dark:text-brand-gold text-center mb-10">
              What is included in the service
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.included.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-bg-primary p-6 rounded-lg border border-border-custom flex items-start gap-3 hover:shadow-sm transition-shadow"
                >
                  <CheckCircle size={18} className="text-brand-gold shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-brand-plum dark:text-brand-gold text-center mb-12">
              Our Tailoring Process
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.process.map((p, idx) => (
                <div key={idx} className="relative space-y-3">
                  <div className="text-4xl font-serif font-black text-brand-gold/30">
                    {p.step}
                  </div>
                  <h3 className="font-serif text-base font-bold">{p.title}</h3>
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-bg-secondary border-t border-border-custom">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-serif text-2xl font-bold text-brand-plum dark:text-brand-gold text-center mb-10">
              Service Questions & Answers
            </h2>
            <div className="space-y-6">
              {service.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-bg-primary rounded-xl border border-border-custom space-y-2 shadow-sm"
                >
                  <h4 className="font-serif text-sm sm:text-base font-bold text-brand-plum dark:text-brand-gold">
                    {faq.q}
                  </h4>
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
