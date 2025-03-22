import { getProductsByIds } from "@/services/productService";

export async function POST(req) {
  try {
    const body = await req.json();

    const productIds = body.productIds || [];

    if (!productIds.length) {
      console.error("No product IDs provided");
      return Response.json(
        { message: "No product IDs provided" },
        { status: 400 }
      );
    }

    const products = await getProductsByIds(productIds);

    if (!products) {
      console.error("Invalid response while fetching products");
      return Response.json(
        { message: "Invalid response from WooCommerce" },
        { status: 500 }
      );
    }

    return Response.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
