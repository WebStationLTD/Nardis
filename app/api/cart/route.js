import { getCart } from "@/services/cartService";
import { NextResponse } from "next/server";
import { getUserInfo } from "@/lib/session";

export async function GET(request) {
  try {
    // Get user info from session
    const userInfo = await getUserInfo();
    
    if (!userInfo || !userInfo.id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    
    const cartData = await getCart(userInfo.id);
    return NextResponse.json(cartData);
  } catch (error) {
    console.error("Error in cart API:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
} 