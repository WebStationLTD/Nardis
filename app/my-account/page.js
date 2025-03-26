import { getOrders } from "@/services/orderService";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import RequireAuth from "@/components/RequireAuth";

// Server component wrapped with client-side RequireAuth
export default async function MyAccountPage() {
  // Get server session
  const session = await getServerSession(options);
  
  // Server-side redirect if not authenticated
  if (!session) {
    redirect("/login");
  }

  // Get user ID - check various possible locations
  const userId = session.user?.id
  
  // Fetch orders for the current user
  const orders = await getOrders(userId);

  // Wrap the content in the client-side RequireAuth component
  // This provides double protection - server and client side
  return (
    <RequireAuth>
      <MyAccountContent session={session} orders={orders} />
    </RequireAuth>
  );
}

// Client component that will receive session and orders data
function MyAccountContent({ session, orders }) {
  const userId = session?.user?.id;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Моят акаунт</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Лична информация</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-1">Име:</p>
            <p className="font-medium">{session.user?.name || "Не е посочено"}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Имейл:</p>
            <p className="font-medium">{session.user?.email || "Не е посочен"}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Потребителски ID:</p>
            <p className="font-medium">{userId || "Не е наличен"}</p>
          </div>
        </div>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">История на поръчките</h2>
        
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Все още нямате поръчки</p>
            <Link 
              href="/shop" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md cursor-pointer"
            >
              Разгледай продукти
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Поръчка №
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Сума
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Детайли
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date_created).toLocaleDateString('bg-BG')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.total} {order.currency_symbol || 'лв.'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        href={`/my-account/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Преглед
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusText(status) {
  const statusMap = {
    'pending': 'Изчаква плащане',
    'processing': 'В обработка',
    'on-hold': 'Задържана',
    'completed': 'Изпълнена',
    'cancelled': 'Отказана',
    'refunded': 'Възстановена',
    'failed': 'Неуспешна'
  };
  
  return statusMap[status] || status;
}

function getStatusColor(status) {
  const colorMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-orange-100 text-orange-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'refunded': 'bg-purple-100 text-purple-800',
    'failed': 'bg-gray-100 text-gray-800'
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}
