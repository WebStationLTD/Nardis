"use client";

import { useState, useEffect } from "react";
import { fetchUserAction, fetchCartAction, updateCartItemAction, removeFromCartAction, clearCartAction } from "./action";
import Image from "next/image";
import Link from "next/link";
import { TrashIcon, ShoppingBagIcon, MinusIcon, PlusIcon, ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [updateLoading, setUpdateLoading] = useState({});

  // Fetch user data using server action
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await fetchUserAction();
        
        if (result.error) {
          if (result.status === 401) {
            setError("Моля, влезте в акаунта си, за да видите кошницата");
            setLoading(false);
            return;
          }
          throw new Error(result.error);
        }
        
        setUser(result.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Неуспешна автентикация");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch cart data when user is available
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const result = await fetchCartAction();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setCart(result.cart);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setError("Неуспешно зареждане на кошницата");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Handle quantity update
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdateLoading(prev => ({ ...prev, [itemId]: true }));
    
    try {
      const result = await updateCartItemAction(itemId, newQuantity);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Wrap the cart data in array format to match the expected structure
      setCart(result.cart ? [result.cart] : []);
    } catch (err) {
      console.error("Failed to update item:", err);
    } finally {
      setUpdateLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Handle item removal
  const handleRemoveItem = async (itemId) => {
    setUpdateLoading(prev => ({ ...prev, [itemId]: true }));
    
    try {
      const result = await removeFromCartAction(itemId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Wrap the cart data in array format to match the expected structure
      setCart(result.cart ? [result.cart] : []);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setUpdateLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    try {
      setLoading(true);
      const result = await clearCartAction();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Refresh cart data
      const cartResult = await fetchCartAction();
      setCart(cartResult.cart);
      
      // Ensure empty cart is properly formatted
      if (!cartResult.cart || cartResult.cart.length === 0) {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const calculateTotals = () => {
    if (!cart || !cart[0] || !cart[0].line_items) return { subtotal: 0, total: 0, currencySymbol: 'лв.' };
    
    const currentCart = cart[0];
    const subtotal = currentCart.line_items.reduce(
      (sum, item) => sum + (parseFloat(item.subtotal) || 0), 
      0
    );
    
    return {
      subtotal,
      total: parseFloat(currentCart.total) || 0,
      currencySymbol: currentCart.currency_symbol || 'лв.'
    };
  };

  const { subtotal, total, currencySymbol } = calculateTotals();
  const hasItems = cart && cart[0] && cart[0].line_items && cart[0].line_items.length > 0;

  // Empty cart state
  if (!loading && !error && (!hasItems)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Вашата кошница е празна</h3>
          <p className="mt-1 text-sm text-gray-500">Все още нямате добавени продукти в кошницата.</p>
          <div className="mt-6">
            <Link href="/products" className="inline-flex items-center rounded-md bg-[#b3438f] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#9c3b7e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b3438f]">
              <ArrowLeftIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Към продуктите
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Кошница</h1>
        
        {user && (
          <div className="mt-3 text-sm">
            <p>Здравейте, <span className="font-medium">{user.username || user.email}</span></p>
          </div>
        )}

        {loading && (
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <div className="lg:col-span-7">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b3438f]"></div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mt-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        
        {!loading && !error && hasItems && (
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            {/* Cart items */}
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">Продукти във вашата кошница</h2>

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Съдържание на кошницата</h3>
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-sm font-medium text-[#b3438f] hover:text-[#9c3b7e]"
                >
                  Изчисти кошницата
                </button>
              </div>

              <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {cart[0].line_items.map((item) => (
                  <li key={item.id} className="flex py-6 sm:py-8">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.image && (
                        <Image
                          src={item.image.src}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover object-center"
                        />
                      )}
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link href={`/products/${item.product_id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                {item.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            {item.sku && (
                              <p className="text-gray-500">SKU: {item.sku}</p>
                            )}
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {(parseFloat(item.price) || 0).toFixed(2)} {currencySymbol}
                          </p>
                          {item.quantity > 1 && (
                            <p className="mt-1 text-xs text-gray-500">
                              Общо: {(parseFloat(item.subtotal) || 0).toFixed(2)} {currencySymbol}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div className="flex items-center">
                            <button
                              type="button"
                              disabled={updateLoading[item.id]}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="rounded-md p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                            >
                              <MinusIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                              min="1"
                              className="mx-2 block w-12 rounded-md border-0 py-1.5 text-center text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#b3438f] sm:text-sm sm:leading-6"
                            />
                            <button
                              type="button"
                              disabled={updateLoading[item.id]}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="rounded-md p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                            >
                              <PlusIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              disabled={updateLoading[item.id]}
                              onClick={() => handleRemoveItem(item.id)}
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                            >
                              {updateLoading[item.id] ? (
                                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-gray-500 rounded-full" />
                              ) : (
                                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                Обобщение на поръчката
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Междинна сума</dt>
                  <dd className="text-sm font-medium text-gray-900">{subtotal.toFixed(2)} {currencySymbol}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Общо</dt>
                  <dd className="text-base font-medium text-gray-900">{total.toFixed(2)} {currencySymbol}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full rounded-md border border-transparent bg-[#b3438f] px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-[#9c3b7e] focus:outline-none focus:ring-2 focus:ring-[#b3438f] focus:ring-offset-2 focus:ring-offset-gray-50 flex items-center justify-center"
                >
                  <CheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Завърши поръчката
                </Link>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  или{' '}
                  <Link href="/products" className="font-medium text-[#b3438f] hover:text-[#9c3b7e]">
                    Продължи пазаруването
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}