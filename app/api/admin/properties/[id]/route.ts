import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;
    const propertyId = Number(id);

    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      return NextResponse.json(
        { error: "잘못된 매물 번호입니다." },
        { status: 400 },
      );
    }

    const body = await request.json();

    const { error } = await supabaseAdmin
      .from("properties")
      .update({
        title: String(body.title ?? "").trim(),
        price: String(body.price ?? "").trim(),
        address: String(body.address ?? "").trim(),
        city: String(body.city ?? "").trim(),
        district: String(body.district ?? "").trim(),
        neighborhood: String(body.neighborhood ?? "").trim(),
        property_type: String(body.property_type ?? "빌라"),
        listing_badge:
          body.listing_badge === "매매" ? "매매" : "신축분양",
        is_urgent: body.is_urgent === true,
        rooms: Number(body.rooms ?? 0),
        bathrooms: Number(body.bathrooms ?? 0),
        area_pyeong:
          body.area_pyeong === null ||
          body.area_pyeong === undefined ||
          body.area_pyeong === ""
            ? null
            : Number(body.area_pyeong),
        floor: String(body.floor ?? "").trim(),
        direction: String(body.direction ?? "").trim(),
        maintenance_fee: String(body.maintenance_fee ?? "").trim(),
        move_in_status: String(body.move_in_status ?? "").trim(),
        deposit: String(body.deposit ?? "").trim(),
        loan: String(body.loan ?? "").trim(),
        thumbnail_url: String(body.thumbnail_url ?? ""),
        image_urls: Array.isArray(body.image_urls)
          ? body.image_urls
          : [],
        description: String(body.description ?? "").trim(),
        status: body.status === "숨김" ? "숨김" : "공개",
      })
      .eq("id", propertyId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
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
