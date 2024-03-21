import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Permissions = {
  READ_MESSAGES: Math.trunc(1),
  WRITE_MESSAGES: 1 << 1,
  MANAGE_MESSAGES: (1 << 2) - 1,

  CHANGE_PERMISSION: 1 << 3,

  INVITE_MEMBER: 1 << 4,
  MANAGE_GROUP: 1 << 6,
  ADMINISTRATOR: (1 << 7) - 1
};

export type AllPermissions = keyof typeof Permissions;
type AllowedPermission = AllPermissions | AllPermissions[];

export function checkPermission(permissionBits: number, permission: AllPermissions): boolean {
  return (permissionBits & Permissions[permission]) === Permissions[permission];
}

export function setPermission(permissionBits: number, permissions: AllowedPermission): number {
  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }
  let updatedPermissionBits = permissionBits;
  for (const permission of permissions) {
    updatedPermissionBits |= Permissions[permission];
  }
  return updatedPermissionBits;
}

export function removePermission(permissionBits: number, permissions: AllowedPermission): number {
  if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }
  let updatedPermissionBits = permissionBits;
  for (const permission of permissions) {
    updatedPermissionBits ^= Permissions[permission];
  }
  return updatedPermissionBits;
}
