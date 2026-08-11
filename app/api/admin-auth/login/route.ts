import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  safeTextEqual,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const loginId = String(
      body.login_id ?? "",
    ).trim();

    const password = String(
      body.password ?? "",
    );

    const adminId =
      process.env.ADMIN_LOGIN_ID ?? "";

    const adminPassword =
      process.env.ADMIN_LOGIN_PASSWORD ?? "";

    if (!adminId || !adminPassword) {
      return NextResponse.json(
        {
          error:
            "관리자 계정 환경변수가 설정되지 않았습니다.",
        },
        { status: 500 },
      );
    }

    const idOk = safeTextEqual(
      loginId,
      adminId,
    );

    const passwordOk = safeTextEqual(
      password,
      adminPassword,
    );

    if (!idOk || !passwordOk) {
      return NextResponse.json(
        {
          error:
            "관리자 아이디 또는 비밀번호가 올바르지 않습니다.",
        },
        { status: 401 },
      );
    }

    const token =
      createAdminSessionToken();

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "strict",
      secure:
        process.env.NODE_ENV ===
        "production",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "관리자 로그인 중 오류가 발생했습니다.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
