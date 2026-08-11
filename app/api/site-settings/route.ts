import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS = {
  company_name: "DY다이아부동산",
  phone: "010-8426-8616",
  consult_hours: "365일 24시간 상담가능!",
  address: "",
  email: "",
  header_consult_title: "고객상담전화",
  header_consult_text: "내집마련 맞춤컨설팅!",
  footer_text: "DY다이아부동산",
};

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("setting_key, setting_value");

  if (error) {
    console.error("site_settings API 오류:", error);

    return NextResponse.json(
      {
        settings: DEFAULT_SETTINGS,
        error: error.message,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const values = Object.fromEntries(
    (data ?? []).map((item) => [
      item.setting_key,
      item.setting_value ?? "",
    ]),
  );

  return NextResponse.json(
    {
      settings: {
        ...DEFAULT_SETTINGS,
        ...values,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
