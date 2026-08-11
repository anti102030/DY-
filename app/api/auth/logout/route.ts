import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  hashSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/memberAuth";

export async function POST(
  request: NextRequest,
) {
  try {
    const token =
      request.cookies.get(
        SESSION_COOKIE_NAME,
      )?.value;

    if (token) {
      const tokenHash =
        hashSessionToken(token);

      await supabaseAdmin
        .from("member_sessions")
        .delete()
        .eq("token_hash", tokenHash);
    }

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV ===
        "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}