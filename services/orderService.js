import WooCommerce from "@/lib/woocomerce";
import { getUserInfo } from "@/lib/session";

export async function getOrders(userId) {
  try {
    // Return empty array if no valid user ID is provided
    if (
      !userId ||
      userId === "undefined" ||
      userId === "null" ||
      userId === "unknown"
    ) {
      return [];
    }

    const params = {};
    params.status = "processing,on-hold,completed,cancelled,refunded,refunded,failed";

    // Convert to number if it's a numeric string
    const customerId = parseInt(userId, 10);
    params.customer = !isNaN(customerId) ? customerId : userId;

    const response = await WooCommerce.get("orders", params);
    return response.data;
  } catch (error) {
    // If error is due to invalid user ID, return empty array
    if (error.response?.status === 400 && userId) {
      console.error(`Invalid user ID: ${userId}`);
      return [];
    }

    console.error(
      "Error fetching orders:",
      error.response?.data || error.message
    );
    return [];
  }
}

export async function getOrderById(orderId) {
  try {
    // Get current user info
    const userInfo = await getUserInfo();

    if (!userInfo || !userInfo.id) {
      console.error("User not authenticated");
      return null;
    }

    // Fetch the order
    const response = await WooCommerce.get(`orders/${orderId}`);
    const order = response.data;

    // Verify the order belongs to the current user
    // WooCommerce API might use different field names for customer ID
    const currentUserId = parseInt(userInfo.id, 10);
    const orderCustomerId = parseInt(order.customer_id, 10);

    if (isNaN(orderCustomerId) || orderCustomerId !== currentUserId) {
      console.error(
        "Unauthorized access: Order doesn't belong to current user"
      );
      return null;
    }

    return order;
  } catch (error) {
    console.error(
      `Error fetching order ${orderId}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

/**
 * Places an order based on a cart/pending order
 * @param {number|string} orderId - The order/cart ID to process
 * @param {Object} customerData - Customer information
 * @returns {Promise<Object>} Processed order data
 */
export async function placeOrder(orderId, customerData) {
  try {
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    // Build order data from customer information
    const orderData = {
      billing: {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        address_1: customerData.address,
        city: customerData.city,
        state: customerData.state || "",
        postcode: customerData.postcode || "",
        country: customerData.country || "BG",
        email: customerData.email,
        phone: customerData.phone,
      },
      shipping: {
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        address_1: customerData.address,
        city: customerData.city,
        state: customerData.state || "",
        postcode: customerData.postcode || "",
        country: customerData.country || "BG",
      },
      // Set to cash on delivery
      payment_method: "cod",
      payment_method_title: "Cash on Delivery",
      // Set to processing as the payment will be on delivery
      status: "processing",
      customer_note: customerData.notes || "",
    };

    // Update the order with customer data and change status
    const response = await WooCommerce.put(`orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    console.error(
      "Error placing order:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to place order: ${error.message || "Unknown error"}`);
  }
}
