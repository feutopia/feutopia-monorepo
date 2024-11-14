import { isRef } from "vue";

export const isNotRefObject = (value: unknown): value is object =>
  typeof value === "object" && value !== null && !isRef(value);
