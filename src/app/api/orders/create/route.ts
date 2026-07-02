import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_number,
      customer_name,
      customer_phone,
      delivery_address,
      subtotal,
      delivery_fee,
      total,
      payment_method,
      items,
    } = body;

    // Validation
    if (
      !order_number ||
      !customer_name ||
      !customer_phone ||
      !delivery_address ||
      subtotal === undefined ||
      total === undefined ||
      !items ||
      !Array.isArray(items)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number,
        customer_name,
        customer_phone,
        delivery_address,
        subtotal,
        delivery_fee,
        total,
        status: "pending",
        payment_status: payment_method === "whatsapp" ? "unpaid" : "pending",
        notes: `Placed via ${payment_method === "whatsapp" ? "WhatsApp Order Flow" : "M-Pesa STK Push Flow"}.`,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Supabase Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order in database", details: orderError.message },
        { status: 500 }
      );
    }

    // 2. Insert order items
    const orderItemsData = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) {
      console.error("Supabase Order Items insertion error:", itemsError);
      // We don't fail the entire response, but logging is critical
    }

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
