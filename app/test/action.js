"use server";

import { cookies } from "next/headers";

// This successfully sets the cart key in the cookie but the action must be called from the client component
export async function getCart() {
  try {
    // Get cookies for authentication and cart identification
    const { cartKey, session } = await getKeysForCart();

    const headers = {
      "Content-Type": "application/json",
    };

    // Add authorization header if session exists
    if (session) {
      headers["Authorization"] = `Bearer ${session}`;
    }

    // Determine the URL based on authentication state
    const url = session
      ? "https://nardis.rosset.website/wp-json/cocart/v2/cart"
      : `https://nardis.rosset.website/wp-json/cocart/v2/cart${
          cartKey ? `?cart_key=${cartKey}` : ""
        }`;

    //   console.log("Making request to:", url);

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Disable caching for this request
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // If we're a guest (no session) and we have a cart key in the response,
    // store the cart key in the cookie
    if (!session && data.cart_key) {
      // Even if we already have a cartKey cookie, update it with the latest
      console.log("Setting cart_key cookie:", data.cart_key);
      await setCartKeyCookie(data.cart_key);
    }

    // Return the cart data
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return {
      items: [],
      item_count: 0,
      items_weight: 0,
      total: "0",
      error: error.message,
    };
  }
}

// Function to set the cart key in a cookie
export async function setCartKeyCookie(cartKeyValue) {
  try {
    // Validate the cart key
    if (!cartKeyValue) {
      console.error("Missing cart key value");
      return { success: false, error: "Cart key value is required" };
    }

    console.log(`Setting cart_key cookie: ${cartKeyValue}`);

    // Set the cookie
    (await cookies()).set("cart_key", cartKeyValue, {
      maxAge: 31536000, // 1 year in seconds
      path: "/",
    });

    return { success: true, cartKey: cartKeyValue };
  } catch (error) {
    console.error("Error setting cart_key cookie:", error);
    return {
      success: false,
      error: "Failed to set cart_key cookie",
      details: error.message,
    };
  }
}

// Function to store cart key from CoCart response
export async function storeCartKey(cartKey) {
  if (!cartKey) {
    return { success: false, error: "No cart key provided" };
  }

  return await setCartKeyCookie(cartKey);
}

export const getServerCookie = async (name) => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value || null;
  } catch (error) {
    console.error(`Error getting server cookie ${name}:`, error);
    return null;
  }
};

export const getCartKey = async () => {
  return await getServerCookie("cart_key");
};

export const getSession = async () => {
  return await getServerCookie("session");
};

export const getKeysForCart = async () => {
  const cartKey = await getCartKey();
  const session = await getSession();

//   console.log("Got keys for cart - Session:", session ? "Found" : "Not Found");
//   console.log("Got keys for cart - CartKey:", cartKey);

  return {
    cartKey,
    session,
  };
};
