export interface Product {
    id: number;
    name: string;
    price: number;
  }
  
  export interface PaymentPayload {
    cartId: number;
    method: string;
  }
  