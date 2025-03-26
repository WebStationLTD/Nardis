import { getOrderById } from "@/services/orderService";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrderDetails({ params }) {
  // Get user session server-side
  const session = await getServerSession(options);

  // If no session, redirect to login
  if (!session) {
    redirect("/login?callbackUrl=/my-account/orders/" + params.id);
  }

  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      console.log("Order not found");
      return (
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-6">Поръчката не е намерена</h1>
          <p className="mb-6">
            Съжаляваме, но не можем да намерим поръчка с номер {params.id}.
          </p>
          <Link
            href="/my-account"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Обратно към моя профил
          </Link>
        </div>
      );
    }

    console.log("Order retrieved successfully:", order.id);

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <Link
            href="/my-account"
            className="text-blue-600 hover:text-blue-800 mr-3"
          >
            &larr; Обратно към моя профил
          </Link>
          <h1 className="text-3xl font-bold">Поръчка #{order.number}</h1>
        </div>

        {/* Order Status */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between flex-wrap">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Статус на поръчката
              </h2>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
                <span
                  className={`w-3 h-3 rounded-full mr-2 ${getStatusDotColor(
                    order.status
                  )}`}
                ></span>
                <span>{getStatusText(order.status)}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Дата на поръчка</p>
              <p className="font-medium">
                {new Date(order.date_created).toLocaleDateString("bg-BG")}
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Shipping Information */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Данни за доставка
            </h2>
            {order.shipping && (
              <address className="not-italic">
                <p>
                  {order.shipping.first_name} {order.shipping.last_name}
                </p>
                {order.shipping.company && <p>{order.shipping.company}</p>}
                <p>{order.shipping.address_1}</p>
                {order.shipping.address_2 && <p>{order.shipping.address_2}</p>}
                <p>
                  {order.shipping.postcode}, {order.shipping.city}
                </p>
                <p>
                  {order.shipping.state}, {order.shipping.country}
                </p>
              </address>
            )}
          </div>

          {/* Billing Information */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Данни за фактуриране
            </h2>
            {order.billing && (
              <div>
                <address className="not-italic mb-4">
                  <p>
                    {order.billing.first_name} {order.billing.last_name}
                  </p>
                  {order.billing.company && <p>{order.billing.company}</p>}
                  <p>{order.billing.address_1}</p>
                  {order.billing.address_2 && <p>{order.billing.address_2}</p>}
                  <p>
                    {order.billing.postcode}, {order.billing.city}
                  </p>
                  <p>
                    {order.billing.state}, {order.billing.country}
                  </p>
                </address>
                <p>
                  <strong>Имейл:</strong> {order.billing.email}
                </p>
                <p>
                  <strong>Телефон:</strong> {order.billing.phone}
                </p>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              Плащане
            </h2>
            <p>
              <strong>Метод на плащане:</strong> {order.payment_method_title}
            </p>
            {order.date_paid && (
              <p>
                <strong>Дата на плащане:</strong>{" "}
                {new Date(order.date_paid).toLocaleDateString("bg-BG")}
              </p>
            )}
            <p className="mt-4 text-xl font-bold">
              Общо: {order.total} {order.currency_symbol || "лв."}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
            Продукти в поръчката
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Продукт
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Количество
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Общо
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.line_items?.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                      {item.meta_data && item.meta_data.length > 0 && (
                        <ul className="text-xs text-gray-500 mt-1">
                          {item.meta_data.map((meta, index) => (
                            <li key={index}>
                              <strong>{meta.key}:</strong> {meta.value}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.price} {order.currency_symbol || "лв."}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.total} {order.currency_symbol || "лв."}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      Няма данни за продукти
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <th
                    colSpan="3"
                    className="px-6 py-3 text-right text-sm font-medium"
                  >
                    Междинна сума:
                  </th>
                  <td className="px-6 py-3 text-sm">
                    {order.subtotal} {order.currency_symbol || "лв."}
                  </td>
                </tr>
                {order.shipping_total &&
                  parseFloat(order.shipping_total) > 0 && (
                    <tr className="bg-gray-50">
                      <th
                        colSpan="3"
                        className="px-6 py-3 text-right text-sm font-medium"
                      >
                        Доставка:
                      </th>
                      <td className="px-6 py-3 text-sm">
                        {order.shipping_total} {order.currency_symbol || "лв."}
                      </td>
                    </tr>
                  )}
                {order.tax_total && parseFloat(order.tax_total) > 0 && (
                  <tr className="bg-gray-50">
                    <th
                      colSpan="3"
                      className="px-6 py-3 text-right text-sm font-medium"
                    >
                      Данъци:
                    </th>
                    <td className="px-6 py-3 text-sm">
                      {order.tax_total} {order.currency_symbol || "лв."}
                    </td>
                  </tr>
                )}
                {order.discount_total &&
                  parseFloat(order.discount_total) > 0 && (
                    <tr className="bg-gray-50">
                      <th
                        colSpan="3"
                        className="px-6 py-3 text-right text-sm font-medium"
                      >
                        Отстъпки:
                      </th>
                      <td className="px-6 py-3 text-sm">
                        -{order.discount_total} {order.currency_symbol || "лв."}
                      </td>
                    </tr>
                  )}
                <tr className="bg-gray-100">
                  <th
                    colSpan="3"
                    className="px-6 py-3 text-right text-base font-bold"
                  >
                    Общо:
                  </th>
                  <td className="px-6 py-3 text-base font-bold">
                    {order.total} {order.currency_symbol || "лв."}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Order Notes */}
        {order.customer_note && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Бележки към поръчката
            </h2>
            <p className="whitespace-pre-line">{order.customer_note}</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in order details page:", error);
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-6">Възникна грешка</h1>
        <p className="mb-6">
          Съжаляваме, но възникна грешка при зареждането на поръчката.
        </p>
        <Link
          href="/my-account"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Обратно към моя профил
        </Link>
      </div>
    );
  }
}

// Helper functions
function getStatusText(status) {
  const statusMap = {
    pending: "Изчаква плащане",
    processing: "В обработка",
    "on-hold": "Задържана",
    completed: "Изпълнена",
    cancelled: "Отказана",
    refunded: "Възстановена",
    failed: "Неуспешна",
  };

  return statusMap[status] || status;
}

function getStatusDotColor(status) {
  const colorMap = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    "on-hold": "bg-orange-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
    refunded: "bg-purple-500",
    failed: "bg-gray-500",
  };

  return colorMap[status] || "bg-gray-500";
}
