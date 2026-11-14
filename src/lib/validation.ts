import type { ZodError } from "zod";
import type { FieldErrors } from "./form-state";
 
export function toFieldErrors<T>(error: ZodError<T>): FieldErrors {
  const entries = Object.entries(error.flatten().fieldErrors).filter(
    (entry): entry is [string, string[]] => Array.isArray(entry[1]),
  );
 
  return Object.fromEntries(entries);
}
