export interface User {
  id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: "ahtlete" | "company" | "ATHLETE" | "COMPANY" | "admin";
  cnpj?: string;
  profileImg?: string;
  bannerImg?: string;
  bio?: string;
  // Campos de moderação
  isBanned?: boolean;
  bannedAt?: string;
  bannedReason?: string;
  bannedByAdminId?: number;
  isSuspended?: boolean;
  suspendedUntil?: string;
  suspensionReason?: string;
  skills?: { id: number; name: string }[];
  height?: number;
  weight?: number;
  footDomain?: string;
  position?: string;
  birthDate?: string;
}

export interface GetUserByUsername {
  username: string;
}

export interface UpdateUser {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  profileImg?: File;
  bannerImg?: File;
  skills?: { id: number; name: string }[];
  height?: number;
  weight?: number;
  footDomain?: string;
  position?: string;
  birthDate?: string;
}
