import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    const updateData = {
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
      balcony: String(body.balcony ?? "").trim(),
      amenities: String(body.amenities ?? "").trim(),
      nearby_subway: String(body.nearby_subway ?? "").trim(),
      education_facilities: String(body.education_facilities ?? "").trim(),
      household_count: String(body.household_count ?? "").trim(),
      station_distance: String(body.station_distance ?? "").trim(),
      built_in: String(body.built_in ?? "").trim(),
      parking_count: String(body.parking_count ?? "").trim(),
      elevator: String(body.elevator ?? "").trim(),
      thumbnail_url: String(body.thumbnail_url ?? ""),
      image_urls: Array.isArray(body.image_urls) ? body.image_urls : [],
      status: body.status === "숨김" ? "숨김" : "공개",
    };

    const { data, error } = await supabaseAdmin
      .from("properties")
      .update(updateData)
      .eq("id", propertyId)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `DB 수정 실패: ${error.message}` },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "수정할 매물을 찾지 못했습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      property: data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
