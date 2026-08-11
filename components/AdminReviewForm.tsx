"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { ReviewRow } from "@/lib/reviewTypes";

type Props = {
  review?: ReviewRow;
};

type FormState = {
  title: string;
  content: string;
  author: string;
  status: "공개" | "숨김";
};

const STORAGE_BUCKET = "reviews";

function getStoragePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export default function AdminReviewForm({ review }: Props) {
  const router = useRouter();
  const isEdit = Boolean(review);

  const existingImages = review
    ? [review.thumbnail_url, ...(review.image_urls ?? [])].filter(Boolean)
    : [];

  const [form, setForm] = useState<FormState>({
    title: review?.title ?? "",
    content: review?.content ?? "",
    author: review?.author ?? "",
    status: review?.status ?? "공개",
  });

  const [savedImages, setSavedImages] = useState<string[]>(existingImages);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const previewUrls = useMemo(
    () => newFiles.map((file) => URL.createObjectURL(file)),
    [newFiles]
  );

  function updateField(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    );

    setNewFiles((current) => [...current, ...files]);
    event.target.value = "";
  }

  async function uploadFiles(files: File[]) {
    const urls: string[] = [];

    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `review-images/${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (error) throw new Error(`${file.name} 업로드 실패: ${error.message}`);

      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    return urls;
  }

  async function removeDeletedStorageImages(finalUrls: string[]) {
    if (!review) return;

    const removed = existingImages.filter((url) => !finalUrls.includes(url));
    const paths = removed
      .map(getStoragePathFromPublicUrl)
      .filter((value): value is string => Boolean(value));

    if (paths.length > 0) {
      await supabase.storage.from(STORAGE_BUCKET).remove(paths);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (savedImages.length === 0 && newFiles.length === 0) {
      setMessage("후기 사진을 1장 이상 등록해 주세요.");
      return;
    }

    setSaving(true);

    try {
      const uploadedUrls = await uploadFiles(newFiles);
      const finalImages = [...savedImages, ...uploadedUrls];

      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        author: form.author.trim() || null,
        status: form.status,
        thumbnail_url: finalImages[0],
        image_urls: finalImages.slice(1),
      };

      if (review) {
        const { error } = await supabase
          .from("reviews")
          .update(payload)
          .eq("id", review.id);

        if (error) throw new Error(error.message);
        await removeDeletedStorageImages(finalImages);
      } else {
        const { error } = await supabase.from("reviews").insert(payload);
        if (error) throw new Error(error.message);
      }

      router.push("/admin/reviews");
      router.refresh();
    } catch (error) {
      setMessage(
        `저장 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <label className="admin-full">
          후기 제목
          <input
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="예: 오래 기다린 끝에 입주했습니다"
            required
          />
        </label>

        <label>
          작성자
          <input
            name="author"
            value={form.author}
            onChange={updateField}
            placeholder="예: 서울 강서구 고객"
          />
        </label>

        <label>
          공개 상태
          <select name="status" value={form.status} onChange={updateField}>
            <option>공개</option>
            <option>숨김</option>
          </select>
        </label>

        <label className="admin-full">
          후기 내용
          <textarea
            name="content"
            value={form.content}
            onChange={updateField}
            placeholder="상담, 계약, 입주 후기를 입력하세요."
            required
          />
        </label>

        {savedImages.length > 0 && (
          <div className="admin-full">
            <div className="admin-photo-heading">
              <strong>현재 사진</strong>
              <small>첫 번째 사진이 대표사진입니다.</small>
            </div>

            <div className="admin-image-preview-grid">
              {savedImages.map((url, index) => (
                <div className="admin-image-preview" key={`${url}-${index}`}>
                  <img src={url} alt={`후기 이미지 ${index + 1}`} />

                  {index === 0 && (
                    <span className="admin-thumbnail-badge">대표사진</span>
                  )}

                  <div className="admin-image-actions">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSavedImages((current) => {
                            const copy = [...current];
                            const [selected] = copy.splice(index, 1);
                            return [selected, ...copy];
                          })
                        }
                      >
                        대표로
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setSavedImages((current) =>
                          current.filter((_, i) => i !== index)
                        )
                      }
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="admin-full">
          후기 사진 추가
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
          />
        </label>

        {previewUrls.length > 0 && (
          <div className="admin-full">
            <div className="admin-photo-heading">
              <strong>새로 추가할 사진</strong>
            </div>

            <div className="admin-image-preview-grid">
              {previewUrls.map((url, index) => (
                <div className="admin-image-preview" key={url}>
                  <img src={url} alt={`추가 이미지 ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() =>
                      setNewFiles((current) =>
                        current.filter((_, i) => i !== index)
                      )
                    }
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {message && <p className="admin-message">{message}</p>}

      <button className="admin-submit" type="submit" disabled={saving}>
        {saving ? "저장 중..." : isEdit ? "후기 수정 저장" : "후기 등록"}
      </button>
    </form>
  );
}
