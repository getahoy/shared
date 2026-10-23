import sodium from "sodium-universal";

const PUBLIC_KEY_BYTES = 32;
const SECRET_KEY_BYTES = 32;

export type KeyPair = { publicKey: Uint8Array; secretKey: Uint8Array };

export function generateKeyPair(): KeyPair {
  const publicKey = new Uint8Array(PUBLIC_KEY_BYTES);
  const secretKey = new Uint8Array(SECRET_KEY_BYTES);
  sodium.crypto_kx_keypair(publicKey, secretKey);
  return { publicKey, secretKey };
}
