import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const callbackData = await request.json();
    console.log("M-Pesa Callback received:", JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    if (!Body || !Body.stkCallback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid Callback Data" }, { status: 400 });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    } = Body.stkCallback;

    const supabase = getSupabaseAdmin();

    if (ResultCode === 0) {
      // Payment successful
      const { CallbackMetadata } = Body.stkCallback;
      const metadata: Record<string, any> = {};

      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach((item: any) => {
          metadata[item.Name] = item.Value;
        });
      }

      console.log("Parsed M-Pesa Callback Metadata:", metadata);

      const mpesaReceiptNumber = metadata.MpesaReceiptNumber;
      const amount = metadata.Amount;

      // Update Order Status in Supabase using admin client (bypassing RLS)
      const { data: updatedOrder, error: orderError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "confirmed",
          mpesa_transaction_id: mpesaReceiptNumber,
          notes: `Paid KES ${amount} via M-Pesa. Receipt: ${mpesaReceiptNumber}. Description: ${ResultDesc}.`,
        })
        .eq("checkout_request_id", CheckoutRequestID)
        .select()
        .single();

      if (orderError) {
        console.error("Failed to update order status upon M-Pesa callback:", orderError);
      } else if (updatedOrder) {
        console.log(`Order ${updatedOrder.order_number} marked as Paid!`);
        
        // Deduct Stock Quantity
        const { data: orderItems } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .eq("order_id", updatedOrder.id);

        if (orderItems && orderItems.length > 0) {
          for (const item of orderItems) {
            if (item.product_id) {
              try {
                // Get current stock
                const { data: product } = await supabase
                  .from("products")
                  .select("stock_quantity")
                  .eq("id", item.product_id)
                  .single();

                if (product) {
                  const newStock = Math.max(0, (product.stock_quantity || 0) - item.quantity);
                  await supabase
                    .from("products")
                    .update({ stock_quantity: newStock })
                    .eq("id", item.product_id);
                  console.log(`Deducted stock for product ${item.product_id} to ${newStock}`);
                }
              } catch (err) {
                console.error(`Failed to update stock for product ${item.product_id}:`, err);
              }
            }
          }
        }
      }
    } else {
      // Payment failed or cancelled
      console.log(`Payment failed for CheckoutRequestID ${CheckoutRequestID}. ResultCode: ${ResultCode}, ResultDesc: ${ResultDesc}`);
      
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          notes: `M-Pesa payment failed or cancelled: ${ResultDesc}`,
        })
        .eq("checkout_request_id", CheckoutRequestID);
    }

    // Always return a success response to Safaricom to prevent retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Callback processed successfully",
    });
  } catch (error: any) {
    console.error("M-Pesa Callback Handler Error:", error);
    // Return success to Safaricom to prevent loops, but log internally
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Error processed",
    });
  }
}
