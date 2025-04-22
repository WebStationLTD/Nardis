"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCheckoutDetailsAction, completeCheckoutAction } from "./action";
import Swal from "sweetalert2";

const CheckoutPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formValues, setFormValues] = useState({});
  const [checkoutData, setCheckoutData] = useState({
    cart: null,
    totals: null,
    user: null,
  });

  useEffect(() => {
    const loadCheckoutData = async () => {
      setIsLoading(true);
      try {
        const result = await getCheckoutDetailsAction();
        if (result.error) {
          setError(result.error);
          if (result.status === 400) {
            setTimeout(() => {
              router.push("/cart");
            }, 2000);
          }
        } else {
          setCheckoutData(result);
          console.log(checkoutData);
          
          if (result.user) {
            setFormValues({
              firstName: result.user.firstName || "",
              lastName: result.user.lastName || "",
              email: result.user.email || "",
              phone: result.user.phone || "",
              country: "BG",
            });
          }
        }
      } catch (err) {
        setError("Failed to load checkout data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCheckoutData();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    const form = e.target;
    const formData = new FormData(form);

    const newFormValues = {};
    formData.forEach((value, key) => {
      newFormValues[key] = value;
    });
    setFormValues(newFormValues);

    try {
      const result = await completeCheckoutAction(formData);

      if (result.errors) {
        setValidationErrors(result.errors);
        setIsSubmitting(false);
      } else if (result.error) {
        setError(result.error);
        setIsSubmitting(false);
      } else {
        Swal.fire({
          title: 'Поръчката е успешна!',
          text: `Вашата поръчка #${result.order.number} беше приета успешно. Благодарим Ви!`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3B82F6',
          timer: 4000,
        }).then(() => {
          router.push("/");
        });
      }
    } catch (err) {
      setError("Failed to process checkout");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors[fieldName] ? (
      <p className="mt-1 text-sm text-red-600">
        {validationErrors[fieldName][0]}
      </p>
    ) : null;
  };

  const getFieldValue = (fieldName, defaultValue = "") => {
    if (fieldName in formValues) {
      return formValues[fieldName];
    }

    const { user } = checkoutData;
    if (user && fieldName in user) {
      return user[fieldName];
    }

    return defaultValue;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading Checkout...</h2>
            <div className="animate-pulse w-20 h-1 bg-gray-400 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !checkoutData.cart) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <Link href="/cart" className="text-blue-600 hover:underline">
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { cart, totals, user } = checkoutData;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {Object.keys(validationErrors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-red-800 font-medium mb-2">
            Please correct the following errors:
          </h3>
          <ul className="list-disc pl-5 text-red-600">
            {Object.entries(validationErrors).map(([field, errors]) => (
              <li key={field}>{errors[0]}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={getFieldValue("firstName")}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      validationErrors.firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {getFieldError("firstName")}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={getFieldValue("lastName")}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      validationErrors.lastName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {getFieldError("lastName")}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={getFieldValue("email")}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      validationErrors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {getFieldError("email")}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={getFieldValue("phone")}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      validationErrors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {getFieldError("phone")}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={getFieldValue("address")}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      validationErrors.address
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {getFieldError("address")}
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={getFieldValue("city")}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      validationErrors.city
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {getFieldError("city")}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={getFieldValue("state")}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      validationErrors.state
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {getFieldError("state")}
                </div>

                <div>
                  <label
                    htmlFor="postcode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={getFieldValue("postcode")}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      validationErrors.postcode
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {getFieldError("postcode")}
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={getFieldValue("country", "BG")}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      validationErrors.country
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="BG">Bulgaria</option>
                    <option value="RO">Romania</option>
                    <option value="GR">Greece</option>
                    <option value="MK">North Macedonia</option>
                    <option value="RS">Serbia</option>
                  </select>
                  {getFieldError("country")}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Order Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  value={getFieldValue("notes")}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${
                    validationErrors.notes
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Special notes about your order"
                ></textarea>
                {getFieldError("notes")}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="flex items-center">
                    <span className="mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Cash on Delivery
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Pay with cash upon delivery
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="border-b border-gray-200 pb-4 mb-4">
              {cart &&
                cart.line_items &&
                cart.line_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start py-2"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {item.name}{" "}
                        <span className="text-gray-500">× {item.quantity}</span>
                      </p>
                      {item.meta_data && item.meta_data.length > 0 && (
                        <div className="text-sm text-gray-600 mt-1">
                          {item.meta_data.map((meta, index) => (
                            <p key={index}>
                              {meta.key}: {meta.value}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.total} {totals?.currencySymbol}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">
                  {totals?.subtotal.toFixed(2)} {totals?.currencySymbol}
                </p>
              </div>

              {totals?.tax > 0 && (
                <div className="flex justify-between">
                  <p className="text-gray-600">Tax</p>
                  <p className="font-medium">
                    {totals.tax.toFixed(2)} {totals.currencySymbol}
                  </p>
                </div>
              )}

              {totals?.shipping > 0 && (
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">
                    {totals.shipping.toFixed(2)} {totals.currencySymbol}
                  </p>
                </div>
              )}

              {totals?.discount > 0 && (
                <div className="flex justify-between">
                  <p className="text-gray-600">Discount</p>
                  <p className="font-medium text-green-600">
                    -{totals.discount.toFixed(2)} {totals.currencySymbol}
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-gray-200 font-bold">
                <p>Total</p>
                <p>
                  {totals?.total.toFixed(2)} {totals?.currencySymbol}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/cart"
                className="block text-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
              >
                Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
