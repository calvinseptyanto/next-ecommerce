"use client";
import { useCartStore } from "@/store";
import { AddCartType } from "@/types/AddCartType";
import { useState } from "react";

export default function AddCart({
  name,
  id,
  image,
  unit_amount,
  quantity,
}: AddCartType) {
  const cartStore = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    cartStore.addProduct({ id, image, unit_amount, quantity, name });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 500);
  };
  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={added}
        className="my-4 btn btn-primary w-full"
      >
        {added ? <span>Adding to cart...🤩</span> : <span>Add to cart</span>}
      </button>
    </>
  );
}
