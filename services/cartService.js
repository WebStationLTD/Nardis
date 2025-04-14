import WooCommerce from "@/lib/woocomerce";
import { getGuestCartId, setGuestCartId } from "@/lib/guestCart";

/**
 * Get the shopping cart for a user or guest
 * @param {string|number} userId - The user ID or null for guest
 * @returns {Promise<Array>} Cart data
 */
export async function getCart(userId) {
  try {
    // For guest users, try to get cart ID from cookie
    let cartParams = {};
    let isGuest = false;

    if (!userId) {
      const guestCartId = await getGuestCartId();
      if (guestCartId) {
        // If we have a guest cart ID, use it directly
        cartParams = {
          id: guestCartId,
          _fields: "id,total,line_items,currency_symbol,subtotal,total_tax,shipping_total,discount_total,currency",
        };
        isGuest = true;
      } else {
        return []; // No guest cart found yet
      }
    } else {
      // For logged-in users, use the existing approach
      cartParams = {
        status: "shopping_cart",
        _fields: "id,total,customer_id,line_items,currency_symbol,subtotal,total_tax,shipping_total,discount_total,currency",
      };

      // Convert userId to number if possible
      const customerId = parseInt(userId, 10);
      cartParams.customer = !isNaN(customerId) ? customerId : userId;
    }

    // Fetch cart from WooCommerce
    if (isGuest) {
      // For guest carts, we fetch by ID directly
      const response = await WooCommerce.get(`orders/${cartParams.id}`, {
        _fields: cartParams._fields
      });
      return [response.data]; // Return as array to match existing format
    } else {
      // For logged-in users, we fetch by customer filter
      const response = await WooCommerce.get("orders", cartParams);
      return response.data;
    }
  } catch (error) {
    // Handle specific error cases
    if (error.response?.status === 400 && userId) {
      console.error(`Invalid user ID: ${userId}`);
      return [];
    }

    if (error.response?.status === 404) {
      return []; // No carts found
    }

    console.error(
      "Error fetching cart:",
      error.response?.data || error.message
    );
    return [];
  }
}

/**
 * Find or create a shopping cart for the user or guest
 * @param {string|number} userId - The user ID or null for guest
 * @returns {Promise<Object>} - The cart order object
 */
async function findOrCreateCart(userId) {
  try {
    // First try to find existing cart
    const existingCart = await getCart(userId);

    // If a cart exists, return the first one
    if (existingCart && existingCart.length > 0) {
      return existingCart[0];
    }

    // Create a new cart if none exists
    let cartData = {};
    
    if (userId) {
      // For logged-in users
      cartData = {
        customer_id: userId,
        status: "shopping_cart",
        meta_data: [
          {
            key: "is_cart",
            value: "true",
          },
        ],
      };
    } else {
      // For guest users
      cartData = {
        status: "shopping_cart",
        meta_data: [
          {
            key: "is_cart",
            value: "true",
          },
          {
            key: "is_guest_cart",
            value: "true",
          },
        ],
      };
    }

    // Create cart - only sending minimal required data
    const response = await WooCommerce.post("orders", cartData);
    
    if (!response.data || !response.data.id) {
      throw new Error("Failed to create cart: Invalid response from API");
    }
    
    // For guest users, store the cart ID in cookie
    if (!userId) {
      await setGuestCartId(response.data.id.toString());
    }
    
    return response.data;
  } catch (error) {
    console.error(
      "Error finding/creating cart:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to initialize shopping cart: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Add a product to the user's or guest's cart
 * @param {string|number} userId - The user ID or null for guest
 * @param {number} productId - The product ID to add
 * @param {number} quantity - Quantity to add
 * @param {Object} variations - Optional variation attributes
 * @returns {Promise<Object>} Updated cart
 */
export async function addToCart(
  userId,
  productId,
  quantity = 1,
  variations = {}
) {
  try {
    // Get or create cart for user or guest
    const cart = await findOrCreateCart(userId);
    
    if (!cart || !cart.id) {
      throw new Error("Failed to retrieve or create cart");
    }

    // Prepare the line item - only include required fields
    const lineItem = {
      product_id: productId,
      quantity: quantity
    };

    // Add variation data if present
    if (Object.keys(variations).length > 0 && variations.variation_id) {
      lineItem.variation_id = variations.variation_id;
    }

    // Check if product already exists in cart to increment quantity instead
    let existingItem = null;
    if (cart.line_items && cart.line_items.length > 0) {
      existingItem = cart.line_items.find(
        (item) =>
          item.product_id === productId &&
          (!variations.variation_id || item.variation_id === variations.variation_id)
      );
    }

    let updatedCart;

    if (existingItem) {
      // Calculate the new subtotal based on the price and updated quantity
      const unitPrice = parseFloat(existingItem.price) || 0;
      const newQuantity = existingItem.quantity + quantity;
      const newSubtotal = (unitPrice * newQuantity).toFixed(2);
      
      // Update existing item - with proper subtotal
      const updatedLineItems = cart.line_items.map(item => {
        if (item.id === existingItem.id) {
          return {
            id: item.id,
            quantity: newQuantity,
            subtotal: newSubtotal,
            total: newSubtotal
          };
        }
        // For other items, just include their ID to preserve them
        return {
          id: item.id
        };
      });
      
      // Update order with new quantities and subtotals
      const response = await WooCommerce.put(`orders/${cart.id}`, {
        line_items: updatedLineItems
      });
      updatedCart = response.data;
    } else {
      // For adding a new item, create an array of existing item IDs (or empty array if cart is empty)
      const existingLineItems = cart.line_items && cart.line_items.length > 0 
        ? cart.line_items.map(item => ({ id: item.id }))
        : [];
      
      // Add the new item to the array of existing items
      const response = await WooCommerce.put(`orders/${cart.id}`, {
        line_items: [...existingLineItems, lineItem]
      });
      updatedCart = response.data;
    }

    return updatedCart;
  } catch (error) {
    console.error(
      "Error adding to cart:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to add item to cart: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Update cart item quantity
 * @param {string|number} userId - The user ID or null for guest
 * @param {number} itemId - The line item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart
 */
export async function updateCartItem(userId, itemId, quantity) {
  try {
    const cart = await findOrCreateCart(userId);
    
    if (!cart || !cart.id) {
      throw new Error("Failed to retrieve cart");
    }

    // Find the line item in the cart
    const lineItem = cart.line_items?.find(
      (item) => item.id === itemId
    );

    if (!lineItem) {
      throw new Error("Item not found in cart");
    }

    if (quantity <= 0) {
      // Remove the item if quantity is zero or negative
      return await removeFromCart(userId, itemId);
    }

    // Calculate the new subtotal based on the price and quantity
    const unitPrice = parseFloat(lineItem.price) || 0;
    const newSubtotal = (unitPrice * quantity).toFixed(2);

    // Prepare line items array for update with calculated subtotal and total
    const updatedLineItems = cart.line_items.map(item => {
      if (item.id === itemId) {
        // Include all necessary fields for the update
        return {
          id: item.id,
          quantity: quantity,
          subtotal: newSubtotal,
          total: newSubtotal
        };
      }
      // For other items, just include their ID to preserve them
      return {
        id: item.id
      };
    });

    // Update the order with properly calculated values
    const response = await WooCommerce.put(`orders/${cart.id}`, {
      line_items: updatedLineItems
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error updating cart item:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to update cart item: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Remove an item from the cart
 * @param {string|number} userId - The user ID or null for guest
 * @param {number} itemId - The line item ID to remove
 * @returns {Promise<Object>} Updated cart
 */
export async function removeFromCart(userId, itemId) {
  try {
    const cart = await findOrCreateCart(userId);
    
    if (!cart || !cart.id) {
      throw new Error("Failed to retrieve cart");
    }

    // Find the line item in the cart
    const lineItem = cart.line_items?.find((item) => item.id === itemId);

    if (!lineItem) {
      throw new Error("Item not found in cart");
    }

    // Prepare line items array for update - properly set quantity to 0 and clear totals
    const updatedLineItems = cart.line_items.map(item => {
      if (item.id === itemId) {
        // Set quantity to 0 and subtotal/total to 0 to remove the item
        return {
          id: itemId,
          quantity: 0,
          subtotal: "0.00",
          total: "0.00"
        };
      }
      // For other items, just include their ID to preserve them
      return {
        id: item.id
      };
    });

    // Update the order with properly formatted values
    const response = await WooCommerce.put(`orders/${cart.id}`, {
      line_items: updatedLineItems
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error removing item from cart:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to remove item from cart: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Clear all items from the cart
 * @param {string|number} userId - The user ID or null for guest
 * @returns {Promise<boolean>} Success status
 */
export async function clearCart(userId) {
  try {
    const cart = await findOrCreateCart(userId);
    
    if (!cart || !cart.id) {
      throw new Error("Failed to retrieve cart");
    }

    // Check if cart has items to clear
    if (!cart.line_items || cart.line_items.length === 0) {
      return true; // Cart is already empty
    }

    // Create minimal line items array for update - all with quantity 0
    const emptyLineItems = cart.line_items.map(item => ({
      id: item.id,
      quantity: 0
    }));

    // Update the order to remove all items
    await WooCommerce.put(`orders/${cart.id}`, {
      line_items: emptyLineItems
    });

    return true;
  } catch (error) {
    console.error(
      "Error clearing cart:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to clear cart: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Apply a discount coupon to the cart
 * @param {string|number} userId - The user ID or null for guest
 * @param {string} couponCode - Coupon code to apply
 * @returns {Promise<Object>} Updated cart with applied coupon
 */
export async function applyDiscount(userId, couponCode) {
  try {
    const cart = await findOrCreateCart(userId);
    
    if (!cart || !cart.id) {
      throw new Error("Failed to retrieve cart");
    }

    if (!couponCode || couponCode.trim() === '') {
      throw new Error("Invalid coupon code");
    }

    // Validate coupon first
    try {
      await WooCommerce.get("coupons", {
        code: couponCode,
      });
    } catch (couponError) {
      throw new Error("Invalid or expired coupon code");
    }

    // Apply coupon to the order - only send the necessary data
    const response = await WooCommerce.put(`orders/${cart.id}`, {
      coupon_lines: [
        {
          code: couponCode.trim(),
        },
      ],
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error applying discount:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to apply discount: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Convert a shopping cart to a pending order to start checkout
 * @param {string|number} userId - The user ID or null for guest
 * @returns {Promise<Object>} The pending order
 */
export async function convertCartToOrder(userId) {
  try {
    const cart = await findOrCreateCart(userId);
    
    if (!cart || !cart.id) {
      throw new Error("Failed to retrieve cart");
    }

    // Check if cart has items
    if (!cart.line_items || cart.line_items.length === 0) {
      throw new Error("Cannot checkout an empty cart");
    }

    // Update cart status to pending - only send status change
    const response = await WooCommerce.put(`orders/${cart.id}`, {
      status: "pending",
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error converting cart to order:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to start checkout process: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Get the number of items in the cart
 * @param {string|number} userId - The user ID or null for guest
 * @returns {Promise<number>} Number of items in cart
 */
export async function getCartItemCount(userId) {
  try {
    let cart = null;
    
    if (!userId) {
      // For guest users, get cart from cookie ID
      const guestCartId = await getGuestCartId();
      if (!guestCartId) {
        return 0;
      }
      
      try {
        // Fetch cart by ID
        const response = await WooCommerce.get(`orders/${guestCartId}`, {
          _fields: "line_items"
        });
        cart = response.data;
      } catch (error) {
        // Handle cart not found or invalid ID
        if (error.response?.status === 404) {
          return 0;
        }
        throw error;
      }
    } else {
      // For registered users
      const params = {
        status: "shopping_cart",
        _fields: "line_items",
        customer: parseInt(userId, 10) || userId
      };
      
      const response = await WooCommerce.get("orders", params);
      
      if (!response.data || response.data.length === 0) {
        return 0;
      }
      
      cart = response.data[0];
    }
    
    // Sum up quantities of all items
    if (!cart || !cart.line_items) {
      return 0;
    }
    
    return cart.line_items.reduce(
      (total, item) => total + (parseInt(item.quantity, 10) || 0), 
      0
    );
  } catch (error) {
    console.error("Error getting cart count:", error);
    return 0;
  }
}

/**
 * Calculate cart subtotal or total
 * @param {string|number} userId - The user ID or null for guest
 * @returns {Promise<Object>} Cart totals object with subtotal, tax, shipping, and total
 */
export async function getCartTotals(userId) {
  try {
    let cart = null;
    
    if (!userId) {
      // For guest users, get cart from cookie ID
      const guestCartId = await getGuestCartId();
      if (!guestCartId) {
        return {
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
          currency: "BGN",
          currencySymbol: "лв.",
          itemCount: 0
        };
      }
      
      try {
        // Fetch cart by ID
        const response = await WooCommerce.get(`orders/${guestCartId}`, {
          _fields: "id,total,total_tax,shipping_total,discount_total,currency,currency_symbol,line_items"
        });
        cart = response.data;
      } catch (error) {
        // Handle cart not found or invalid ID
        if (error.response?.status === 404) {
          return {
            subtotal: 0,
            tax: 0,
            shipping: 0,
            discount: 0,
            total: 0,
            currency: "BGN",
            currencySymbol: "лв.",
            itemCount: 0
          };
        }
        throw error;
      }
    } else {
      // For registered users
      const params = {
        status: "shopping_cart",
        _fields: "id,total,total_tax,shipping_total,discount_total,currency,currency_symbol,line_items",
        customer: parseInt(userId, 10) || userId
      };
      
      const response = await WooCommerce.get("orders", params);
      
      if (!response.data || response.data.length === 0) {
        return {
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
          currency: "BGN",
          currencySymbol: "лв.",
          itemCount: 0
        };
      }
      
      cart = response.data[0];
    }
    
    // Process cart totals
    const itemCount = cart.line_items 
      ? cart.line_items.reduce((count, item) => count + (parseInt(item.quantity, 10) || 0), 0) 
      : 0;
    
    // Calculate subtotal from line items
    const subtotal = cart.line_items 
      ? cart.line_items.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0)
      : 0;

    return {
      subtotal: subtotal,
      tax: parseFloat(cart.total_tax || 0),
      shipping: parseFloat(cart.shipping_total || 0),
      discount: parseFloat(cart.discount_total || 0),
      total: parseFloat(cart.total || 0),
      currency: cart.currency || "BGN",
      currencySymbol: cart.currency_symbol || "лв.",
      itemCount
    };
  } catch (error) {
    console.error("Error calculating cart totals:", error);
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      currency: "BGN",
      currencySymbol: "лв.",
      itemCount: 0
    };
  }
}
