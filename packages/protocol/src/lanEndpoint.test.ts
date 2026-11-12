import assert from "node:assert/strict";
import { test } from "node:test";
import { handshakeReplySchema } from "./handshake.ts";
import { localHostSchema } from "./lanEndpoint.ts";
import { readPairingQr } from "./pairingQr.ts";

const KEY = "A".repeat(43);
const hello = {
  protocolVersion: 1,
  platform: "macos",
  appVersion: "1.0.0",
  capabilities: [],
};
const lan = { hosts: ["192.168.1.20"], port: 47800, local: "Studio-Mac-2.local" };

test("a Bonjour name is letters, digits and hyphens ending in .local", () => {
  assert.equal(localHostSchema.safeParse("Studio-Mac-2.local").success, true);
  for (const name of [
    "Studio Mac.local",
    "studio.lan",
    "studio.mac.local",
    ".local",
    "studio_mac.local",
    "studio.local.",
    `${"a".repeat(64)}.local`,
  ]) {
    assert.equal(localHostSchema.safeParse(name).success, false, name);
  }
});

test("a welcome carries the Mac's current lan endpoint", () => {
  const parsed = handshakeReplySchema.parse({ type: "welcome", hello, lan });
  assert.deepEqual(parsed, { type: "welcome", hello, lan });
});

test("a welcome from an older Mac has no lan", () => {
  const parsed = handshakeReplySchema.parse({ type: "welcome", hello });
  assert.deepEqual(parsed, { type: "welcome", hello });
});

test("a bad Bonjour name is dropped without losing the welcome", () => {
  const bad = { ...lan, local: "evil.example.com" };
  const parsed = handshakeReplySchema.parse({ type: "welcome", hello, lan: bad });
  assert.equal(parsed.type === "welcome" ? parsed.lan?.local : "", undefined);
  assert.equal(parsed.type === "welcome" ? parsed.lan?.port : 0, lan.port);
});

test("the pairing QR keeps an optional Bonjour name", () => {
  const qr = { v: 1, pk: KEY, name: "Studio", code: "ABCD2345", psk: KEY, exp: 1 };
  assert.deepEqual(readPairingQr(JSON.stringify({ ...qr, lan }))?.lan, lan);
  const { local: _, ...withoutName } = lan;
  assert.deepEqual(readPairingQr(JSON.stringify({ ...qr, lan: withoutName }))?.lan, withoutName);
});
