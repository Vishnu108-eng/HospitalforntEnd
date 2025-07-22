export interface LoginViewModel {
  email: string;
  password: string;
}
// src/app/shared/types.ts
export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  message?: string;
}