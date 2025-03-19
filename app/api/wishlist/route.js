import WooCommerce from "@/lib/woocomerce";

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

    const response = await WooCommerce.get("products", {
      include: productIds.join(","),
    });

    if (!response || !response.data) {
      console.error("Invalid WooCommerce response:", response);
      return Response.json(
        { message: "Invalid response from WooCommerce" },
        { status: 500 }
      );
    }

    return Response.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
