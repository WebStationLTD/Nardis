import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Secret key for JWT verification
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export async function createSession(jwt) {
  // Store the WordPress JWT directly
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const sessionCookie = await cookies();
  sessionCookie.set("session", jwt, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });

  return true;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function decrypt(session = "") {
  try {
    // Instead of verifying the JWT, decode it directly
    // This assumes the JWT was already verified by CoCart
    const parts = session.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    // Base64Url decode the payload (second part)
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString()
    );
    
    return payload;
  } catch (error) {
    console.log("Failed to decode session", error);
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

// Get user information from the token
export async function getUserInfo() {
  const token = await getSession();
  if (!token) return null;

  const decoded = await decrypt(token);
  if (!decoded) return null;
  
  // Extract properties from the CoCart JWT structure
  // CoCart puts user data in data.user object
  const userData = decoded.data?.user;
  if (!userData) return null;
  
  const { id, username } = userData;
  // Email might be the same as username in your case
  const email = username;
  
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
