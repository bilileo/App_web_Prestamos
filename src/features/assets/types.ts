import type { AssetStatus } from "./constants";
 
export type AssetFormValues = {
  code: string;
  name: string;
  description: string;
  serialNumber: string;
  categoryId: string;
  status: AssetStatus;
};
 
export type DeleteTarget = {
  id: number;
  code: string;
  name: string;
};
