import { IntUser } from "../../types";
import { roles } from "../tempRoles";

export type Role = IntUser["role"];

export const bookmarkPermissionRoles: Role[] = [
  roles.SUPERADMIN,
  roles.STUDENT,
];

export const canBookmark = (userRole: Role | null): boolean => {
  return (
    userRole !== null &&
    userRole !== undefined &&
    bookmarkPermissionRoles.includes(userRole)
  );
};
