import sodium from "sodium-universal";
import { sameBytes, textBytes } from "./bytes";

const PROOF_CONTEXT = textBytes("ahoy pairing proof v1");

type PairingProofInput = {
  pairingSecret: Uint8Array;
  phonePublicKey: Uint8Array;
  desktopPublicKey: Uint8Array;
};

export function pairingProof(input: PairingProofInput): Uint8Array {
  const message = new Uint8Array([
    ...PROOF_CONTEXT,
    ...input.phonePublicKey,
    ...input.desktopPublicKey,
  ]);
  const proof = new Uint8Array(sodium.crypto_generichash_BYTES);
  sodium.crypto_generichash(proof, message, input.pairingSecret);
  return proof;
}

export function proofMatches(input: PairingProofInput, proof: Uint8Array): boolean {
  return sameBytes(pairingProof(input), proof);
}
