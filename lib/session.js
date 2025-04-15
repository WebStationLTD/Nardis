import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Secret key for JWT verification
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const encodedKey = new TextEncoder().encode(JWT_SECRET);

const DEFAULT_SESSION_EXPIRY = 60 * 60 * 1000;

export async function createSession(jwt) {
  // Store the WordPress JWT directly
  const expiresAt = new Date(Date.now() + DEFAULT_SESSION_EXPIRY);

  const sessionCookie = await cookies();
  sessionCookie.set("session", jwt, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });

  return true;
}

export async function updateSession(jwt) {
  return createSession(jwt);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function decrypt(session = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
    return null;
  }
}

export async function getSession() {
  const sessionCookie = await cookies();
  const session = sessionCookie.get("session");

  if (!session || !session.value) {
    return null;
  }

  return session.value;
}

// Check if token is approaching expiration (within 5 minutes)
export async function isTokenExpiringSoon(token) {
  if (!token) return false;
  
  try {
    const decoded = await decrypt(token);
    if (!decoded || !decoded.exp) return false;
    
    // Check if token expires in less than 5 minutes
    const expiryTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeToExpiry = expiryTime - currentTime;
    
    // Return true if token expires in less than 5 minutes
    return timeToExpiry < 5 * 60 * 1000 && timeToExpiry > 0;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return false;
  }
}

// Refresh the token if it's approaching expiration
export async function refreshTokenIfNeeded() {
  const token = await getSession();
  if (!token) return null;
  
  // Check if token is about to expire
  const isExpiring = await isTokenExpiringSoon(token);
  if (!isExpiring) return token;
  
  try {
    // Call the refresh token API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (response.ok && data.jwt) {
      // Update the session with the new token
      await updateSession(data.jwt);
      return data.jwt;
    } else {
      console.error('Failed to refresh token:', data.error);
      return token; // Return existing token if refresh fails
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return token; // Return existing token if refresh fails
  }
}

// Get user information from the token
export async function getUserInfo() {
  // Attempt to refresh token if needed before getting user info
  const token = await refreshTokenIfNeeded();
  if (!token) return null;

  const decoded = await decrypt(token);
  if (!decoded) return null;
  
  // Extract only the needed properties
  const { email, id, username } = decoded;
  return { email, id, username };
}

// // Get specific user properties based on the actual WordPress JWT structure
// export async function getUserId() {
//   const userInfo = await getUserInfo();
//   // From your example, the id is directly in the payload
//   return userInfo?.id || null;
// }

// export async function getUserEmail() {
//   const userInfo = await getUserInfo();
//   // From your example, the email is directly in the payload
//   return userInfo?.email || null;
// }

// export async function isAuthenticated() {
//   const userInfo = await getUserInfo();
//   return !!userInfo && !!userInfo.id;
// }
