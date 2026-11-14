export type FieldErrors = Record<string, string[]>;
 
export type FormActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: FieldErrors;
  entityId?: number;
};
 
export const initialFormState: FormActionState = {
  status: "idle",
};
