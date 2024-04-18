import {BasicStatus} from "@/enums/permission.ts";

export interface Role {
  id: string;
  name: string;
  label: string;
  status: BasicStatus;
  order?: number;
  desc?: string;
}