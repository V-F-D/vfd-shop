import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, phone, message)" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: contactMsg, error } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email: email || null,
        phone,
        subject: subject || "General Inquiry",
        message,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase contact messages insert error:", error);
      return NextResponse.json(
        { error: "Failed to save message", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message submitted successfully",
      messageId: contactMsg.id,
    });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
