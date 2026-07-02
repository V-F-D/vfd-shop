import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, amount, accountReference } = body;

    // Validation
    if (!phoneNumber || !amount || !accountReference) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: phoneNumber, amount, accountReference" },
        { status: 400 }
      );
    }

    // Validate phone number format
    const cleanPhone = phoneNumber.replace(/[\s\+\-]/g, "");
    if (!/^254\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "Invalid phone number format. Use 254XXXXXXXXX" },
        { status: 400 }
      );
    }

    console.log("=== Next.js M-Pesa STK Push Request ===");
    console.log("Phone:", cleanPhone);
    console.log("Amount:", amount);
    console.log("Reference:", accountReference);

    // Get credentials
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortcode = process.env.MPESA_SHORTCODE || "174379";
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!consumerKey || !consumerSecret || !passkey || !callbackUrl) {
      console.error("Missing M-Pesa credentials in environment variables");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Step 1: Get Access Token
    const authString = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    
    const tokenResponse = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${authString}`,
        },
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token generation failed:", errorText);
      return NextResponse.json(
        { success: false, error: "Failed to authenticate with M-Pesa" },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Generate timestamp and password
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14); // YYYYMMDDHHmmss

    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    // Step 3: Make STK Push request
    const stkPushData = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount),
      PartyA: cleanPhone,
      PartyB: shortcode,
      PhoneNumber: cleanPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: `Payment for ${accountReference}`,
    };

    console.log("Sending STK Push to Safaricom Sandbox...");

    const stkResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPushData),
      }
    );

    const stkData = await stkResponse.json();
    console.log("M-Pesa Safaricom Response:", stkData);

    if (stkData.ResponseCode === "0") {
      // Update Order in Supabase with CheckoutRequestID & MerchantRequestID using service role (bypassing RLS)
      const supabase = getSupabaseAdmin();
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          checkout_request_id: stkData.CheckoutRequestID,
          mpesa_transaction_id: stkData.MerchantRequestID, // link MerchantRequestID
          payment_status: "processing",
        })
        .eq("order_number", accountReference);

      if (updateError) {
        console.error("Failed to update order with CheckoutRequestID:", updateError);
      }

      return NextResponse.json({
        success: true,
        message: "STK Push sent successfully",
        data: {
          MerchantRequestID: stkData.MerchantRequestID,
          CheckoutRequestID: stkData.CheckoutRequestID,
          ResponseCode: stkData.ResponseCode,
          ResponseDescription: stkData.ResponseDescription,
          CustomerMessage: stkData.CustomerMessage,
        },
      });
    } else {
      console.error("M-Pesa API error:", stkData);
      return NextResponse.json(
        {
          success: false,
          error: stkData.errorMessage || stkData.ResponseDescription || "Payment request failed",
          data: stkData,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("STK Push Route Handler Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
