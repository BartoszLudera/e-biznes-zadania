
import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { usePayment } from '../hooks/usePayment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreditCard, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { processPayment, loading } = usePayment();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Koszyk jest pusty');
      return;
    }

    const paymentData = {
      ...formData,
      amount: getTotalPrice(),
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    };

    try {
      const result = await processPayment(paymentData);
      
      if (result.success) {
        toast.success('Płatność została przetworzona pomyślnie!');
        clearCart();
        navigate('/');
      } else {
        toast.error(result.message || 'Błąd podczas przetwarzania płatności');
      }
    } catch (error) {
      toast.error('Wystąpił nieoczekiwany błąd');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <ShoppingCart size={64} className="mx-auto text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-600">Brak produktów do zapłaty</h2>
            <p className="text-gray-500">Dodaj produkty do koszyka przed przejściem do płatności</p>
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
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <CreditCard className="mr-3" />
        Płatność
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formularz płatności */}
        <Card>
          <CardHeader>
            <CardTitle>Dane płatności</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Imię i nazwisko</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  placeholder="Jan Kowalski"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="jan@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="ul. Przykładowa 123, 00-000 Warszawa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numer karty</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Data ważności</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={loading}
              >
                {loading ? 'Przetwarzanie...' : `Zapłać ${getTotalPrice().toFixed(2)} zł`}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Podsumowanie zamówienia */}
        <Card>
          <CardHeader>
            <CardTitle>Podsumowanie zamówienia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × {item.price.toFixed(2)} zł
                    </p>
                  </div>
                  <p className="font-bold">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </p>
                </div>
              ))}
              
              <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
                <span>Łączna suma:</span>
                <span className="text-green-600">{getTotalPrice().toFixed(2)} zł</span>
              </div>
            </div>
            
            <Link to="/cart">
              <Button variant="outline" className="w-full mt-4">
                Wróć do koszyka
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;
