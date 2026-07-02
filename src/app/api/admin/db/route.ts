import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const pin = request.headers.get("x-admin-pin");
    if (pin !== "1975") {
      return NextResponse.json({ error: "Unauthorized. Invalid Admin PIN." }, { status: 401 });
    }

    const body = await request.json();
    const { action, table, data, id } = body;

    const supabase = getSupabaseAdmin();

    if (action === "fetch_all") {
      // Fetch all tables in parallel for dashboard efficiency
      const [
        { data: products, error: prodErr },
        { data: orders, error: ordErr },
        { data: enrollments, error: enrolErr },
        { data: messages, error: msgErr },
      ] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
        supabase.from("enrollments").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      ]);

      if (prodErr || ordErr || enrolErr || msgErr) {
        return NextResponse.json(
          {
            error: "Failed to fetch dashboard data",
            details: { prodErr, ordErr, enrolErr, msgErr },
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ products, orders, enrollments, messages });
    }

    if (action === "seed") {
      const { force } = body;
      if (force) {
        // Delete all products to clear old data
        const { error: delErr } = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (delErr) throw delErr;
      } else {
        const { data: existingProducts } = await supabase.from("products").select("id").limit(1);
        if (existingProducts && existingProducts.length > 0) {
          return NextResponse.json({ success: false, message: "Database is already seeded with products." });
        }
      }

      const seedData = [
        {
          name: "Floral Crepe Maxi Dress",
          price: 2800,
          category: "dresses",
          description: "Stunning floral print maxi dress featuring lightweight breathable crepe and a relaxed silhouette, modeled beautifully by African talent.",
          image_url: "https://images.unsplash.com/photo-1607823014134-2e6f9d2d0c26?w=800&auto=format&fit=crop&q=80",
          badge: "New",
          stock_quantity: 15,
          is_active: true
        },
        {
          name: "Vibrant Ankara Flare Dress",
          price: 3200,
          category: "dresses",
          description: "Custom flared Ankara wax fabric gown with gold pleated border accents, showing off premium melanin-rich styling.",
          image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
          badge: "Popular",
          stock_quantity: 10,
          is_active: true
        },
        {
          name: "Bespoke Charcoal Double-Breasted Suit",
          price: 7500,
          category: "two-pieces",
          description: "Premium tailored mens corporate suit with structured shoulder profile padding and custom gold thread borders.",
          image_url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
          badge: "New",
          stock_quantity: 5,
          is_active: true
        },
        {
          name: "Elegant Satin Sweetheart Bridal Gown",
          price: 12000,
          category: "dresses",
          description: "Stellar custom evening sweetheart bridal reception gown with off-shoulder layered silk laces.",
          image_url: "https://images.unsplash.com/photo-1594484208280-eae0044d6589?w=800&auto=format&fit=crop&q=80",
          badge: "Featured",
          stock_quantity: 3,
          is_active: true
        },
        {
          name: "Linen Weekend Co-ord Set",
          price: 3800,
          category: "two-pieces",
          description: "High-grade breathable cream linen set suitable for weekend chamas and outdoor events.",
          image_url: "https://images.unsplash.com/photo-1506812779316-934ccd483a53?w=800&auto=format&fit=crop&q=80",
          badge: "Hot",
          stock_quantity: 8,
          is_active: true
        },
        {
          name: "Handmade Ankara Pencil Skirt",
          price: 2000,
          category: "skirts",
          description: "High-waisted fitted pencil skirt in vibrant heritage pattern, constructed specifically for elegant office settings.",
          image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
          badge: "Sale",
          stock_quantity: 12,
          is_active: true
        }
      ];

      const { data: inserted, error } = await supabase.from("products").insert(seedData).select();
      if (error) throw error;
      return NextResponse.json({ success: true, count: inserted.length });
    }

    if (table === "products") {
      if (action === "create") {
        const { data: newProd, error } = await supabase
          .from("products")
          .insert(data)
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ success: true, item: newProd });
      }

      if (action === "update") {
        const { data: updatedProd, error } = await supabase
          .from("products")
          .update(data)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return NextResponse.json({ success: true, item: updatedProd });
      }

      if (action === "delete") {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }
    }

    if (table === "orders" && action === "update") {
      const { data: updatedOrder, error } = await supabase
        .from("orders")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, item: updatedOrder });
    }

    if (table === "enrollments" && action === "update") {
      const { data: updatedEnrollment, error } = await supabase
        .from("enrollments")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, item: updatedEnrollment });
    }

    if (table === "contact_messages" && action === "update") {
      const { data: updatedMsg, error } = await supabase
        .from("contact_messages")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, item: updatedMsg });
    }

    return NextResponse.json({ error: "Invalid action or table parameters." }, { status: 400 });
  } catch (error: any) {
    console.error("Admin Database API Error:", error);
    return NextResponse.json(
      { error: "Database operation failed", details: error.message },
      { status: 500 }
    );
  }
}
