import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const SESSION_COOKIE_NAME = "dy_session";
const REVIEW_BUCKET = "review-images";

/* 회원 세션 토큰 해시 */
function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

/* 현재 로그인 회원 찾기 */
async function getCurrentMember(
  request: NextRequest,
) {
  const token =
    request.cookies.get(
      SESSION_COOKIE_NAME,
    )?.value;

  if (!token) {
    return null;
  }

  const tokenHash =
    hashToken(token);

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

  if (
    sessionError ||
    !session
  ) {
    return null;
  }

  /* 세션 만료 확인 */
  if (
    new Date(
      session.expires_at,
    ).getTime() <= Date.now()
  ) {
    await supabaseAdmin
      .from("member_sessions")
      .delete()
      .eq("id", session.id);

    return null;
  }

  const {
    data: member,
    error: memberError,
  } = await supabaseAdmin
    .from("members")
    .select(
      "id, login_id, name",
    )
    .eq("id", session.member_id)
    .maybeSingle();

  if (
    memberError ||
    !member
  ) {
    return null;
  }

  return member;
}

/* Storage 버킷 확인 / 생성 */
async function ensureReviewBucket() {
  const {
    data: buckets,
    error,
  } =
    await supabaseAdmin.storage
      .listBuckets();

  if (error) {
    throw error;
  }

  const exists =
    buckets.some(
      (bucket) =>
        bucket.name ===
        REVIEW_BUCKET,
    );

  if (exists) {
    return;
  }

  const {
    error: createError,
  } =
    await supabaseAdmin.storage
      .createBucket(
        REVIEW_BUCKET,
        {
          public: true,

          fileSizeLimit:
            10 * 1024 * 1024,

          allowedMimeTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ],
        },
      );

  if (createError) {
    throw createError;
  }
}

/* 확장자 처리 */
function getFileExtension(
  file: File,
) {
  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase();

  if (
    extension &&
    /^[a-z0-9]{2,5}$/.test(
      extension,
    )
  ) {
    return extension;
  }

  if (
    file.type ===
    "image/png"
  ) {
    return "png";
  }

  if (
    file.type ===
    "image/webp"
  ) {
    return "webp";
  }

  if (
    file.type ===
    "image/gif"
  ) {
    return "gif";
  }

  return "jpg";
}

/* 고객후기 등록 */
export async function POST(
  request: NextRequest,
) {
  try {
    /* 로그인 확인 */
    const member =
      await getCurrentMember(
        request,
      );

    if (!member) {
      return NextResponse.json(
        {
          error:
            "로그인 후 고객후기를 작성할 수 있습니다.",
        },
        {
          status: 401,
        },
      );
    }

    const formData =
      await request.formData();

    const title =
      String(
        formData.get(
          "title",
        ) ?? "",
      ).trim();

    const content =
      String(
        formData.get(
          "content",
        ) ?? "",
      ).trim();

    if (!title) {
      return NextResponse.json(
        {
          error:
            "제목을 입력해주세요.",
        },
        {
          status: 400,
        },
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          error:
            "내용을 입력해주세요.",
        },
        {
          status: 400,
        },
      );
    }

    /* 사진 가져오기 */
    const imageFiles =
      formData
        .getAll("images")
        .filter(
          (
            value,
          ): value is File =>
            value instanceof File &&
            value.size > 0,
        )
        .slice(0, 10);

    const imageUrls:
      string[] = [];

    /* 사진이 있으면 업로드 */
    if (
      imageFiles.length >
      0
    ) {
      await ensureReviewBucket();

      for (
        let index = 0;
        index <
        imageFiles.length;
        index++
      ) {
        const file =
          imageFiles[index];

        if (
          !file.type.startsWith(
            "image/",
          )
        ) {
          return NextResponse.json(
            {
              error:
                "이미지 파일만 등록할 수 있습니다.",
            },
            {
              status: 400,
            },
          );
        }

        if (
          file.size >
          10 *
            1024 *
            1024
        ) {
          return NextResponse.json(
            {
              error:
                "사진은 한 장당 10MB 이하만 등록할 수 있습니다.",
            },
            {
              status: 400,
            },
          );
        }

        const extension =
          getFileExtension(
            file,
          );

        const storagePath =
          `${member.id}/` +
          `${Date.now()}-` +
          `${index}-` +
          `${crypto.randomUUID()}.` +
          extension;

        const bytes =
          new Uint8Array(
            await file.arrayBuffer(),
          );

        const {
          error: uploadError,
        } =
          await supabaseAdmin.storage
            .from(
              REVIEW_BUCKET,
            )
            .upload(
              storagePath,
              bytes,
              {
                contentType:
                  file.type,

                upsert: false,
              },
            );

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: publicUrlData,
        } =
          supabaseAdmin.storage
            .from(
              REVIEW_BUCKET,
            )
            .getPublicUrl(
              storagePath,
            );

        imageUrls.push(
          publicUrlData.publicUrl,
        );
      }
    }

    /*
      회원 이름이 있으면 이름 사용
      없으면 로그인 아이디 사용
    */
    const author =
      String(
        member.name ||
          member.login_id ||
          "DY다이아부동산 고객",
      ).trim();

    /*
      첫 번째 사진을
      고객후기 목록 썸네일로 사용
    */
    const thumbnailUrl =
      imageUrls[0] ?? "";

    /* reviews 테이블 저장 */
    const {
      data: review,
      error: insertError,
    } =
      await supabaseAdmin
        .from("reviews")
        .insert({
          title,
          content,
          author,

          thumbnail_url:
            thumbnailUrl,

          image_urls:
            imageUrls,

          status: "공개",
        })
        .select("*")
        .single();

    if (
      insertError ||
      !review
    ) {
      console.error(
        "후기 DB 저장 오류:",
        insertError,
      );

      return NextResponse.json(
        {
          error:
            insertError?.message ??
            "고객후기 저장에 실패했습니다.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(
      "고객후기 등록 API 오류:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "고객후기 등록 중 오류가 발생했습니다.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}