import WooCommerce from "../../../lib/woocomerce";

export async function GET() {
  try {
    const response = await WooCommerce.get("products/categories", { per_page: 100 });
    return Response.json(response.data);
  } catch (error) {
    return Response.json({ error: "Грешка при зареждане на категориите" }, { status: 500 });
  }
}
