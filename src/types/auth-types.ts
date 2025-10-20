// Type definitions for authentication responses

export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}