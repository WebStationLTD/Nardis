import { getCategories } from "@/services/productService";

export async function GET() {
  try {
    const categories = await getCategories({ perPage: 100 });
    return Response.json(categories);
  } catch (error) {
    return Response.json({ error: "Грешка при зареждане на категориите" }, { status: 500 });
  }
}
