"use server";

import { getUserInfo } from "@/lib/session";
import { getCart, convertCartToOrder, getCartTotals } from "@/services/cartService";
import { placeOrder } from "@/services/orderService";
import { checkoutFormSchema } from "./schema";
import { removeGuestCartId } from "@/lib/guestCart";

/**
 * Server action to start the checkout process by converting cart to a pending order
 * @returns {Promise<Object>} The pending order or error
 */
export async function startCheckoutAction() {
  try {
    const userInfo = await getUserInfo();
    const userId = userInfo?.id || null;
    
    // First get the cart to verify it has items
    const cart = await getCart(userId);
    if (!cart || cart.length === 0 || !cart[0].line_items || cart[0].line_items.length === 0) {
      return { error: "Your cart is empty", status: 400 };
    }
    
    // Convert the cart to a pending order
    const pendingOrder = await convertCartToOrder(userId);
    return { order: pendingOrder };
  } catch (error) {
    console.error("Error starting checkout:", error);
    return { error: "Failed to start checkout", status: 500 };
  }
}

/**
 * Server action to get checkout details (cart totals and items)
 * @returns {Promise<Object>} Checkout details or error
 */
export async function getCheckoutDetailsAction() {
  try {
    const userInfo = await getUserInfo();
    const userId = userInfo?.id || null;
    
    // Get cart and totals
    const cart = await getCart(userId);
    const totals = await getCartTotals(userId);
    
    if (!cart || cart.length === 0) {
      return { error: "Your cart is empty", status: 400 };
    }
    
    return { 
      cart: cart[0],
      totals,
      user: userInfo || null
    };
  } catch (error) {
    console.error("Error fetching checkout details:", error);
    return { error: "Failed to fetch checkout details", status: 500 };
  }
}

/**
 * Server action to complete the checkout process with validation
 * @param {FormData} formData - Form data with customer information
 * @returns {Promise<Object>} Completed order or validation errors
 */
export async function completeCheckoutAction(formData) {
  try {
    // Extract data from form
    const customerData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state") || "",
      postcode: formData.get("postcode") || "",
      country: formData.get("country") || "BG",
      notes: formData.get("notes") || ""
    };
    
    // Validate using Zod schema
    const validationResult = checkoutFormSchema.safeParse(customerData);
    
    if (!validationResult.success) {
      // Return formatted validation errors
      return {
        errors: validationResult.error.flatten().fieldErrors,
        status: 400
      };
    }
    
    const userInfo = await getUserInfo();
    const userId = userInfo?.id || null;
    
    // Get current cart/pending order
    const cart = await getCart(userId);
    if (!cart || cart.length === 0) {
      return { error: "Your cart is empty", status: 400 };
    }
    
    const orderId = cart[0].id;
    
    // Use the validated data from Zod
    const validatedData = validationResult.data;
    
    // Place the order
    const completedOrder = await placeOrder(orderId, validatedData);
    
    // If this is a guest user (no userId), remove the old cart cookie
    if (!userId) {
      await removeGuestCartId();
    }
    
    return { order: completedOrder };
  } catch (error) {
    console.error("Error completing checkout:", error);
    return { error: "Failed to complete checkout", status: 500 };
  }
} 