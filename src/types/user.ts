import {Permission} from "@/types/permission.ts";
import {BasicStatus} from "@/enums/permission.ts";
import {Role} from "@/types/role.ts";

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  password?: string;
  avatar?: string;
  role?: Role;
  status?: BasicStatus;
  permissions?: Permission[];
}