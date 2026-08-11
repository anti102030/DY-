import {
  createHash,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";

export const SESSION_COOKIE_NAME = "dy_session";

export const SESSION_MAX_AGE_SECONDS =
  60 * 60 * 24 * 30;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");

  const derivedKey = scryptSync(
    password,
    salt,
    64,
  ).toString("hex");

  return `${salt}:${derivedKey}`;
}

export function verifyPassword(
  password: string,
  storedValue: string,
) {
  const [salt, storedHash] =
    storedValue.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const derivedKey = scryptSync(
    password,
    salt,
    64,
  );

  const storedBuffer = Buffer.from(
    storedHash,
    "hex",
  );

  if (
    derivedKey.length !== storedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    derivedKey,
    storedBuffer,
  );
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(
  token: string,
) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}