declare module "sodium-universal" {
  const sodium: {
    crypto_generichash_BYTES: number;
    crypto_generichash(output: Uint8Array, input: Uint8Array, key: Uint8Array): void;
    crypto_kx_keypair(publicKey: Uint8Array, secretKey: Uint8Array): void;
    randombytes_buf(output: Uint8Array): void;
    sodium_memcmp(left: Uint8Array, right: Uint8Array): boolean;
  };
  export default sodium;
}

declare module "noise-handshake" {
  type KeyPair = { publicKey: Uint8Array; secretKey: Uint8Array };

  export default class Noise {
    constructor(pattern: "IK", initiator: boolean, staticKeyPair?: KeyPair);
    readonly rs: Uint8Array | null;
    readonly tx: Uint8Array | null;
    readonly rx: Uint8Array | null;
    readonly complete: boolean;
    initialise(prologue: Uint8Array, remoteStatic?: Uint8Array): void;
    send(payload?: Uint8Array): Uint8Array;
    recv(message: Uint8Array): Uint8Array;
  }
}

declare module "noise-handshake/cipher.js" {
  export default class Cipher {
    constructor(key: Uint8Array);
    encrypt(plaintext: Uint8Array): Uint8Array;
    decrypt(ciphertext: Uint8Array): Uint8Array;
  }
}
