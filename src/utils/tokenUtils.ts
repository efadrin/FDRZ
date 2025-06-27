import { jwtDecode, JwtPayload } from "jwt-decode";

export const isTokenExpired = (
  token: string | null,
  bufferTime: number = 600
): boolean => {
  if (token === null) {
    return true;
  }
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp) {
      return decoded.exp < currentTime + bufferTime;
    }

    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
};

export const getTokenExpiration = (token: string | null): Date | null => {
  if (token === null) {
    return null;
  }
  try {
    const decoded: JwtPayload = jwtDecode(token);
    if (decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
