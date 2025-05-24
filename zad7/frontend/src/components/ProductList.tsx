import React, { useEffect, useState } from "react";
import { Product } from "../App";
import axios from "axios";

interface Props {
  readonly addToCart: (product: Product) => void;
}

export default function ProductList({ addToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8080/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Błąd ładowania produktów:", err));
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-6">Produkty</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-lg rounded-xl p-6 w-72 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">{product.price.toFixed(2)} zł</p>
            <button
              data-testid="product-add"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => addToCart(product)}
            >
              Dodaj do koszyka
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
