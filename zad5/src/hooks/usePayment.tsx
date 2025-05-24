
import { useState } from 'react';
import axios from 'axios';

interface PaymentData {
  customerName: string;
  email: string;
  address: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/payment', paymentData);
      return response.data;
    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = 'Błąd podczas przetwarzania płatności';
      setError(errorMessage);
      
      // Symulacja odpowiedzi dla demo
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  return { processPayment, loading, error };
};
