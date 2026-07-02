"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { X, Search, Heart, MessageSquare } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: "bridal" | "traditional" | "formal" | "casual";
  categoryLabel: string;
  img: string;
  description: string;
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState<"all" | "bridal" | "traditional" | "formal" | "casual">("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const portfolioItems: PortfolioItem[] = [
    {
      id: "1",
      title: "Royal Plum Bridal Gown",
      category: "bridal",
      categoryLabel: "Bridal Wear",
      img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
      description: "Custom evening reception bridal gown with a structured sweetheart bodice, gold thread accents, and soft layered tulle.",
    },
    {
      id: "2",
      title: "Ankara Flare Silhouette",
      category: "traditional",
      categoryLabel: "Traditional / African",
      img: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=800&auto=format&fit=crop&q=80",
      description: "Modern Ankara prints pleated skirt with custom matching bodice, tailored specifically for wedding attendees.",
    },
    {
      id: "3",
      title: "Bespoke Charcoal Double-Breasted",
      category: "formal",
      categoryLabel: "Formal Attire",
      img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
      description: "Men's tailored slim-fit double-breasted suit using high-grade British wool blend fabric.",
    },
    {
      id: "4",
      title: "Modern Minimalist Bridal Dress",
      category: "bridal",
      categoryLabel: "Bridal Wear",
      img: "https://images.unsplash.com/photo-1594484208280-eae0044d6589?w=800&auto=format&fit=crop&q=80",
      description: "Sleek off-shoulder satin sheath wedding gown designed for the elegant minimalist bride.",
    },
    {
      id: "5",
      title: "Linen Weekend Outfit",
      category: "casual",
      categoryLabel: "Casual Wear",
      img: "https://images.unsplash.com/photo-1506812779316-934ccd483a53?w=800&auto=format&fit=crop&q=80",
      description: "Breathable natural linen button-down shirt paired with tailored shorts for casual weekend styling.",
    },
    {
      id: "6",
      title: "Kente Accent Dress",
      category: "traditional",
      categoryLabel: "Traditional / African",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      description: "Custom evening gown with hand-woven Ghanaian Kente panel details framing the shoulders and neckline.",
    },
  ];

  const filteredItems = filter === "all" ? portfolioItems : portfolioItems.filter(item => item.category === filter);

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-24 bg-bg-primary">
        {/* Header */}
        <section className="py-12 bg-bg-secondary border-b border-border-custom text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Our Masterpieces</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Client Portfolio
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Browse through our hand-crafted bespoke suits, wedding gowns, traditional Ankara designs, and casual wear.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-8 border-b border-border-custom sticky top-16 bg-bg-primary/95 backdrop-blur-sm z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { filterValue: "all", label: "All Works" },
                { filterValue: "bridal", label: "Bridal Wear" },
                { filterValue: "traditional", label: "African / Ankara" },
                { filterValue: "formal", label: "Formal Attire" },
                { filterValue: "casual", label: "Casual Sets" },
              ].map((btn) => (
                <button
                  key={btn.filterValue}
                  onClick={() => setFilter(btn.filterValue as any)}
                  className={`px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${
                    filter === btn.filterValue
                      ? "bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border-custom"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredItems.length === 0 ? (
              <div className="py-20 text-center text-text-tertiary font-serif text-lg">
                No designs found in this category. Check back soon!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group bg-bg-secondary rounded-xl overflow-hidden border border-border-custom shadow-sm hover:shadow-xl cursor-pointer hover:border-brand-gold transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-3/4 overflow-hidden bg-bg-tertiary">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-brand-cream text-brand-charcoal text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-md shadow-lg border border-brand-gold flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <Search size={14} />
                          <span>View Detail</span>
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                      <h3 className="font-serif text-base font-bold text-text-primary pr-2">
                        {item.title}
                      </h3>
                      <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setSelectedItem(null)} />
            
            <div className="relative bg-bg-secondary text-text-primary rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-border-custom z-10 animate-in zoom-in-95 duration-300 grid grid-cols-1 md:grid-cols-2">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/40 text-white hover:bg-black/60 p-2 rounded-full transition-colors z-20"
                aria-label="Close details"
              >
                <X size={18} />
              </button>

              {/* Gown Image */}
              <div className="aspect-3/4 bg-bg-tertiary">
                <img
                  src={selectedItem.img}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gown Info Details */}
              <div className="p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest block">
                    {selectedItem.categoryLabel}
                  </span>
                  <h3 className="font-serif text-2xl font-bold">
                    {selectedItem.title}
                  </h3>
                  <div className="stitch-divider"></div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selectedItem.description}
                  </p>
                  <p className="text-xs text-text-tertiary italic">
                    * Note: This is a bespoke custom order item. Each piece is constructed specifically for the client's body measurements.
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <a
                    href={`https://wa.me/254706232927?text=Hello%20Victory%20Fashion%2C%20I%20am%20inquiring%20about%20ordering%20a%20bespoke%20design%20similar%20to%20your%20${encodeURIComponent(selectedItem.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream py-3 rounded-md font-bold text-sm uppercase tracking-wider shadow hover:opacity-90 transition-opacity"
                  >
                    <MessageSquare size={16} />
                    <span>Inquire via WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full text-center text-xs text-text-tertiary hover:underline"
                  >
                    Back to Gallery
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
