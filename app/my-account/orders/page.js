import { redirect } from "next/navigation";

export default function OrdersPage() {
  // Redirect users who try to access /my-account/orders directly
  redirect("/my-account");
}
