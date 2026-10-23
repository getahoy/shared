import Noise from "noise-handshake";
import Cipher from "noise-handshake/cipher.js";
import { textBytes } from "./bytes";
import type { KeyPair } from "./keys";

const PROLOGUE = textBytes("ahoy");

export type SecureChannel = {
  seal: (plaintext: Uint8Array) => Uint8Array;
  open: (ciphertext: Uint8Array) => Uint8Array | null;
};

export type InitiatorHandshake = {
  firstMessage: (payload: Uint8Array) => Uint8Array;
  readReply: (message: Uint8Array) => { payload: Uint8Array; channel: SecureChannel } | null;
};

type ResponderHandshake = {
  readFirstMessage: (
    message: Uint8Array,
  ) => { remotePublicKey: Uint8Array; payload: Uint8Array } | null;
  reply: (payload: Uint8Array) => { message: Uint8Array; channel: SecureChannel };
};

function attempt<T>(operation: () => T): T | null {
  try {
    return operation();
  } catch {
    return null;
  }
}

function secureChannel(noise: Noise): SecureChannel {
  if (!noise.tx || !noise.rx) throw new Error("Noise handshake is not complete");
  const sender = new Cipher(noise.tx);
  const receiver = new Cipher(noise.rx);
  return {
    seal: (plaintext) => sender.encrypt(plaintext),
    open: (ciphertext) => attempt(() => receiver.decrypt(ciphertext)),
  };
}

export function startInitiator(
  localKeys: KeyPair,
  remotePublicKey: Uint8Array,
): InitiatorHandshake {
  const noise = new Noise("IK", true, localKeys);
  noise.initialise(PROLOGUE, remotePublicKey);
  return {
    firstMessage: (payload) => noise.send(payload),
    readReply: (message) => {
      const payload = attempt(() => noise.recv(message));
      if (!payload || !noise.complete) return null;
      return { payload, channel: secureChannel(noise) };
    },
  };
}

export function startResponder(localKeys: KeyPair): ResponderHandshake {
  const noise = new Noise("IK", false, localKeys);
  noise.initialise(PROLOGUE);
  return {
    readFirstMessage: (message) => {
      const payload = attempt(() => noise.recv(message));
      if (!payload || !noise.rs) return null;
      return { remotePublicKey: noise.rs, payload };
    },
    reply: (payload) => {
      const message = noise.send(payload);
      return { message, channel: secureChannel(noise) };
    },
  };
}
