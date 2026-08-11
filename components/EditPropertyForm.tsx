"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { PropertyRow } from "@/lib/propertyTypes";

type FormState = {
  title: string;
  price: string;
  address: string;
  city: string;
  district: string;
  neighborhood: string;
  property_type: string;
  listing_badge: "신축분양" | "매매";
  is_urgent: boolean;
  rooms: string;
  bathrooms: string;
  area_pyeong: string;
  floor: string;
  direction: string;
  maintenance_fee: string;
  move_in_status: string;
  deposit: string;
  loan: string;
  description: string;
  status: "공개" | "숨김";
};

const STORAGE_BUCKET = "properties";

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const markerIndex = url.indexOf(marker);

  if (markerIndex === -1) return null;

  return decodeURIComponent(url.slice(markerIndex + marker.length));
}

export default function EditPropertyForm({
  property,
}: {
  property: PropertyRow;
}) {
  const router = useRouter();

  const existingImages = [
    property.thumbnail_url,
    ...(property.image_urls ?? []),
  ].filter(Boolean);

  const [form, setForm] = useState<FormState>({
    title: property.title ?? "",
    price: property.price ?? "",
    address: property.address ?? "",
    city: property.city ?? "서울",
    district: property.district ?? "",
    neighborhood: property.neighborhood ?? "",
    property_type: property.property_type ?? "빌라",
    listing_badge:
      property.listing_badge === "매매" ? "매매" : "신축분양",
    is_urgent: Boolean(property.is_urgent),
    rooms: String(property.rooms ?? 0),
    bathrooms: String(property.bathrooms ?? 0),
    area_pyeong:
      property.area_pyeong === null || property.area_pyeong === undefined
        ? ""
        : String(property.area_pyeong),
    floor: property.floor ?? "",
    direction: property.direction ?? "",
    maintenance_fee: property.maintenance_fee ?? "",
    move_in_status: property.move_in_status ?? "",
    deposit: property.deposit ?? "",
    loan: property.loan ?? "",
    description: property.description ?? "",
    status: property.status ?? "공개",
  });

  const [savedImages, setSavedImages] = useState<string[]>(existingImages);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [progressText, setProgressText] = useState("");

  const newPreviewUrls = useMemo(
    () => newImageFiles.map((file) => URL.createObjectURL(file)),
    [newImageFiles]
  );

  function updateField(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    const checked =
      event.target instanceof HTMLInputElement
        ? event.target.checked
        : false;

    setForm((current) => ({
      ...current,
      [name]: name === "is_urgent" ? checked : value,
    }));
  }

  function handleNewImages(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const imagesOnly = files.filter((file) => file.type.startsWith("image/"));

    if (imagesOnly.length !== files.length) {
      setMessage("이미지 파일만 선택할 수 있습니다.");
    } else {
      setMessage("");
    }

    setNewImageFiles((current) => [...current, ...imagesOnly]);
    event.target.value = "";
  }

  function moveSavedImageToFirst(index: number) {
    setSavedImages((current) => {
      const copy = [...current];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  }

  function removeSavedImage(index: number) {
    setSavedImages((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  function removeNewImage(index: number) {
    setNewImageFiles((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  async function uploadImages(files: File[]) {
    const urls: string[] = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];

      setProgressText(
        `새 이미지 업로드 중 ${index + 1}/${files.length}`
      );

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `property-images/${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(`${file.name} 업로드 실패: ${uploadError.message}`);
      }

      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      urls.push(data.publicUrl);
    }

    return urls;
  }

  async function deleteRemovedStorageImages(finalUrls: string[]) {
    const removedUrls = existingImages.filter(
      (existingUrl) => !finalUrls.includes(existingUrl)
    );

    const paths = removedUrls
      .map(getStoragePathFromPublicUrl)
      .filter((path): path is string => Boolean(path));

    if (paths.length === 0) return;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(paths);

    if (error) {
      console.warn("삭제된 이미지 정리 실패:", error.message);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (savedImages.length === 0 && newImageFiles.length === 0) {
      setMessage("사진을 1장 이상 남겨 주세요.");
      return;
    }

    setSaving(true);

    try {
      const uploadedUrls =
        newImageFiles.length > 0
          ? await uploadImages(newImageFiles)
          : [];

      const finalImages = [...savedImages, ...uploadedUrls];

      setProgressText("매물 정보 저장 중...");

      const response = await fetch(`/api/admin/properties/${property.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          price: form.price.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          district: form.district.trim(),
          neighborhood: form.neighborhood.trim(),
          property_type: form.property_type,
          listing_badge: form.listing_badge,
          is_urgent: form.is_urgent,
          rooms: Number(form.rooms || 0),
          bathrooms: Number(form.bathrooms || 0),
          area_pyeong: form.area_pyeong
            ? Number(form.area_pyeong)
            : null,
          floor: form.floor.trim(),
          direction: form.direction.trim(),
          maintenance_fee: form.maintenance_fee.trim(),
          move_in_status: form.move_in_status.trim(),
          deposit: form.deposit.trim(),
          loan: form.loan.trim(),
          thumbnail_url: finalImages[0],
          image_urls: finalImages.slice(1),
          description: form.description.trim(),
          status: form.status,
        }),
      });

      const result = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "매물 수정에 실패했습니다.");
      }

      await deleteRemovedStorageImages(finalImages);

      setMessage("매물이 수정되었습니다.");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";

      setMessage(`수정 실패: ${errorMessage}`);
    } finally {
      setSaving(false);
      setProgressText("");
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <label>
          제목
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            required
          />
        </label>

        <label>
          매매가
          <input
            name="price"
            value={form.price}
            onChange={updateField}
            placeholder="예: 2억 5,000만원"
            required
          />
        </label>

        <label className="admin-full">
          전체 주소
          <input
            name="address"
            value={form.address}
            onChange={updateField}
            required
          />
        </label>

        <label>
          시·도
          <select name="city" value={form.city} onChange={updateField}>
            <option>서울</option>
            <option>경기</option>
            <option>인천</option>
          </select>
        </label>

        <label>
          구·군
          <input
            name="district"
            value={form.district}
            onChange={updateField}
            placeholder="예: 강서구"
          />
        </label>

        <label>
          동
          <input
            name="neighborhood"
            value={form.neighborhood}
            onChange={updateField}
            placeholder="예: 화곡동"
          />
        </label>

        <label>
          매물 종류
          <select
            name="property_type"
            value={form.property_type}
            onChange={updateField}
          >
            <option>빌라</option>
            <option>아파트</option>
            <option>오피스텔</option>
            <option>단독주택</option>
            <option>타운하우스</option>
          </select>
        </label>

        <label>
          표시 배지
          <select
            name="listing_badge"
            value={form.listing_badge}
            onChange={updateField}
          >
            <option value="신축분양">신축분양</option>
            <option value="매매">매매</option>
          </select>
        </label>

        <label className="admin-urgent-field">
          급매물 설정
          <span className="admin-urgent-check">
            <input
              type="checkbox"
              name="is_urgent"
              checked={Boolean(form.is_urgent)}
              onChange={updateField}
            />
            급매물분양에 노출
          </span>
        </label>

        <label>
          방
          <input
            name="rooms"
            type="number"
            min="0"
            value={form.rooms}
            onChange={updateField}
          />
        </label>

        <label>
          욕실
          <input
            name="bathrooms"
            type="number"
            min="0"
            value={form.bathrooms}
            onChange={updateField}
          />
        </label>

        <label>
          전용평수
          <input
            name="area_pyeong"
            type="number"
            step="0.01"
            value={form.area_pyeong}
            onChange={updateField}
          />
        </label>

        <label>
          층
          <input
            name="floor"
            value={form.floor}
            onChange={updateField}
          />
        </label>

        <label>
          방향
          <input
            name="direction"
            value={form.direction}
            onChange={updateField}
          />
        </label>

        <label>
          관리비
          <input
            name="maintenance_fee"
            value={form.maintenance_fee}
            onChange={updateField}
          />
        </label>

        <label>
          입주 상태
          <input
            name="move_in_status"
            value={form.move_in_status}
            onChange={updateField}
          />
        </label>

        <label>
          실입주금
          <input
            name="deposit"
            value={form.deposit}
            onChange={updateField}
          />
        </label>

        <label>
          융자금
          <input
            name="loan"
            value={form.loan}
            onChange={updateField}
          />
        </label>

        <div className="admin-full">
          <div className="admin-photo-heading">
            <strong>현재 사진</strong>
            <small>첫 번째 사진이 대표 이미지입니다.</small>
          </div>

          <div className="admin-image-preview-grid">
            {savedImages.map((url, index) => (
              <div className="admin-image-preview" key={`${url}-${index}`}>
                <img src={url} alt={`현재 이미지 ${index + 1}`} />

                {index === 0 && (
                  <span className="admin-thumbnail-badge">
                    대표 이미지
                  </span>
                )}

                <div className="admin-image-actions">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => moveSavedImageToFirst(index)}
                    >
                      대표로
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeSavedImage(index)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <label className="admin-full">
          새 사진 추가
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImages}
          />
          <small>여러 장을 한 번에 추가할 수 있습니다.</small>
        </label>

        {newPreviewUrls.length > 0 && (
          <div className="admin-full">
            <div className="admin-photo-heading">
              <strong>추가할 사진</strong>
            </div>

            <div className="admin-image-preview-grid">
              {newPreviewUrls.map((url, index) => (
                <div className="admin-image-preview" key={url}>
                  <img src={url} alt={`추가 이미지 ${index + 1}`} />

                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="admin-full">
          상세 설명
          <textarea
            name="description"
            value={form.description}
            onChange={updateField}
            required
          />
        </label>

        <label>
          공개 상태
          <select
            name="status"
            value={form.status}
            onChange={updateField}
          >
            <option>공개</option>
            <option>숨김</option>
          </select>
        </label>
      </div>

      {progressText && <p className="admin-message">{progressText}</p>}
      {message && <p className="admin-message">{message}</p>}

      <button
        className="admin-submit"
        type="submit"
        disabled={saving}
      >
        {saving ? "수정 중..." : "수정 저장"}
      </button>

      <style jsx>{`
        .admin-urgent-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .admin-urgent-check {
          min-height: 42px;
          padding: 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #cccccc;
          background: #ffffff;
          color: #222222;
          font-size: 14px;
          font-weight: 700;
          box-sizing: border-box;
          cursor: pointer;
        }

        .admin-urgent-check input {
          width: 18px;
          height: 18px;
          margin: 0;
          accent-color: #e53935;
          cursor: pointer;
        }
      `}</style>
    </form>
  );
}
