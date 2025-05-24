import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produkt) => {
    setCart([...cart, produkt]);
  };

  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const value = useMemo(
    () => ({
      products,
      setProducts,
      cart,
      addToCart,
      clearCart,
      removeFromCart,
    }),
    [products, cart]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
