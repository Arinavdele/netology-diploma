import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      
      const existing = state.items.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      if (existing) {
        existing.count += newItem.count;
      } else {
        state.items.push(newItem);
      }

      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    removeFromCart(state, action: PayloadAction<{ id: number; size: string }>) {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.size === action.payload.size)
      );
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    
    clearCart(state) {
      state.items = [];
      localStorage.removeItem('cart');
    },

    updatePrice(
      state,
      action: PayloadAction<{ id: number; size: string; newPrice: number }>
    ) {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      );
      if (item) {
        item.price = action.payload.newPrice;
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, updatePrice } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;