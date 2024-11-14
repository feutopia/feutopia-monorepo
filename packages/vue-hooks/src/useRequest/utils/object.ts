import { isRef } from "vue";

export const isNonRefObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null && !isRef(value);
