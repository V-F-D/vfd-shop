"use client";

import React, { useState } from "react";
import { useCart } from "@/app/providers";
import { X, Plus, Minus, Trash2, ShoppingBag, Phone, CreditCard } from "lucide-react";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "paying">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stk" | "whatsapp">("whatsapp");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  const deliveryFee = cartTotal >= 5000 ? 0 : 300;
  const grandTotal = cartTotal + deliveryFee;

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset state after drawer closes
    setTimeout(() => {
      setCheckoutStep("cart");
      setPaymentStatus("");
      setLoading(false);
    }, 300);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert("Please fill in all fields");
      return;
    }

    // Clean phone number
    let cleanPhone = phone.replace(/[\s\+\-]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "254" + cleanPhone.substring(1);
    }
    if (!/^254\d{9}$/.test(cleanPhone)) {
      alert("Please enter a valid phone number in format 254XXXXXXXXX or 07XXXXXXXX");
      return;
    }

    setLoading(true);

    if (paymentMethod === "whatsapp") {
      try {
        // Construct WhatsApp order text
        const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
        let message = `*NEW ORDER ${orderNumber}*\n`;
        message += `Name: ${name}\n`;
        message += `Phone: ${cleanPhone}\n`;
        message += `Address: ${address}\n\n`;
        message += `*ITEMS:*\n`;
        cart.forEach((item) => {
          message += `- ${item.name} (x${item.quantity}) — KES ${(item.price * item.quantity).toLocaleString()}\n`;
        });
        message += `\n*Subtotal:* KES ${cartTotal.toLocaleString()}\n`;
        message += `*Delivery:* ${deliveryFee === 0 ? "FREE" : "KES " + deliveryFee}\n`;
        message += `*TOTAL:* KES ${grandTotal.toLocaleString()}\n\n`;
        message += `Hello Victory Fashion, I'd like to confirm this order.`;

        // Save order to Supabase first via a server action or API route (optional, let's keep it robust)
        await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: orderNumber,
            customer_name: name,
            customer_phone: cleanPhone,
            delivery_address: address,
            subtotal: cartTotal,
            delivery_fee: deliveryFee,
            total: grandTotal,
            payment_method: "whatsapp",
            items: cart.map((item) => ({
              product_id: item.id,
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
          }),
        });

        const whatsappUrl = `https://wa.me/254706232927?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        clearCart();
        handleClose();
      } catch (err) {
        console.error(err);
        alert("Something went wrong placing the order.");
      } finally {
        setLoading(false);
      }
    } else {
      // M-Pesa STK Push
      setCheckoutStep("paying");
      setPaymentStatus("Sending M-Pesa STK Push prompt to your phone...");
      try {
        const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
        
        // 1. Create order in Supabase
        const orderRes = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_number: orderNumber,
            customer_name: name,
            customer_phone: cleanPhone,
            delivery_address: address,
            subtotal: cartTotal,
            delivery_fee: deliveryFee,
            total: grandTotal,
            payment_method: "mpesa_stk",
            items: cart.map((item) => ({
              product_id: item.id,
              product_name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
          }),
        });

        if (!orderRes.ok) {
          throw new Error("Failed to create order");
        }

        // 2. Trigger STK push
        const payRes = await fetch("/api/mpesa-stk-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: cleanPhone,
            amount: grandTotal,
            accountReference: orderNumber,
          }),
        });

        const payData = await payRes.json();

        if (payRes.ok && payData.success) {
          setPaymentStatus("Prompt sent! Enter your M-Pesa PIN on your phone to complete payment. We are checking payment status...");
          
          // Poll for payment success status (simulate or check DB)
          let attempts = 0;
          const interval = setInterval(async () => {
            attempts++;
            if (attempts > 12) { // 1 minute timeout
              clearInterval(interval);
              setPaymentStatus("Payment check timeout. If you completed payment, our team will contact you once confirmed via WhatsApp!");
              setLoading(false);
              setTimeout(() => {
                clearCart();
                handleClose();
              }, 5000);
              return;
            }

            const statusRes = await fetch(`/api/orders/status?orderNumber=${orderNumber}`);
            const statusData = await statusRes.json();

            if (statusData.payment_status === "paid") {
              clearInterval(interval);
              setPaymentStatus("🎉 Payment Successful! Your order is confirmed.");
              setLoading(false);
              setTimeout(() => {
                clearCart();
                handleClose();
              }, 3000);
            } else if (statusData.payment_status === "failed") {
              clearInterval(interval);
              setPaymentStatus("❌ M-Pesa Payment failed or cancelled.");
              setLoading(false);
            }
          }, 5000);
        } else {
          throw new Error(payData.error || "M-Pesa STK push request failed.");
        }
      } catch (err: any) {
        console.error(err);
        setPaymentStatus(`Error: ${err.message || "Failed to trigger payment"}. Redirecting you to WhatsApp order fallback...`);
        setTimeout(() => {
          setPaymentMethod("whatsapp");
          setCheckoutStep("form");
          setLoading(false);
        }, 4000);
      }
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Panel Wrapper */}
        <div className="w-screen max-w-md bg-bg-secondary text-text-primary shadow-2xl flex flex-col border-l border-border-custom animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-border-custom flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold flex items-center gap-2">
              <ShoppingBag size={20} className="text-brand-gold" />
              <span>Shopping Cart</span>
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-bg-tertiary transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 bg-bg-tertiary rounded-full flex items-center justify-center text-text-tertiary stitch-border">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <p className="font-serif text-base font-bold">Your cart is empty</p>
                  <p className="text-sm text-text-tertiary mt-1">
                    Explore our ready-to-wear shop to add items here.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal px-6 py-2 rounded-md font-semibold text-sm hover:opacity-90"
                >
                  Start Shopping
                </button>
              </div>
            ) : checkoutStep === "cart" ? (
              /* Item List Step */
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-bg-primary rounded-lg border border-border-custom relative group"
                  >
                    {/* Product Image */}
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 rounded-md object-cover border border-border-custom bg-bg-secondary"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-bg-tertiary flex items-center justify-center text-text-tertiary border border-border-custom">
                        <ShoppingBag size={20} />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold pr-6 line-clamp-1">{item.name}</h4>
                        <span className="text-xs text-text-tertiary capitalize">{item.category}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-brand-plum dark:text-brand-gold">
                          KES {item.price.toLocaleString()}
                        </span>
                        
                        {/* Quantity Buttons */}
                        <div className="flex items-center border border-border-custom rounded bg-bg-secondary">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-bg-tertiary transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-bg-tertiary transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 text-text-tertiary hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : checkoutStep === "form" ? (
              /* Checkout Form Step */
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="font-serif text-sm font-bold border-b border-border-custom pb-2 mb-2 text-brand-plum dark:text-brand-gold">
                  Delivery & Contact Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-text-secondary">Full Name *</label>
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
                    <label className="block text-xs font-semibold mb-1 text-text-secondary">M-Pesa Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 254706232927 or 0706232927"
                      className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-text-secondary">Delivery Address / Town *</label>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Ruiru, Sunrise Estate, House A12"
                      className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold resize-none"
                    />
                  </div>
                </div>
              </form>
            ) : (
              /* Paying / Processing state */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                <div className="h-12 w-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
                <p className="font-serif text-sm font-semibold">{paymentStatus}</p>
              </div>
            )}
          </div>

          {/* Footer Totals & Buttons */}
          {cart.length > 0 && (
            <div className="border-t border-border-custom bg-bg-primary p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-semibold">KES {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Delivery Fee</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? "FREE" : `KES ${deliveryFee}`}
                  </span>
                </div>
                <div className="stitch-divider my-2"></div>
                <div className="flex justify-between text-base font-bold">
                  <span>Grand Total</span>
                  <span className="text-brand-plum dark:text-brand-gold">
                    KES {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {checkoutStep === "cart" && (
                <button
                  onClick={() => setCheckoutStep("form")}
                  className="w-full bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal py-3 rounded-md font-bold text-sm tracking-wider uppercase hover:opacity-95 transition-opacity"
                >
                  Checkout Order
                </button>
              )}

              {checkoutStep === "form" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckoutStep("cart")}
                    disabled={loading}
                    className="flex-1 bg-bg-tertiary text-text-primary py-3 rounded-md font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Back to Cart
                  </button>
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={loading}
                    className="flex-1 bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal py-3 rounded-md font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="h-4 w-4 border-2 border-brand-cream dark:border-brand-charcoal border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span>Place Order</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
