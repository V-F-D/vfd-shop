"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { useCart, CartItem } from "@/app/providers";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Search, Filter } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  badge?: string;
  stock_quantity: number;
}

const fallbackProducts: Product[] = [
  {
    id: "f1",
    name: "Floral Maxi Dress",
    category: "dresses",
    price: 2800,
    description: "Beautiful floral print maxi dress crafted from breathable lightweight crepe.",
    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=60",
    badge: "New",
    stock_quantity: 12,
  },
  {
    id: "f2",
    name: "Ankara Flare Dress",
    category: "dresses",
    price: 3200,
    description: "Vibrant custom African print flared dress with back zipper detailing.",
    image_url: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=500&auto=format&fit=crop&q=60",
    badge: "Popular",
    stock_quantity: 8,
  },
  {
    id: "f3",
    name: "Linen Co-ord Set",
    category: "two-pieces",
    price: 3800,
    description: "Premium matching lightweight linen shirt and trousers set.",
    image_url: "https://images.unsplash.com/photo-1506812779316-934ccd483a53?w=500&auto=format&fit=crop&q=60",
    badge: "New",
    stock_quantity: 6,
  },
  {
    id: "f4",
    name: "Tailored A-Line Skirt",
    category: "skirts",
    price: 1800,
    description: "A-line silhouette formal workwear skirt with detailed stitching.",
    image_url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60",
    badge: undefined,
    stock_quantity: 15,
  },
  {
    id: "f5",
    name: "Silk Wrap Blouse",
    category: "tops",
    price: 1500,
    description: "Elegant silk wrap-around top with adjustable sash cuffs.",
    image_url: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=500&auto=format&fit=crop&q=60",
    badge: "Sale",
    stock_quantity: 10,
  },
  {
    id: "f6",
    name: "Ankara Pencil Skirt",
    category: "skirts",
    price: 2000,
    description: "Modern high-waisted pencil skirt in bold Ankara fabric prints.",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
    badge: undefined,
    stock_quantity: 5,
  },
];

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true);

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data as Product[]);
        } else {
          // If Supabase table is empty, fall back to mock data
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error("Supabase products fetch failed:", err);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = [
    { value: "all", label: "All Items" },
    { value: "dresses", label: "Dresses" },
    { value: "tops", label: "Tops" },
    { value: "two-pieces", label: "Co-ord Sets" },
    { value: "skirts", label: "Skirts" },
  ];

  const filteredProducts =
    category === "all" ? products : products.filter((p) => p.category === category);

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-24 bg-bg-primary">
        {/* Header */}
        <section className="py-12 bg-bg-secondary border-b border-border-custom text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Ready-To-Wear</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Victory Shop
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Curated collection of handcrafted pieces. Select your items and checkout with secure Lipa Na M-Pesa.
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-6 border-b border-border-custom bg-bg-primary sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${
                    category === cat.value
                      ? "bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border-custom"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="py-20 flex justify-center items-center">
                <div className="h-10 w-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-text-tertiary font-serif text-lg">
                No items currently active in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-bg-secondary rounded-xl overflow-hidden border border-border-custom shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-bg-tertiary border-b border-border-custom">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-cover hover:scale-101 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                          <ShoppingCart size={40} />
                        </div>
                      )}
                      
                      {/* Badge */}
                      {p.badge && (
                        <span className="absolute top-4 left-4 bg-brand-gold text-brand-charcoal text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                          {p.badge}
                        </span>
                      )}
                    </div>

                    {/* Info Area */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider capitalize">
                          {p.category}
                        </span>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-text-primary pr-2">
                          {p.name}
                        </h3>
                        <p className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border-custom flex items-center justify-between">
                        <span className="text-base font-bold text-brand-plum dark:text-brand-gold">
                          KES {p.price.toLocaleString()}
                        </span>

                        <button
                          onClick={() =>
                            addToCart({
                              id: p.id,
                              name: p.name,
                              price: p.price,
                              image_url: p.image_url,
                              category: p.category,
                            })
                          }
                          className="bg-brand-plum hover:bg-brand-plum/90 dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow"
                        >
                          <ShoppingCart size={14} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
