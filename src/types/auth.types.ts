// User interface for authentication and user management
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
}

// FDRW Login response from authentication API
export interface LoginResponse {
  message: string;
  statusCode: number;
  succeeded: boolean;
  data: {
    sessionToken: string;
  };
}

// FDRW Authentication request (using Microsoft Graph token)
export interface AuthRequest {
  token: string;
}

// Microsoft login request interface (for internal use)
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
