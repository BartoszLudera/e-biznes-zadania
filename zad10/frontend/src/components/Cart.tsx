import React from "react";
import { Product } from "../App";

interface Props {
  readonly cart: Product[];
  readonly removeFromCart: (product: Product) => void;
}

export default function Cart({ cart, removeFromCart }: Props) {
  const total = cart.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">🛒 Koszyk</h2>
      {cart.length === 0 ? (
        <p data-testid="cart-empty">Koszyk jest pusty.</p>
      ) : (
        <ul className="space-y-4">
          {cart.map((product, index) => (
            <li
              data-testid="cart-item"
              key={index}
              className="flex justify-between items-center border p-3 rounded bg-white shadow-sm"
            >
              <span>
                {product.name} - {product.price.toFixed(2)} zł
              </span>
              <button
                data-testid="cart-remove"
                onClick={() => removeFromCart(product)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      )}
      <p data-testid="cart-total" className="mt-6 font-bold text-lg">Suma: {total.toFixed(2)} zł</p>
    </div>
  );
}
