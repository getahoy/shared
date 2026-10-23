import { z } from "zod";
import { errorCodes } from "../errorCodes";

export const REQUEST_ID_HEADER = "x-request-id";

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.enum(errorCodes),
    message: z.string(),
    field: z.string().optional(),
  }),
});

export function apiSuccessSchema<T>(payload: z.ZodType<T>) {
  return z.object({ success: z.literal(true), data: payload });
}

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ApiSuccess<T> = { success: true; data: T };
