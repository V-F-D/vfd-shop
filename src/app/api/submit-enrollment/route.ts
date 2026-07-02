import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      full_name,
      date_of_birth,
      gender,
      id_number,
      email,
      phone,
      address,
      city,
      county,
      education_level,
      has_experience,
      emergency_name,
      emergency_relationship,
      emergency_phone,
      intake_month,
      study_mode,
      additional_info,
    } = body;

    // Validation
    if (
      !full_name ||
      !date_of_birth ||
      !email ||
      !phone ||
      !id_number ||
      !intake_month ||
      !study_mode
    ) {
      return NextResponse.json(
        { error: "Missing required fields for student registration" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: enrollment, error } = await supabase
      .from("enrollments")
      .insert({
        full_name,
        date_of_birth,
        gender,
        id_number,
        email,
        phone,
        address,
        city,
        county,
        education_level,
        has_experience,
        emergency_name,
        emergency_relationship,
        emergency_phone,
        intake_month,
        study_mode,
        additional_info,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase enrollment insert error:", error);
      return NextResponse.json(
        { error: "Failed to save enrollment", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      enrollmentId: enrollment.id,
    });
  } catch (error: any) {
    console.error("Enrollment API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
