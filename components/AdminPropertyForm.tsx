"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

type BulkItem = {
  id: string;
  form: FormState;
  imageFiles: File[];
};

const initialForm: FormState = {
  title: "",
  price: "",
  address: "",
  city: "서울",
  district: "",
  neighborhood: "",
  property_type: "빌라",
  listing_badge: "신축분양",
  is_urgent: false,
  rooms: "3",
  bathrooms: "2",
  area_pyeong: "",
  floor: "",
  direction: "",
  maintenance_fee: "",
  move_in_status: "즉시입주",
  deposit: "",
  loan: "",
  description: "",
  status: "공개",
};

const STORAGE_BUCKET = "properties";

function parseAddress(address: string) {
  const value = address.trim().replace(/\s+/g," ");
  const parts = value.split(" ");

  let city="", district="", neighborhood="";

  if (parts[0]?.includes("서울")) {
    city="서울";
    district=parts[1]||"";
    neighborhood=parts[2]||"";
  } else if (parts[0]?.includes("인천")) {
    city="인천";
    district=parts[1]||"";
    neighborhood=parts[2]||"";
  } else if (parts[0]?.includes("경기")) {
    city="경기";
    district=parts[1]||"";               // 고양시, 김포시...
    neighborhood=[parts[2],parts[3]].filter(Boolean).join(" "); // 덕양구 관산동
  }

  return {city,district,neighborhood};
}



function createBulkItem(): BulkItem {
  return {
    id: crypto.randomUUID(),
    form: { ...initialForm },
    imageFiles: [],
  };
}

export default function AdminPropertyForm() {
  const router = useRouter();

  const [mode, setMode] = useState<"single" | "bulk">("single");

  const [form, setForm] = useState<FormState>({ ...initialForm });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [bulkItems, setBulkItems] = useState<BulkItem[]>([
    createBulkItem(),
    createBulkItem(),
  ]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadText, setUploadText] = useState("");

  const previewUrls = useMemo(
    () => imageFiles.map((file) => URL.createObjectURL(file)),
    [imageFiles]
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

    if (name === "is_urgent") {
      setForm((current) => ({
        ...current,
        is_urgent: checked,
      }));
      return;
    }

    if (name === "address") {
      const parsed = parseAddress(value);
      setForm((current)=>({
        ...current,
        address:value,
        city: parsed.city || current.city,
        district: parsed.district,
        neighborhood: parsed.neighborhood,
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const imageOnly = files.filter((file) => file.type.startsWith("image/"));

    if (imageOnly.length !== files.length) {
      setMessage("이미지 파일만 선택할 수 있습니다.");
    } else {
      setMessage("");
    }

    setImageFiles(imageOnly);
  }

  function removeImage(index: number) {
    setImageFiles((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    );
  }

  function updateBulkField(
    itemId: string,
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    const checked =
      event.target instanceof HTMLInputElement
        ? event.target.checked
        : false;

    setBulkItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              form: {
                ...item.form,
                [name]: name === "is_urgent" ? checked : value,
              },
            }
          : item
      )
    );
  }

  function handleBulkImageChange(
    itemId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);
    const imageOnly = files.filter((file) => file.type.startsWith("image/"));

    if (imageOnly.length !== files.length) {
      setMessage("이미지 파일만 선택할 수 있습니다.");
    } else {
      setMessage("");
    }

    setBulkItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, imageFiles: imageOnly } : item
      )
    );
  }

  function removeBulkImage(itemId: string, imageIndex: number) {
    setBulkItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              imageFiles: item.imageFiles.filter(
                (_, currentIndex) => currentIndex !== imageIndex
              ),
            }
          : item
      )
    );
  }

  function addBulkItem() {
    setBulkItems((current) => [...current, createBulkItem()]);
  }

  function removeBulkItem(itemId: string) {
    setBulkItems((current) => {
      if (current.length === 1) {
        setMessage("대량등록 매물은 최소 1개가 있어야 합니다.");
        return current;
      }

      return current.filter((item) => item.id !== itemId);
    });
  }

  async function uploadImages(
    files: File[],
    progressLabel?: string
  ): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];

      setUploadText(
        progressLabel
          ? `${progressLabel} 이미지 업로드 중 ${index + 1}/${files.length}`
          : `이미지 업로드 중 ${index + 1}/${files.length}`
      );

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const filePath = `property-images/${safeName}`;

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

      if (!data.publicUrl) {
        throw new Error(`${file.name} 공개 URL 생성에 실패했습니다.`);
      }

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  }

  function makeInsertData(
    currentForm: FormState,
    uploadedUrls: string[]
  ) {
    return {
      title: currentForm.title.trim(),
      price: currentForm.price.trim(),
      address: currentForm.address.trim(),
      city: currentForm.city.trim(),
      district: currentForm.district.trim(),
      neighborhood: currentForm.neighborhood.trim(),
      property_type: currentForm.property_type,
      listing_badge: currentForm.listing_badge,
      is_urgent: currentForm.is_urgent,
      rooms: Number(currentForm.rooms || 0),
      bathrooms: Number(currentForm.bathrooms || 0),
      area_pyeong: currentForm.area_pyeong
        ? Number(currentForm.area_pyeong)
        : null,
      floor: currentForm.floor.trim(),
      direction: currentForm.direction.trim(),
      maintenance_fee: currentForm.maintenance_fee.trim(),
      move_in_status: currentForm.move_in_status.trim(),
      deposit: currentForm.deposit.trim(),
      loan: currentForm.loan.trim(),
      thumbnail_url: uploadedUrls[0],
      image_urls: uploadedUrls.slice(1),
      description: currentForm.description.trim(),
      status: currentForm.status,
    };
  }

  function validateForm(
    currentForm: FormState,
    files: File[],
    label = "매물"
  ) {
    if (!currentForm.title.trim()) {
      throw new Error(`${label}의 제목을 입력해 주세요.`);
    }

    if (!currentForm.price.trim()) {
      throw new Error(`${label}의 매매가를 입력해 주세요.`);
    }

    if (!currentForm.address.trim()) {
      throw new Error(`${label}의 전체 주소를 입력해 주세요.`);
    }

    if (!currentForm.description.trim()) {
      throw new Error(`${label}의 상세 설명을 입력해 주세요.`);
    }

    if (files.length === 0) {
      throw new Error(`${label}의 사진을 1장 이상 선택해 주세요.`);
    }
  }

  async function handleSingleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");

    try {
      validateForm(form, imageFiles);
      setSaving(true);

      const uploadedUrls = await uploadImages(imageFiles);
      setUploadText("매물 정보 저장 중...");

      const { error } = await supabase
        .from("properties")
        .insert(makeInsertData(form, uploadedUrls));

      if (error) {
        throw new Error(error.message);
      }

      setMessage("매물이 등록되었습니다.");
      router.push("/admin");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      setMessage(`등록 실패: ${errorMessage}`);
    } finally {
      setSaving(false);
      setUploadText("");
    }
  }

  async function handleBulkSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");

    try {
      bulkItems.forEach((item, index) => {
        validateForm(item.form, item.imageFiles, `매물 ${index + 1}`);
      });

      setSaving(true);

      const rows = [];

      for (let index = 0; index < bulkItems.length; index += 1) {
        const item = bulkItems[index];
        const label = `매물 ${index + 1}/${bulkItems.length}`;

        const uploadedUrls = await uploadImages(item.imageFiles, label);
        rows.push(makeInsertData(item.form, uploadedUrls));
      }

      setUploadText(`${bulkItems.length}개 매물 정보를 저장 중...`);

      const { error } = await supabase.from("properties").insert(rows);

      if (error) {
        throw new Error(error.message);
      }

      setMessage(`${bulkItems.length}개 매물이 등록되었습니다.`);
      router.push("/admin");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";
      setMessage(`대량등록 실패: ${errorMessage}`);
    } finally {
      setSaving(false);
      setUploadText("");
    }
  }

  function renderFormFields(
    currentForm: FormState,
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => void,
    onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    currentImageFiles: File[],
    onRemoveImage: (index: number) => void,
    inputPrefix: string
  ) {
    const currentPreviewUrls = currentImageFiles.map((file) =>
      URL.createObjectURL(file)
    );

    return (
      <div className="admin-form-grid">
        <label>
          제목
          <input
            name="title"
            value={currentForm.title}
            onChange={onChange}
            required
          />
        </label>

        <label>
          매매가
          <input
            name="price"
            value={currentForm.price}
            onChange={onChange}
            placeholder="예: 2억 5,000만원"
            required
          />
        </label>

        <label className="admin-full">
          전체 주소
          <input
            name="address"
            value={currentForm.address}
            onChange={onChange}
            required
          />
        </label>

        <label>
          시·도
          <select
            name="city"
            value={currentForm.city}
            onChange={onChange}
          >
            <option>서울</option>
            <option>경기</option>
            <option>인천</option>
          </select>
        </label>

        <label>
          시·구
          <input
            name="district"
            value={currentForm.district}
            onChange={onChange}
            placeholder="예: 강서구"
          />
        </label>

        <label>
          동
          <input
            name="neighborhood"
            value={currentForm.neighborhood}
            onChange={onChange}
            placeholder="예: 화곡동"
          />
        </label>

        <label>
          매물 종류
          <select
            name="property_type"
            value={currentForm.property_type}
            onChange={onChange}
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
            value={currentForm.listing_badge}
            onChange={onChange}
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
              checked={Boolean(currentForm.is_urgent)}
              onChange={onChange}
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
            value={currentForm.rooms}
            onChange={onChange}
          />
        </label>

        <label>
          욕실
          <input
            name="bathrooms"
            type="number"
            min="0"
            value={currentForm.bathrooms}
            onChange={onChange}
          />
        </label>

        <label>
          전용평수
          <input
            name="area_pyeong"
            type="number"
            step="0.01"
            value={currentForm.area_pyeong}
            onChange={onChange}
          />
        </label>

        <label>
          층
          <input
            name="floor"
            value={currentForm.floor}
            onChange={onChange}
          />
        </label>

        <label>
          방향
          <input
            name="direction"
            value={currentForm.direction}
            onChange={onChange}
          />
        </label>

        <label>
          관리비
          <input
            name="maintenance_fee"
            value={currentForm.maintenance_fee}
            onChange={onChange}
          />
        </label>

        <label>
          입주 상태
          <input
            name="move_in_status"
            value={currentForm.move_in_status}
            onChange={onChange}
          />
        </label>

        <label>
          실입주금
          <input
            name="deposit"
            value={currentForm.deposit}
            onChange={onChange}
            placeholder="예: 3,000만원"
          />
        </label>

        <label>
          융자금
          <input
            name="loan"
            value={currentForm.loan}
            onChange={onChange}
            placeholder="예: 1억 8,000만원"
          />
        </label>

        <label className="admin-full">
          매물 사진
          <input
            key={`${inputPrefix}-${currentImageFiles.length}`}
            type="file"
            accept="image/*"
            multiple
            onChange={onImageChange}
            required={currentImageFiles.length === 0}
          />
          <small>
            여러 장을 한 번에 선택할 수 있습니다. 첫 번째 사진이 대표
            이미지로 사용됩니다.
          </small>
        </label>

        {currentPreviewUrls.length > 0 && (
          <div className="admin-full admin-image-preview-grid">
            {currentPreviewUrls.map((url, index) => (
              <div
                className="admin-image-preview"
                key={`${inputPrefix}-${index}-${url}`}
              >
                <img src={url} alt={`선택 이미지 ${index + 1}`} />

                {index === 0 && (
                  <span className="admin-thumbnail-badge">
                    대표 이미지
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="admin-full">
          상세 설명
          <textarea
            name="description"
            value={currentForm.description}
            onChange={onChange}
            required
          />
        </label>

        <label>
          공개 상태
          <select
            name="status"
            value={currentForm.status}
            onChange={onChange}
          >
            <option>공개</option>
            <option>숨김</option>
          </select>
        </label>
      </div>
    );
  }

  return (
    <div>
      <div className="dy-admin-register-tabs">
        <button
          type="button"
          className={mode === "single" ? "is-active" : ""}
          onClick={() => {
            setMode("single");
            setMessage("");
            setUploadText("");
          }}
        >
          단일 등록
        </button>

        <button
          type="button"
          className={mode === "bulk" ? "is-active" : ""}
          onClick={() => {
            setMode("bulk");
            setMessage("");
            setUploadText("");
          }}
        >
          대량 등록
        </button>
      </div>

      {mode === "single" ? (
        <form className="admin-form" onSubmit={handleSingleSubmit}>
          {renderFormFields(
            form,
            updateField,
            handleImageChange,
            imageFiles,
            removeImage,
            "single"
          )}

          {uploadText && (
            <p className="admin-message">{uploadText}</p>
          )}
          {message && <p className="admin-message">{message}</p>}

          <button
            className="admin-submit"
            type="submit"
            disabled={saving}
          >
            {saving ? "등록 중..." : "매물 등록"}
          </button>
        </form>
      ) : (
        <form className="dy-bulk-form" onSubmit={handleBulkSubmit}>
          <div className="dy-bulk-topbar">
            <p>
              현재 매물등록과 동일한 항목을 여러 개 입력한 뒤 한 번에
              등록할 수 있습니다.
            </p>

            <button
              type="button"
              className="dy-add-property-button"
              onClick={addBulkItem}
              disabled={saving}
            >
              ＋ 매물 추가
            </button>
          </div>

          <div className="dy-bulk-list">
            {bulkItems.map((item, index) => (
              <section className="dy-bulk-card" key={item.id}>
                <div className="dy-bulk-card-header">
                  <h2>매물 {index + 1}</h2>

                  <button
                    type="button"
                    className="dy-remove-property-button"
                    onClick={() => removeBulkItem(item.id)}
                    disabled={saving}
                  >
                    이 매물 삭제
                  </button>
                </div>

                {renderFormFields(
                  item.form,
                  (event) => updateBulkField(item.id, event),
                  (event) => handleBulkImageChange(item.id, event),
                  item.imageFiles,
                  (imageIndex) =>
                    removeBulkImage(item.id, imageIndex),
                  item.id
                )}
              </section>
            ))}
          </div>

          <button
            type="button"
            className="dy-bottom-add-button"
            onClick={addBulkItem}
            disabled={saving}
          >
            ＋ 매물 추가
          </button>

          {uploadText && (
            <p className="admin-message">{uploadText}</p>
          )}
          {message && <p className="admin-message">{message}</p>}

          <button
            className="admin-submit dy-bulk-submit"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "대량 등록 중..."
              : `${bulkItems.length}개 매물 전체 등록`}
          </button>
        </form>
      )}

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

        .dy-admin-register-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .dy-admin-register-tabs button {
          min-width: 110px;
          padding: 11px 18px;
          border: 1px solid #cccccc;
          background: #ffffff;
          color: #222222;
          font-weight: 700;
          cursor: pointer;
        }

        .dy-admin-register-tabs button.is-active {
          border-color: #222222;
          background: #222222;
          color: #ffffff;
        }

        .dy-bulk-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .dy-bulk-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          border: 1px solid #dddddd;
          background: #fafafa;
        }

        .dy-bulk-topbar p {
          margin: 0;
          color: #555555;
          font-size: 14px;
        }

        .dy-add-property-button,
        .dy-bottom-add-button {
          padding: 10px 16px;
          border: 1px solid #222222;
          background: #ffffff;
          color: #222222;
          font-weight: 700;
          cursor: pointer;
        }

        .dy-bulk-list {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .dy-bulk-card {
          padding: 18px;
          border: 2px solid #dddddd;
          background: #ffffff;
        }

        .dy-bulk-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #dddddd;
        }

        .dy-bulk-card-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .dy-remove-property-button {
          padding: 8px 12px;
          border: 1px solid #d64c4c;
          background: #ffffff;
          color: #c43131;
          font-weight: 700;
          cursor: pointer;
        }

        .dy-bottom-add-button {
          align-self: center;
          min-width: 180px;
        }

        .dy-bulk-submit {
          align-self: flex-start;
          min-width: 180px;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        @media (max-width: 700px) {
          .dy-bulk-topbar,
          .dy-bulk-card-header {
            align-items: stretch;
            flex-direction: column;
          }

          .dy-add-property-button,
          .dy-remove-property-button,
          .dy-bottom-add-button,
          .dy-bulk-submit {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
