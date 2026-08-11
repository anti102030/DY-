import {
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

import {
  hashSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/memberAuth";

export async function GET(
  request: NextRequest,
) {
  try {
    const token =
      request.cookies.get(
        SESSION_COOKIE_NAME,
      )?.value;

    if (!token) {
      return NextResponse.json({
        loggedIn: false,
      });
    }

    const tokenHash =
      hashSessionToken(token);

    const {
      data: session,
      error: sessionError,
    } = await supabaseAdmin
      .from("member_sessions")
      .select(
        "id, member_id, expires_at",
      )
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (sessionError || !session) {
      return NextResponse.json({
        loggedIn: false,
      });
    }

    if (
      new Date(session.expires_at).getTime() <
      Date.now()
    ) {
      await supabaseAdmin
        .from("member_sessions")
        .delete()
        .eq("id", session.id);

      const response =
        NextResponse.json({
          loggedIn: false,
        });

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: "",
        path: "/",
        maxAge: 0,
      });

      return response;
    }

    const {
      data: member,
      error: memberError,
    } = await supabaseAdmin
      .from("members")
      .select(
        "id, login_id, name, phone, marketing_agree, interest_region",
      )
      .eq("id", session.member_id)
      .maybeSingle();

    if (
      memberError ||
      !member
    ) {
      return NextResponse.json({
        loggedIn: false,
      });
    }

    return NextResponse.json({
      loggedIn: true,
      member,
    });
  } catch {
    return NextResponse.json({
      loggedIn: false,
    });
  }
}