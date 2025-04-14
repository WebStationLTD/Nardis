import { cookies } from "next/headers";

const GUEST_CART_COOKIE = "guest_cart_id";

/**
 * Get the guest cart ID from cookie
 * @returns {string|null} The cart ID or null if not found
 */
export async function getGuestCartId() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(GUEST_CART_COOKIE);

  return cartCookie?.value || null;
}

/**
 * Store the guest cart ID in a cookie
 * @param {string} cartId - The cart ID to store
 * @returns {boolean} Success status
 */
export async function setGuestCartId(cartId) {
  if (!cartId) return false;

  // Set cookie with a 30-day expiration
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  const cookieStore = await cookies();
  cookieStore.set(GUEST_CART_COOKIE, cartId, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    path: "/"
  });

  return true;
}

/**
 * Remove the guest cart cookie
 * @returns {boolean} Success status
 */
export async function removeGuestCartId() {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_CART_COOKIE);
  return true;
}