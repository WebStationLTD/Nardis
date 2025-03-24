import WooCommerce from "@/lib/woocomerce";

export async function getOrders(userId) {
  try {
    // Return empty array if no valid user ID is provided
    if (!userId || userId === "undefined" || userId === "null" || userId === "unknown") {
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
    
    console.error("Error fetching orders:", error.response?.data || error.message);
    return [];
  }
}

export async function getOrderById(orderId) {
  try {
    const response = await WooCommerce.get(`orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error.response?.data || error.message);
    return null;
  }
}
