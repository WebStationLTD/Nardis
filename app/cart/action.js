"use server";

import { getUserInfo } from "@/lib/session";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyDiscount, convertCartToOrder, getCartTotals, getCartItemCount } from "@/services/cartService";

/**
 * Server action to fetch the current user information
 * @returns {Promise<Object|null>} User information or null if not authenticated
 */
export async function fetchUserAction() {
  try {
    const userInfo = await getUserInfo();
    if (!userInfo) {
      return { error: "Not authenticated", status: 401 };
    }
    
    return { user: userInfo };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { error: "Failed to fetch user data", status: 500 };
  }
}

/**
 * Server action to fetch the user's cart
 * @returns {Promise<Object>} Cart data or error
 */
export async function fetchCartAction() {
  try {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return { error: "User not authenticated", status: 401 };
    }
    
    const cartData = await getCart(userInfo.id);
    return { cart: cartData };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { error: "Failed to fetch cart", status: 500 };
  }
}

/**
 * Server action to add item to cart
 * @param {number} productId - Product ID to add
 * @param {number} quantity - Quantity to add
 * @param {Object} variations - Optional variation data
 * @returns {Promise<Object>} Updated cart or error
 */
export async function addToCartAction(productId, quantity = 1, variations = {}) {
  try {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return { error: "User not authenticated", status: 401 };
    }
    
    const result = await addToCart(userInfo.id, productId, quantity, variations);
    return { cart: result };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { error: "Failed to add item to cart", status: 500 };
  }
}

/**
 * Server action to update cart item
 * @param {number} itemId - Cart item ID to update
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart or error
 */
export async function updateCartItemAction(itemId, quantity) {
  try {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return { error: "User not authenticated", status: 401 };
    }
    
    const result = await updateCartItem(userInfo.id, itemId, quantity);
    return { cart: result };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { error: "Failed to update cart item", status: 500 };
  }
}

/**
 * Server action to remove item from cart
 * @param {number} itemId - Cart item ID to remove
 * @returns {Promise<Object>} Updated cart or error
 */
export async function removeFromCartAction(itemId) {
  try {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return { error: "User not authenticated", status: 401 };
    }
    
    const result = await removeFromCart(userInfo.id, itemId);
    return { cart: result };
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return { error: "Failed to remove item from cart", status: 500 };
  }
}

/**
 * Server action to clear the entire cart
 * @returns {Promise<Object>} Success message or error
 */
export async function clearCartAction() {
  try {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return { error: "User not authenticated", status: 401 };
    }
    
    const result = await clearCart(userInfo.id);
    return { success: result };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { error: "Failed to clear cart", status: 500 };
  }
}

/**
 * Server action to apply discount coupon
 * @param {string} couponCode - Coupon code to apply
 * @returns {Promise<Object>} Updated cart or error
 */
export async function applyDiscountAction(couponCode) {
  try {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return { error: "User not authenticated", status: 401 };
    }
    
    const result = await applyDiscount(userInfo.id, couponCode);
    return { cart: result };
  } catch (error) {
    console.error("Error applying discount:", error);
    return { error: "Failed to apply discount", status: 500 };
  }
}

/**
 * Server action to convert cart to order for checkout
 * @returns {Promise<Object>} The pending order or error
 */
export async function convertCartToOrderAction() {
  try {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return { error: "User not authenticated", status: 401 };
    }
    
    const result = await convertCartToOrder(userInfo.id);
    return { order: result };
  } catch (error) {
    console.error("Error converting cart to order:", error);
    return { error: "Failed to start checkout process", status: 500 };
  }
}

/**
 * Server action to get cart totals
 * @returns {Promise<Object>} Cart totals or error
 */
export async function getCartTotalsAction() {
  try {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return { error: "User not authenticated", status: 401 };
    }
    
    const totals = await getCartTotals(userInfo.id);
    return { totals };
  } catch (error) {
    console.error("Error fetching cart totals:", error);
    return { error: "Failed to calculate cart totals", status: 500 };
  }
}

/**
 * Server action to get cart item count
 * @returns {Promise<Object>} Cart item count or error
 */
export async function getCartItemCountAction() {
  try {
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return { error: "User not authenticated", status: 401 };
    }
    
    const count = await getCartItemCount(userInfo.id);
    return { count };
  } catch (error) {
    console.error("Error fetching cart count:", error);
    return { error: "Failed to get cart count", status: 500 };
  }
} 