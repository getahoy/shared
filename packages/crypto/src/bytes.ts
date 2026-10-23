import { base64urlnopad, utf8 } from "@scure/base";
import sodium from "sodium-universal";

const SECRET_BYTES = 32;

export function randomSecret(): Uint8Array {
  const secret = new Uint8Array(SECRET_BYTES);
  sodium.randombytes_buf(secret);
  return secret;
}

export function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  return left.byteLength === right.byteLength && sodium.sodium_memcmp(left, right);
}

export const textBytes = (text: string): Uint8Array => utf8.decode(text);

export const encodeBytes = (bytes: Uint8Array): string => base64urlnopad.encode(bytes);

export const decodeBytes = (encoded: string): Uint8Array => base64urlnopad.decode(encoded);
