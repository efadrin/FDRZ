// User interface for authentication and user management
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

// Login response from authentication API
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Microsoft login request interface
export interface MicrosoftLoginRequest {
  email: string;
  name: string;
  microsoftId: string;
  accessToken: string;
}

// Standard login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Token validation response
export interface TokenValidationResponse {
  valid: boolean;
  user?: User;
}
