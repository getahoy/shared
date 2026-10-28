import { z } from "zod";
import { MAX_COMMAND_TEXT_CHARS } from "./command";

export const MAX_INTERPRET_ACTIONS = 3;
export const MAX_INTERPRET_APPS = 300;
export const MAX_TYPED_CHARS = 200;
export const MAX_EMAIL_SUBJECT_CHARS = 150;
export const MAX_EMAIL_BODY_CHARS = 1500;
const MAX_APP_NAME_CHARS = 100;
const MAX_QUERY_CHARS = 200;
const MAX_HOST_CHARS = 253;
const MAX_TAB_MATCH_CHARS = 100;
const MAX_CLICK_LABEL_CHARS = 100;
const MAX_EMAIL_CHARS = 254;

export const KEY_MODIFIERS = ["mod", "shift", "alt", "control"] as const;

export const NAMED_KEYS = [
  "return",
  "tab",
  "space",
  "delete",
  "forwardDelete",
  "escape",
  "home",
  "end",
  "pageUp",
  "pageDown",
  "left",
  "right",
  "up",
  "down",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
  "f10",
  "f11",
  "f12",
] as const;

export const LETTER_KEYS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;

export const SYMBOL_KEYS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "=",
  "-",
  "[",
  "]",
  ";",
  "'",
  ",",
  ".",
  "/",
  "\\",
  "`",
] as const;

export const CHARACTER_KEYS = [...LETTER_KEYS, ...SYMBOL_KEYS] as const;

export const EMAIL_APPS = ["mail", "gmail"] as const;

const appNameSchema = z.string().min(1).max(MAX_APP_NAME_CHARS);
const tabMatchSchema = z.string().min(1).max(MAX_TAB_MATCH_CHARS);
const browserSchema = appNameSchema.nullable();

export const interpretActionSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("open"), app: appNameSchema }),
  z.object({ kind: z.literal("quit"), app: appNameSchema }),
  z.object({ kind: z.literal("hide"), app: appNameSchema }),
  z.object({ kind: z.literal("switch"), app: appNameSchema }),
  z.object({
    kind: z.literal("search"),
    query: z.string().min(1).max(MAX_QUERY_CHARS),
    browser: browserSchema,
  }),
  z.object({
    kind: z.literal("openSite"),
    host: z.string().min(1).max(MAX_HOST_CHARS),
    browser: browserSchema,
  }),
  z.object({
    kind: z.literal("keys"),
    key: z.enum([...NAMED_KEYS, ...CHARACTER_KEYS]),
    modifiers: z.array(z.enum(KEY_MODIFIERS)).max(KEY_MODIFIERS.length),
  }),
  z.object({ kind: z.literal("type"), text: z.string().min(1).max(MAX_TYPED_CHARS) }),
  z.object({ kind: z.literal("click"), label: z.string().min(1).max(MAX_CLICK_LABEL_CHARS) }),
  z.object({
    kind: z.literal("closeTab"),
    match: tabMatchSchema,
    browser: browserSchema,
  }),
  z.object({
    kind: z.literal("switchTab"),
    match: tabMatchSchema,
    browser: browserSchema,
  }),
  z.object({
    kind: z.literal("draftEmail"),
    to: z.string().max(MAX_EMAIL_CHARS).nullable(),
    subject: z.string().min(1).max(MAX_EMAIL_SUBJECT_CHARS),
    body: z.string().min(1).max(MAX_EMAIL_BODY_CHARS),
    via: z.enum(EMAIL_APPS),
    browser: browserSchema,
  }),
]);

export const interpretRequestSchema = z.object({
  text: z.string().min(1).max(MAX_COMMAND_TEXT_CHARS),
  apps: z.array(appNameSchema).max(MAX_INTERPRET_APPS),
});

export const interpretResponseSchema = z.object({
  actions: z.array(interpretActionSchema).max(MAX_INTERPRET_ACTIONS),
});

export type KeyModifier = (typeof KEY_MODIFIERS)[number];
export type KeyName = (typeof NAMED_KEYS)[number] | (typeof CHARACTER_KEYS)[number];
export type EmailApp = (typeof EMAIL_APPS)[number];
export type InterpretAction = z.infer<typeof interpretActionSchema>;
export type InterpretRequest = z.infer<typeof interpretRequestSchema>;
export type InterpretResponse = z.infer<typeof interpretResponseSchema>;
