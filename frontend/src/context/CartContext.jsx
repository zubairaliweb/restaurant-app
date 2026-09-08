import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'restaurant_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        { _id: food._id, name: food.name, price: food.price, image: food.image, quantity },
      ];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((item) => (item._id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => setItems([]);

  const { subtotal, totalCount } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        subtotal: acc.subtotal + item.price * item.quantity,
        totalCount: acc.totalCount + item.quantity,
      }),
      { subtotal: 0, totalCount: 0 }
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
