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

// Get user information from the token
export async function getUserInfo() {
  const token = await getSession();
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
