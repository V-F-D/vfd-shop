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
