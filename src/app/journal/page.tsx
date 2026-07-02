"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { BookOpen, Calendar, Clock, ChevronRight } from "lucide-react";

interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  img: string;
}

export default function JournalPage() {
  const posts: Post[] = [
    {
      id: "1",
      title: "How to Measure Yourself for a Bespoke Dress Fitting",
      category: "Guides",
      date: "June 24, 2026",
      readTime: "5 min read",
      excerpt: "Drafting a custom paper pattern requires precision. Learn the 8 critical measurements you can take at home before your first studio fitting.",
      img: "https://images.unsplash.com/photo-1506812779316-934ccd483a53?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      title: "5 Elegant Ankara Styles for Bridal Group Parties",
      category: "Inspiration",
      date: "May 18, 2026",
      readTime: "4 min read",
      excerpt: "Bridal chamas and cohorts are embracing vibrant African print designs. Discover our curated panel patterns and gold stitching layouts.",
      img: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      title: "The Ultimate Guide to Selecting Premium Suiting Fabrics",
      category: "Fabric Science",
      date: "April 10, 2026",
      readTime: "7 min read",
      excerpt: "Sourcing premium wool blends vs blended cottons. Antonina Harrison breaks down yarn counts and weave options for custom suits.",
      img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
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
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Fashion & Styling</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Victory Journal
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Expert advice on custom measurement, bridal fabrics, African modern designs, and fashion training.
            </p>
          </div>
        </section>

        {/* Blog Post List */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-bg-secondary rounded-2xl border border-border-custom overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 sm:p-6"
                >
                  {/* Post Image */}
                  <div className="md:col-span-4 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-bg-tertiary">
                    <img
                      src={post.img}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-brand-gold uppercase tracking-wider">
                      <span>{post.category}</span>
                      <span className="text-text-tertiary font-normal">•</span>
                      <span className="text-text-secondary font-normal flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{post.date}</span>
                      </span>
                      <span className="text-text-tertiary font-normal">•</span>
                      <span className="text-text-secondary font-normal flex items-center gap-1">
                        <Clock size={12} />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-text-primary hover:text-brand-plum dark:hover:text-brand-gold transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="pt-2">
                      <button className="text-brand-plum dark:text-brand-gold font-bold text-xs uppercase tracking-wider flex items-center gap-1 hover:underline">
                        <span>Read Full Post</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
