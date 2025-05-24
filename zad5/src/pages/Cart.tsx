
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '../hooks/useCart';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <ShoppingCart size={64} className="mx-auto text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-600">Twój koszyk jest pusty</h2>
            <p className="text-gray-500">Dodaj produkty do koszyka, aby kontynuować zakupy</p>
            <Link to="/">
              <Button className="mt-4">
                Przejdź do produktów
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Koszyk ({getTotalItems()} produktów)</h1>
      
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    {item.price.toFixed(2)} zł
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </Button>
                  
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Podsumowanie zamówienia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Łączna suma:</span>
            <span className="text-green-600">{getTotalPrice().toFixed(2)} zł</span>
          </div>
          
          <div className="flex space-x-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Kontynuuj zakupy
              </Button>
            </Link>
            
            <Link to="/payment" className="flex-1">
              <Button className="w-full">
                Przejdź do płatności
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
