import React, { useState } from "react";
import { Product } from "../App";
import axios from "axios";

interface Props {
  readonly cart: Product[];
  readonly cartId: number;
  readonly resetCart: () => void;
}

export default function Payment({ cart, cartId, resetCart }: Props) {
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  const [cardNumber, setCardNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Formatuje numer karty na "1234 5678 9012 3456"
  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  const handlePayment = () => {
    const cleanedNumber = cardNumber.replace(/\s/g, "");

    if (!cleanedNumber) {
      alert("Proszę podać numer karty.");
      return;
    }

    if (!/^\d{16}$/.test(cleanedNumber)) {
      alert("Numer karty musi składać się z 16 cyfr.");
      return;
    }

    setIsProcessing(true);

    const payload = {
      cartId,
      cardNumber: cleanedNumber,
    };

    axios
      .post("https://zad-10-backend-hgedawhebmh2bvbr.polandcentral-01.azurewebsites.net/payment", payload)
      .then(() => {
        alert("Płatność zakończona sukcesem! 🎉");
        resetCart();
        setCardNumber("");
      })
      .catch((err) => {
        console.error("Błąd płatności:", err);
        alert("Błąd płatności.");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-md mx-auto text-left">
      <h2 className="text-xl font-semibold mb-4 text-center">💳 Płatność</h2>

      <p className="mb-4 text-center">
        Do zapłaty: <strong>{total.toFixed(2)} zł</strong>
      </p>

      <label htmlFor="cardNumber" className="block mb-2 font-medium">Numer karty:</label>
      <input
        data-testid="card-input"
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
        className="w-full border px-3 py-2 rounded mb-4"
        placeholder="1234 5678 9012 3456"
      />

      <button
        data-testid="pay-button"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        onClick={handlePayment}
        disabled={isProcessing}
      >
        Zapłać
      </button>
    </div>
  );
}
