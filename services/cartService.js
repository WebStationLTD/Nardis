import WooCommerce from "@/lib/woocomerce";

export async function getCart(userId) {
  try {
    if (!userId) {
      return [];
    }

    const params = {
      status: "shopping_cart",
      _fields: "id,total,customer_id,line_items,currency_symbol",
    };

    const customerId = parseInt(userId, 10);
    params.customer = !isNaN(customerId) ? customerId : userId;

    const response = await WooCommerce.get("orders", params);
    return response.data;
  } catch (error) {
    if (error.response?.status === 400 && userId) {
      console.error(`Invalid user ID: ${userId}`);
      return [];
    }

    console.error(
      "Error fetching cart:",
      error.response?.data || error.message
    );
    return [];
  }
}
