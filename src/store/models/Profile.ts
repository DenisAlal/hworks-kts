export interface ProfileAPI {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}
export interface ProfileModel {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

export const normalizeProfile = (from: ProfileAPI): ProfileModel => ({
  id: from.id,
  email: from.email,
  password: from.password,
  name: from.name,
  role: from.role,
  avatar: from.avatar,
  creationAt: from.creationAt,
  updatedAt: from.updatedAt,
});
