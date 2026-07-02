"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import {
  Lock,
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  Users,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  badge?: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  payment_status: string;
  notes?: string;
  created_at: string;
  order_items: OrderItem[];
}

interface Enrollment {
  id: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  id_number: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  education_level: string;
  has_experience: string;
  emergency_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  intake_month: string;
  study_mode: string;
  additional_info?: string;
  status: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
  status: string;
  created_at: string;
}

// Curated Unsplash images of models with melanin-rich skin tones in premium designs
const defaultMelaninImages = [
  {
    label: "Melanin Ankara Gown",
    url: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Melanin Bridal Gown Fitting",
    url: "https://images.unsplash.com/photo-1594484208280-eae0044d6589?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Bespoke Suiting Textures",
    url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
  },
  {
    label: "Modern African Print Blazer",
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
  },
];

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products" | "enrollments" | "messages">("dashboard");

  // Database states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorBanner, setErrorBanner] = useState("");

  // Product CRUD states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form states
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("dresses");
  const [prodPrice, setProdPrice] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImageUrl, setProdImageUrl] = useState(defaultMelaninImages[0].url);
  const [prodBadge, setProdBadge] = useState("");
  const [prodStock, setProdStock] = useState("10");
  const [prodActive, setProdActive] = useState(true);

  // Load auth session on mount
  useEffect(() => {
    const cachedPin = sessionStorage.getItem("vfd_admin_pin");
    if (cachedPin === "1975") {
      setIsAuthenticated(true);
      fetchDashboardData(cachedPin);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1975") {
      setIsAuthenticated(true);
      setAuthError("");
      sessionStorage.setItem("vfd_admin_pin", "1975");
      fetchDashboardData("1975");
    } else {
      setAuthError("Invalid Admin PIN. Access Denied.");
      setPin("");
    }
  };

  const fetchDashboardData = async (authPin: string) => {
    setLoading(true);
    setErrorBanner("");
    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": authPin,
        },
        body: JSON.stringify({ action: "fetch_all" }),
      });

      const result = await res.json();

      if (res.ok) {
        setProducts(result.products || []);
        setOrders(result.orders || []);
        setEnrollments(result.enrollments || []);
        setMessages(result.messages || []);
      } else {
        throw new Error(result.error || "Failed to load dashboard statistics.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorBanner(err.message || "Failed to sync with Supabase database.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("vfd_admin_pin");
    setIsAuthenticated(false);
    setPin("");
  };

  // CRUD: Product Save (Create or Update)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = {
      name: prodName,
      category: prodCategory,
      price: parseFloat(prodPrice),
      description: prodDesc,
      image_url: prodImageUrl || defaultMelaninImages[0].url,
      badge: prodBadge || null,
      stock_quantity: parseInt(prodStock),
      is_active: prodActive,
    };

    setLoading(true);
    const authPin = sessionStorage.getItem("vfd_admin_pin") || "";

    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": authPin,
        },
        body: JSON.stringify({
          action: editingProduct ? "update" : "create",
          table: "products",
          id: editingProduct?.id,
          data: payload,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        // Refresh
        fetchDashboardData(authPin);
      } else {
        throw new Error(result.error || "Product update failed.");
      }
    } catch (err: any) {
      alert(`Database Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProdName("");
    setProdCategory("dresses");
    setProdPrice("");
    setProdDesc("");
    setProdImageUrl(defaultMelaninImages[0].url);
    setProdBadge("");
    setProdStock("10");
    setProdActive(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPrice(product.price.toString());
    setProdDesc(product.description || "");
    setProdImageUrl(product.image_url);
    setProdBadge(product.badge || "");
    setProdStock(product.stock_quantity.toString());
    setProdActive(product.is_active);
    setIsProductModalOpen(true);
  };

  const deleteProduct = async (prodId: string) => {
    if (!confirm("Are you sure you want to delete this product? This is irreversible.")) return;

    setLoading(true);
    const authPin = sessionStorage.getItem("vfd_admin_pin") || "";

    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": authPin,
        },
        body: JSON.stringify({
          action: "delete",
          table: "products",
          id: prodId,
        }),
      });

      if (res.ok) {
        fetchDashboardData(authPin);
      } else {
        const result = await res.json();
        throw new Error(result.error || "Product deletion failed.");
      }
    } catch (err: any) {
      alert(`Database Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CRUD: Update Order Status
  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoading(true);
    const authPin = sessionStorage.getItem("vfd_admin_pin") || "";

    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": authPin,
        },
        body: JSON.stringify({
          action: "update",
          table: "orders",
          id: orderId,
          data: { status },
        }),
      });

      if (res.ok) {
        fetchDashboardData(authPin);
      } else {
        const result = await res.json();
        throw new Error(result.error || "Order status update failed.");
      }
    } catch (err: any) {
      alert(`Database Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CRUD: Update Order Payment Status
  const updateOrderPaymentStatus = async (orderId: string, payment_status: string) => {
    setLoading(true);
    const authPin = sessionStorage.getItem("vfd_admin_pin") || "";

    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": authPin,
        },
        body: JSON.stringify({
          action: "update",
          table: "orders",
          id: orderId,
          data: { payment_status },
        }),
      });

      if (res.ok) {
        fetchDashboardData(authPin);
      } else {
        const result = await res.json();
        throw new Error(result.error || "Payment status update failed.");
      }
    } catch (err: any) {
      alert(`Database Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CRUD: Update Enrollment Status
  const updateEnrollmentStatus = async (enrolId: string, status: string) => {
    setLoading(true);
    const authPin = sessionStorage.getItem("vfd_admin_pin") || "";

    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": authPin,
        },
        body: JSON.stringify({
          action: "update",
          table: "enrollments",
          id: enrolId,
          data: { status },
        }),
      });

      if (res.ok) {
        fetchDashboardData(authPin);
      } else {
        const result = await res.json();
        throw new Error(result.error || "Enrollment status update failed.");
      }
    } catch (err: any) {
      alert(`Database Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CRUD: Update Message Status
  const updateMessageStatus = async (msgId: string, status: string) => {
    setLoading(true);
    const authPin = sessionStorage.getItem("vfd_admin_pin") || "";

    try {
      const res = await fetch("/api/admin/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": authPin,
        },
        body: JSON.stringify({
          action: "update",
          table: "contact_messages",
          id: msgId,
          data: { status },
        }),
      });

      if (res.ok) {
        fetchDashboardData(authPin);
      } else {
        const result = await res.json();
        throw new Error(result.error || "Message status update failed.");
      }
    } catch (err: any) {
      alert(`Database Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full bg-bg-secondary p-8 rounded-2xl border border-border-custom shadow-xl text-center space-y-6 stitch-border">
          <div className="h-12 w-12 bg-brand-plum/15 dark:bg-brand-gold/15 rounded-full flex items-center justify-center text-brand-plum dark:text-brand-gold mx-auto">
            <Lock size={22} />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-plum dark:text-brand-gold">
              Victory CRM Access
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Enter 4-digit administration PIN to manage inventory and student forms.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full text-center text-2xl tracking-widest bg-bg-primary border border-border-custom px-4 py-3 rounded-lg focus:outline-none focus:border-brand-gold font-mono"
            />
            {authError && (
              <p className="text-xs text-red-500 font-semibold">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-brand-plum dark:bg-brand-gold dark:text-brand-charcoal text-brand-cream py-3 rounded-md font-bold text-xs uppercase tracking-wider shadow"
            >
              Authorize Fitting CRM
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Statistics calculations
  const totalSales = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);

  const pendingEnrollmentsCount = enrollments.filter((e) => e.status === "pending").length;
  const newMessagesCount = messages.filter((m) => m.status === "new").length;

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="flex-1 pt-24 bg-bg-primary">
        {/* Header */}
        <section className="py-8 bg-bg-secondary border-b border-border-custom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                Fittings CRM
              </span>
              <h1 className="font-serif text-3xl font-bold text-brand-plum dark:text-brand-gold">
                Victory Admin Dashboard
              </h1>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => fetchDashboardData(sessionStorage.getItem("vfd_admin_pin") || "")}
                disabled={loading}
                className="bg-bg-primary hover:bg-bg-tertiary text-text-primary px-3 py-2 rounded-md border border-border-custom flex items-center gap-1.5 text-xs font-bold transition-all"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                <span>Refresh Sync</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-950/20 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 rounded-md border border-red-500/30 text-xs font-bold transition-all"
              >
                Log Out
              </button>
            </div>
          </div>
        </section>

        {/* Error Banner */}
        {errorBanner && (
          <div className="max-w-7xl mx-auto px-4 mt-6">
            <div className="bg-red-950/20 border border-red-500/30 text-red-600 p-4 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle size={16} />
              <span>{errorBanner}</span>
            </div>
          </div>
        )}

        {/* Workspace Layout */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 bg-bg-secondary rounded-xl border border-border-custom p-4 space-y-2">
              {[
                { tab: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
                { tab: "orders", label: "Manage Orders", icon: ListOrdered },
                { tab: "products", label: "Manage Products (CRUD)", icon: ShoppingBag },
                { tab: "enrollments", label: "Student Applications", icon: Users },
                { tab: "messages", label: "Contact Inquiries", icon: MessageSquare },
              ].map((item) => (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab as any);
                    setSearchTerm("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === item.tab
                      ? "bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal"
                      : "text-text-secondary hover:bg-bg-tertiary"
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Main Tabs Panel */}
            <div className="lg:col-span-9 bg-bg-secondary rounded-xl border border-border-custom p-6 min-h-[500px] shadow-sm">
              
              {/* Tab 1: Dashboard Overview */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <h2 className="font-serif text-lg font-bold border-b border-border-custom pb-2 text-brand-plum dark:text-brand-gold">
                    Overview Analytics
                  </h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Total Paid Sales", val: `KES ${totalSales.toLocaleString()}`, desc: "From paid orders", icon: DollarSign },
                      { label: "Active Inventory", val: products.length, desc: "Ready-to-wear items", icon: ShoppingBag },
                      { label: "Pending Intake", val: pendingEnrollmentsCount, desc: "Awaiting approval", icon: Users },
                      { label: "New Inquiries", val: newMessagesCount, desc: "Awaiting reading", icon: MessageSquare },
                    ].map((card, idx) => (
                      <div key={idx} className="bg-bg-primary p-4 rounded-xl border border-border-custom space-y-1 relative overflow-hidden">
                        <card.icon size={40} className="absolute right-2 bottom-2 text-brand-gold/10 pointer-events-none" />
                        <h4 className="text-[10px] text-text-tertiary uppercase tracking-wider font-extrabold">{card.label}</h4>
                        <div className="text-xl font-serif font-black text-brand-plum dark:text-brand-gold">{card.val}</div>
                        <p className="text-[9px] text-text-secondary">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick Activity feeds */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Recent Orders */}
                    <div className="bg-bg-primary p-5 rounded-xl border border-border-custom space-y-4">
                      <h3 className="font-serif text-sm font-bold text-text-primary">Recent Orders</h3>
                      <div className="space-y-2.5">
                        {orders.slice(0, 4).map((ord) => (
                          <div key={ord.id} className="flex justify-between items-center text-xs p-2.5 rounded bg-bg-secondary border border-border-custom">
                            <div>
                              <span className="font-mono font-bold text-brand-gold">{ord.order_number}</span>
                              <p className="text-[10px] text-text-secondary">{ord.customer_name}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              ord.payment_status === "paid" ? "bg-green-950/20 text-green-500" : "bg-yellow-950/20 text-yellow-500"
                            }`}>
                              {ord.payment_status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Student Applications */}
                    <div className="bg-bg-primary p-5 rounded-xl border border-border-custom space-y-4">
                      <h3 className="font-serif text-sm font-bold text-text-primary">Recent Academy Applicants</h3>
                      <div className="space-y-2.5">
                        {enrollments.slice(0, 4).map((enr) => (
                          <div key={enr.id} className="flex justify-between items-center text-xs p-2.5 rounded bg-bg-secondary border border-border-custom">
                            <div>
                              <span className="font-bold text-text-primary">{enr.full_name}</span>
                              <p className="text-[10px] text-text-secondary capitalize">{enr.study_mode} ({enr.intake_month})</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              enr.status === "approved" ? "bg-green-950/20 text-green-500" : "bg-blue-950/20 text-blue-500"
                            }`}>
                              {enr.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders Management */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border-custom pb-2">
                    <h2 className="font-serif text-lg font-bold text-brand-plum dark:text-brand-gold">
                      Orders Management
                    </h2>
                    <input
                      type="text"
                      placeholder="Search customer name or order #..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-bg-primary border border-border-custom px-3 py-1.5 rounded text-xs focus:outline-none focus:border-brand-gold max-w-xs w-full"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border-custom text-text-tertiary">
                          <th className="py-2.5">Order No</th>
                          <th>Customer</th>
                          <th>Delivery Address</th>
                          <th>Total</th>
                          <th>Order Status</th>
                          <th>Payment Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .filter((o) =>
                            o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((o) => (
                            <tr key={o.id} className="border-b border-border-custom hover:bg-bg-primary/50 transition-colors">
                              <td className="py-3 font-mono font-bold text-brand-gold">{o.order_number}</td>
                              <td>
                                <div className="font-bold">{o.customer_name}</div>
                                <div className="text-[10px] text-text-tertiary">{o.customer_phone}</div>
                              </td>
                              <td className="max-w-[150px] truncate">{o.delivery_address}</td>
                              <td className="font-bold">KES {o.total.toLocaleString()}</td>
                              <td>
                                <select
                                  value={o.status}
                                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                  className="bg-bg-primary border border-border-custom px-2 py-1 rounded text-[10px] text-text-primary"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  value={o.payment_status}
                                  onChange={(e) => updateOrderPaymentStatus(o.id, e.target.value)}
                                  className="bg-bg-primary border border-border-custom px-2 py-1 rounded text-[10px] text-text-primary"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="paid">Paid</option>
                                  <option value="failed">Failed</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Products CRUD (Products List & Modal Form) */}
              {activeTab === "products" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border-custom pb-2">
                    <h2 className="font-serif text-lg font-bold text-brand-plum dark:text-brand-gold">
                      Catalog Inventory (CRUD)
                    </h2>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search product name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-bg-primary border border-border-custom px-3 py-1.5 rounded text-xs focus:outline-none focus:border-brand-gold"
                      />
                      <button
                        onClick={openAddProductModal}
                        className="bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal px-3 py-1.5 rounded flex items-center gap-1 text-xs font-bold shadow"
                      >
                        <Plus size={14} />
                        <span>Add Product</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products
                      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((p) => (
                        <div key={p.id} className="bg-bg-primary p-4 rounded-xl border border-border-custom flex gap-4">
                          <div className="h-16 w-16 bg-bg-tertiary rounded overflow-hidden shrink-0 border border-border-custom">
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm text-text-primary pr-2 line-clamp-1">{p.name}</h4>
                                <span className={`text-[9px] px-1.5 rounded font-bold uppercase ${p.is_active ? 'bg-green-950/20 text-green-500' : 'bg-red-950/20 text-red-500'}`}>
                                  {p.is_active ? 'Active' : 'Draft'}
                                </span>
                              </div>
                              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block mt-0.5">{p.category}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-border-custom pt-2 mt-2">
                              <span className="font-bold text-xs">KES {p.price.toLocaleString()}</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  className="text-text-tertiary hover:text-brand-gold transition-colors p-1"
                                  title="Edit Product"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="text-text-tertiary hover:text-red-500 transition-colors p-1"
                                  title="Delete Product"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Student Applications */}
              {activeTab === "enrollments" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border-custom pb-2">
                    <h2 className="font-serif text-lg font-bold text-brand-plum dark:text-brand-gold">
                      Student Enrollments
                    </h2>
                    <input
                      type="text"
                      placeholder="Search student name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-bg-primary border border-border-custom px-3 py-1.5 rounded text-xs focus:outline-none focus:border-brand-gold max-w-xs w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    {enrollments
                      .filter((en) => en.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((en) => (
                        <div key={en.id} className="bg-bg-primary p-5 rounded-xl border border-border-custom space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-text-primary">{en.full_name}</h4>
                              <p className="text-[10px] text-text-tertiary">Registered on {new Date(en.created_at).toLocaleDateString()}</p>
                            </div>
                            <select
                              value={en.status}
                              onChange={(e) => updateEnrollmentStatus(en.id, e.target.value)}
                              className="bg-bg-secondary border border-border-custom px-2.5 py-1 rounded text-xs text-text-primary focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-text-secondary border-t border-b border-border-custom/50 py-3">
                            <div><strong>WhatsApp Phone:</strong> {en.phone}</div>
                            <div><strong>Intake Month:</strong> <span className="capitalize">{en.intake_month}</span></div>
                            <div><strong>Study Mode:</strong> <span className="capitalize">{en.study_mode}</span></div>
                            <div><strong>ID Number:</strong> {en.id_number}</div>
                            <div><strong>County:</strong> {en.county}</div>
                            <div><strong>Education:</strong> {en.education_level}</div>
                            <div><strong>Emergency Phone:</strong> {en.emergency_phone} ({en.emergency_name})</div>
                            <div><strong>Previous sewing exp:</strong> <span className="capitalize">{en.has_experience}</span></div>
                          </div>

                          {en.additional_info && (
                            <p className="text-[10px] text-text-tertiary italic">
                              <strong>Notes:</strong> "{en.additional_info}"
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Contact Messages */}
              {activeTab === "messages" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-border-custom pb-2">
                    <h2 className="font-serif text-lg font-bold text-brand-plum dark:text-brand-gold">
                      Contact Inquiries
                    </h2>
                    <input
                      type="text"
                      placeholder="Search sender name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-bg-primary border border-border-custom px-3 py-1.5 rounded text-xs focus:outline-none focus:border-brand-gold max-w-xs w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    {messages
                      .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((m) => (
                        <div key={m.id} className="bg-bg-primary p-5 rounded-xl border border-border-custom space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-text-primary">{m.name}</h4>
                              <p className="text-[10px] text-text-tertiary">{m.phone} | {m.email || 'No email'}</p>
                            </div>
                            <select
                              value={m.status}
                              onChange={(e) => updateMessageStatus(m.id, e.target.value)}
                              className="bg-bg-secondary border border-border-custom px-2.5 py-1 rounded text-xs text-text-primary focus:outline-none"
                            >
                              <option value="new">New</option>
                              <option value="read">Read</option>
                              <option value="replied">Replied</option>
                            </select>
                          </div>

                          <div className="p-3 bg-bg-secondary rounded border border-border-custom text-xs text-text-secondary leading-relaxed">
                            <strong className="block text-[10px] text-brand-gold uppercase tracking-wider mb-1">Subject: {m.subject || 'General Inquiry'}</strong>
                            "{m.message}"
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-bg-secondary text-text-primary p-6 sm:p-8 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-border-custom z-10 animate-in zoom-in-95">
            <h3 className="font-serif text-lg font-bold border-b border-border-custom pb-2 mb-4 text-brand-plum dark:text-brand-gold">
              {editingProduct ? "Edit Ready-To-Wear Product" : "Add New Ready-To-Wear Product"}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-text-secondary">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Ankara Mermaid Silhouette"
                  className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-secondary">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none"
                  >
                    <option value="dresses">Dresses</option>
                    <option value="tops">Tops</option>
                    <option value="two-pieces">Co-ord Sets</option>
                    <option value="skirts">Skirts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-secondary">Price (KES) *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="3500"
                    className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-text-secondary">Product Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Crafted from premium fabrics..."
                  className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold resize-none"
                />
              </div>

              {/* Melanin image picker selection */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-text-secondary">Image Selection (Melanin Rich Models)</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {defaultMelaninImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProdImageUrl(img.url)}
                      className={`text-[9px] px-2 py-1.5 border rounded-md text-left truncate flex items-center gap-1.5 transition-all ${
                        prodImageUrl === img.url ? 'border-brand-gold bg-bg-tertiary font-bold' : 'border-border-custom bg-bg-primary hover:bg-bg-tertiary/50'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0"></span>
                      <span>{img.label}</span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={prodImageUrl}
                  onChange={(e) => setProdImageUrl(e.target.value)}
                  placeholder="Custom image URL..."
                  className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none focus:border-brand-gold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-secondary">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-secondary">Badge (Optional)</label>
                  <input
                    type="text"
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    placeholder="New / Sale / Popular"
                    className="w-full bg-bg-primary border border-border-custom px-3 py-2 rounded text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="prodActive"
                  checked={prodActive}
                  onChange={(e) => setProdActive(e.target.checked)}
                  className="rounded border-border-custom text-brand-gold focus:ring-0 h-4 w-4 bg-bg-primary"
                />
                <label htmlFor="prodActive" className="text-xs text-text-secondary font-semibold cursor-pointer">
                  Is Active (visible in shop catalog)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border-custom">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-plum text-brand-cream dark:bg-brand-gold dark:text-brand-charcoal py-2.5 rounded font-bold text-xs uppercase tracking-wider shadow"
                >
                  {loading ? "Saving to Database..." : "Save Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 border border-border-custom rounded font-semibold text-xs uppercase tracking-wider text-text-secondary hover:bg-bg-tertiary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
