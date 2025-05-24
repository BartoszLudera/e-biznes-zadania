import React, { useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import axios from "axios";

export interface Product {
  id: number;
  name: string;
  price: number;
}

export default function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [view, setView] = useState<"products" | "cart" | "payment">("products");
  const [cartId, setCartId] = useState<number | null>(null);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productToRemove: Product) => {
    setCart((prev) =>
      prev.filter((p) => p.id !== productToRemove.id || p !== productToRemove)
    );
  };

  const resetCart = () => {
    setCart([]);
    setView("products");
  };

  const handleGoToPayment = () => {
    axios.post("http://localhost:8080/cart", {
      products: cart.map((p) => ({ id: p.id })),
    })
      .then((res) => {
        setCartId(res.data.ID);
        setView("payment");
      })
      .catch(() => alert("Błąd tworzenia koszyka"));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-5xl w-full px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">🛍️ Sklep Internetowy</h1>

        {view === "products" && (
          <>
            <ProductList addToCart={addToCart} />
            <button
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => setView("cart")}
            >
              Przejdź do koszyka ({cart.length})
            </button>
          </>
        )}

        {view === "cart" && (
          <>
            <Cart cart={cart} removeFromCart={removeFromCart} />
            <div className="mt-6 space-x-3">
              {cart.length > 0 && (
                <button
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                  onClick={handleGoToPayment}
                >
                  Przejdź do płatności
                </button>
              )}
              <button
                className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                onClick={() => setView("products")}
              >
                Powrót do produktów
              </button>
            </div>
          </>
        )}

        {view === "payment" && cartId !== null && (
          <>
            <Payment cart={cart} cartId={cartId} resetCart={resetCart} />
            <button
              className="mt-6 bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
              onClick={() => setView("cart")}
            >
              Powrót do koszyka
            </button>
          </>
        )}
      </div>
    </div>
  );
}
