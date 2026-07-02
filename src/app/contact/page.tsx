"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        phone,
        subject: subject || "General Inquiry",
        message,
      };

      const res = await fetch("/api/submit-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        // Pre-fill WhatsApp message text for secondary direct click
        const whatsappText = `Hello Victory Fashion Design, my name is ${name}. I am writing about: "${subject || "General Inquiry"}". Message: "${message}"`;
        const whatsappUrl = `https://wa.me/254706232927?text=${encodeURIComponent(whatsappText)}`;
        
        // Reset form fields
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");

        // Show prompt to redirect to WhatsApp
        if (confirm("Message saved! Would you also like to open WhatsApp to chat with Antonina directly now?")) {
          window.open(whatsappUrl, "_blank");
        }
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.details || errData.error || "Failed to send message."}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-24 bg-bg-primary">
        {/* Header */}
        <section className="py-12 bg-bg-secondary border-b border-border-custom text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">Get In Touch</span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold mt-2 text-brand-plum dark:text-brand-gold">
              Contact Victory Studio
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
              Have a custom request or questions about our training academy? Send us a message or visit us in Ruiru.
            </p>
          </div>
        </section>

        {/* Contact Info and Form Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Contact Info Panel */}
              <div className="lg:col-span-5 space-y-8 bg-bg-secondary p-8 rounded-xl border border-border-custom shadow-sm stitch-border">
                <h3 className="font-serif text-xl font-bold text-brand-plum dark:text-brand-gold">
                  Studio Directory
                </h3>
                <div className="stitch-divider"></div>

                <div className="space-y-6">
                  {/* Map Pin */}
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-brand-plum/10 dark:bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-plum dark:text-brand-gold shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-text-tertiary">Location</h4>
                      <p className="text-sm text-text-secondary leading-relaxed mt-1">
                        2nd Sunrise Ave, Ruiru, Kiambu County, Kenya<br />
                        Near Rainbow Resort, off Thika Superhighway.
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-brand-plum/10 dark:bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-plum dark:text-brand-gold shrink-0">
                      <Phone size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-text-tertiary">Phone / WhatsApp</h4>
                      <p className="text-sm text-text-secondary mt-1">
                        <a href="tel:+254706232927" className="hover:underline font-semibold text-text-primary">
                          +254 706 232 927
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-brand-plum/10 dark:bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-plum dark:text-brand-gold shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-text-tertiary">Email</h4>
                      <p className="text-sm text-text-secondary mt-1">
                        info@victoryfashion.co.ke
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 bg-brand-plum/10 dark:bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-plum dark:text-brand-gold shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-text-tertiary">Studio Hours</h4>
                      <p className="text-sm text-text-secondary mt-1">
                        Monday – Saturday: 8:00 AM – 6:00 PM<br />
                        Sunday: Closed (Fitting by appointment only)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form Panel */}
              <div className="lg:col-span-7">
                {success ? (
                  <div className="bg-bg-secondary p-8 rounded-xl border border-brand-gold text-center space-y-4 shadow-lg animate-in zoom-in-95">
                    <CheckCircle size={48} className="text-green-600 dark:text-green-400 mx-auto" />
                    <h3 className="font-serif text-xl font-bold">Message Sent!</h3>
                    <p className="text-sm text-text-secondary max-w-sm mx-auto">
                      Thank you for contacting Victory Fashion Design. We have logged your inquiry and will respond shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleContactSubmit}
                    className="bg-bg-secondary p-6 sm:p-8 rounded-xl border border-border-custom shadow-xl space-y-5"
                  >
                    <h3 className="font-serif text-lg font-bold border-b border-border-custom pb-2 mb-2 text-brand-plum dark:text-brand-gold">
                      Send a Message
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-text-secondary">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Antonina Harrison"
                          className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-text-secondary">WhatsApp Phone *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 0706232927"
                          className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-text-secondary">Email Address (Optional)</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. name@domain.com"
                          className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-text-secondary">Subject (Optional)</label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Custom dress booking"
                          className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-secondary">Your Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please describe what garment style, fabric choices, or academy questions you have..."
                        className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal py-3.5 rounded-md font-bold text-sm uppercase tracking-wider shadow hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>

                  </form>
                )}
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
