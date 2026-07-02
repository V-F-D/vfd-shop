import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Missing orderNumber parameter" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: order, error } = await supabase
      .from("orders")
      .select("status, payment_status")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) {
      console.error("Fetch order status error:", error);
      return NextResponse.json(
        { error: "Failed to fetch order status", details: error.message },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: order.status,
      payment_status: order.payment_status,
    });
  } catch (error: any) {
    console.error("Order status API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
