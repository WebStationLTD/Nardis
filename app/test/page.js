"use client";

import { getCart } from "./action";
import { useEffect, useState } from "react";
export default function Test() {
  const [cart, setCart] = useState(null);
  useEffect(() => {
    getCart().then((data) => {
      setCart(data);
    });
  }, []);
  return (
    <div>
      <h1>Test</h1>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
}