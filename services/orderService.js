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
