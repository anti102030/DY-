import {
  createHmac,
  timingSafeEqual,
} from "crypto";

export const ADMIN_COOKIE_NAME =
  "dy_admin_session";

export const ADMIN_SESSION_MAX_AGE =
  60 * 60 * 12;

function getAdminSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET은 32자 이상으로 설정해주세요.",
    );
  }

  return secret;
}

function sign(value: string) {
  return createHmac(
    "sha256",
    getAdminSecret(),
  )
    .update(value)
    .digest("hex");
}

export function createAdminSessionToken() {
  const expiresAt =
    Math.floor(Date.now() / 1000) +
    ADMIN_SESSION_MAX_AGE;

  const payload = `admin:${expiresAt}`;

  const signature =
    sign(payload);

  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(
  token?: string | null,
) {
  if (!token) {
    return false;
  }

  const lastDot =
    token.lastIndexOf(".");

  if (lastDot <= 0) {
    return false;
  }

  const payload =
    token.slice(0, lastDot);

  const suppliedSignature =
    token.slice(lastDot + 1);

  const [role, expiresText] =
    payload.split(":");

  if (role !== "admin") {
    return false;
  }

  const expiresAt =
    Number(expiresText);

  if (
    !Number.isFinite(expiresAt) ||
    expiresAt <=
      Math.floor(Date.now() / 1000)
  ) {
    return false;
  }

  const expectedSignature =
    sign(payload);

  const suppliedBuffer =
    Buffer.from(
      suppliedSignature,
      "hex",
    );

  const expectedBuffer =
    Buffer.from(
      expectedSignature,
      "hex",
    );

  if (
    suppliedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    suppliedBuffer,
    expectedBuffer,
  );
}

export function safeTextEqual(
  left: string,
  right: string,
) {
  const leftBuffer =
    Buffer.from(left);

  const rightBuffer =
    Buffer.from(right);

  if (
    leftBuffer.length !==
    rightBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    leftBuffer,
    rightBuffer,
  );
}