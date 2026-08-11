import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  createSessionToken,
  hashPassword,
  hashSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
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

    const name = String(
      body.name ?? "",
    ).trim();

    const phone = String(
      body.phone ?? "",
    ).replace(/\D/g, "");

    const marketingAgree =
      body.marketing_agree === true;

    const interestRegion = String(
      body.interest_region ?? "",
    ).trim();

    if (
      !/^[a-z0-9]{6,12}$/.test(loginId)
    ) {
      return NextResponse.json(
        {
          error:
            "아이디는 영문/숫자 6~12자리로 입력해주세요.",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error:
            "비밀번호는 6자 이상 입력해주세요.",
        },
        { status: 400 },
      );
    }

    if (!name) {
      return NextResponse.json(
        {
          error: "이름을 입력해주세요.",
        },
        { status: 400 },
      );
    }

    if (phone.length < 10) {
      return NextResponse.json(
        {
          error:
            "휴대전화 번호를 확인해주세요.",
        },
        { status: 400 },
      );
    }

    const {
      data: existingMember,
      error: existingError,
    } = await supabaseAdmin
      .from("members")
      .select("id")
      .eq("login_id", loginId)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        {
          error: existingError.message,
        },
        { status: 500 },
      );
    }

    if (existingMember) {
      return NextResponse.json(
        {
          error:
            "이미 사용 중인 아이디입니다.",
        },
        { status: 409 },
      );
    }

    const passwordHash =
      hashPassword(password);

    const {
      data: member,
      error: insertError,
    } = await supabaseAdmin
      .from("members")
      .insert({
        login_id: loginId,
        password_hash: passwordHash,
        name,
        phone,
        marketing_agree: marketingAgree,
        interest_region: interestRegion,
      })
      .select(
        "id, login_id, name, phone, marketing_agree, interest_region",
      )
      .single();

    if (insertError || !member) {
      return NextResponse.json(
        {
          error:
            insertError?.message ??
            "회원가입에 실패했습니다.",
        },
        { status: 500 },
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