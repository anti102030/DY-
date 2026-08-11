import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  createSessionToken,
  hashSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifyPassword,
} from "@/lib/memberAuth";

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const loginId = String(
      body.login_id ?? "",
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password ?? "",
    );

    if (!loginId || !password) {
      return NextResponse.json(
        {
          error:
            "아이디와 비밀번호를 입력해주세요.",
        },
        { status: 400 },
      );
    }

    const {
      data: member,
      error,
    } = await supabaseAdmin
      .from("members")
      .select(
        "id, login_id, password_hash, name, phone, marketing_agree, interest_region",
      )
      .eq("login_id", loginId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    if (!member) {
      return NextResponse.json(
        {
          error:
            "아이디 또는 비밀번호가 올바르지 않습니다.",
        },
        { status: 401 },
      );
    }

    const passwordMatches =
      verifyPassword(
        password,
        member.password_hash,
      );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          error:
            "아이디 또는 비밀번호가 올바르지 않습니다.",
        },
        { status: 401 },
      );
    }

    const token = createSessionToken();

    const tokenHash =
      hashSessionToken(token);

    const expiresAt = new Date(
      Date.now() +
        SESSION_MAX_AGE_SECONDS * 1000,
    ).toISOString();

    const { error: sessionError } =
      await supabaseAdmin
        .from("member_sessions")
        .insert({
          member_id: member.id,
          token_hash: tokenHash,
          expires_at: expiresAt,
        });

    if (sessionError) {
      return NextResponse.json(
        {
          error: sessionError.message,
        },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      success: true,
      member: {
        id: member.id,
        login_id: member.login_id,
        name: member.name,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV ===
        "production",
      path: "/",
      maxAge:
        SESSION_MAX_AGE_SECONDS,
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