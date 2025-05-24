
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

const API_URL = 'http://localhost:8080/api';

// Konfiguracja axios z CORS headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  timeout: 5000, // 5 sekund timeout
});

// Dane demonstracyjne
const demoProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    price: 2999.99,
    description: 'Wydajny laptop do pracy i rozrywki',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Smartphone',
    price: 1299.99,
    description: 'Nowoczesny smartfon z doskonałym aparatem',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Słuchawki',
    price: 299.99,
    description: 'Bezprzewodowe słuchawki z redukcją szumów',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    name: 'Tablet',
    price: 899.99,
    description: 'Lekki tablet do codziennego użytku',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    name: 'Smartwatch',
    price: 599.99,
    description: 'Inteligentny zegarek z monitorowaniem zdrowia',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop'
  },
  {
    id: 6,
    name: 'Kamera',
    price: 1899.99,
    description: 'Profesjonalna kamera cyfrowa',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop'
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('Próba połączenia z serwerem API...');
        const response = await api.get('/products');
        console.log('Pobrano produkty z serwera:', response.data);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Błąd podczas pobierania produktów:', err);
        
        // Używamy danych demonstracyjnych gdy serwer nie jest dostępny
        console.log('Używam danych demonstracyjnych');
        setProducts(demoProducts);
        setError(null); // Nie pokazujemy błędu użytkownikowi, tylko w konsoli
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
