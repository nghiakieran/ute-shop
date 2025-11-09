/**
 * Cart Slice
 * Manages shopping cart state
 */

import { createAppSlice } from '../createAppSlice';

interface CartSliceState extends Cart {
  loading: boolean;
  error: string | null;
}

const initialState: CartSliceState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  loading: false,
  error: null,
};

// Helper to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
};

export const cartSlice = createAppSlice({
  name: 'cart',
  initialState,
  reducers: (create) => ({
    // ==================== ADD TO CART ====================
    addToCart: create.reducer(
      (
        state,
        action: {
          payload: {
            product: Product;
            quantity: number;
            size: ProductSize;
            color: ProductColor;
          };
        }
      ) => {
        const { product, quantity, size, color } = action.payload;

        // Check if item already exists
        const existingItem = state.items.find(
          item =>
            item.product.id === product.id &&
            item.size.id === size.id &&
            item.color.id === color.id
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.items.push({
            id: `${product.id}-${size.id}-${color.id}-${Date.now()}`,
            product,
            quantity,
            size,
            color,
            addedAt: new Date().toISOString(),
          });
        }

        // Recalculate totals
        const totals = calculateTotals(state.items);
        Object.assign(state, totals);
      }
    ),

    // ==================== REMOVE FROM CART ====================
    removeFromCart: create.reducer((state, action: { payload: string }) => {
      state.items = state.items.filter(item => item.id !== action.payload);

      // Recalculate totals
      const totals = calculateTotals(state.items);
      Object.assign(state, totals);
    }),

    // ==================== UPDATE QUANTITY ====================
    updateQuantity: create.reducer(
      (state, action: { payload: { id: string; quantity: number } }) => {
        const { id, quantity } = action.payload;
        const item = state.items.find(item => item.id === id);

        if (item && quantity > 0) {
          item.quantity = quantity;

          // Recalculate totals
          const totals = calculateTotals(state.items);
          Object.assign(state, totals);
        }
      }
    ),

    // ==================== CLEAR CART ====================
    clearCart: create.reducer((state) => {
      state.items = [];
      state.subtotal = 0;
      state.shipping = 0;
      state.tax = 0;
      state.total = 0;
    }),
  }),
});

// Export actions
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Export selectors
export const selectCartItems = (state: { cart: CartSliceState }) => state.cart.items;
export const selectCartSubtotal = (state: { cart: CartSliceState }) => state.cart.subtotal;
export const selectCartShipping = (state: { cart: CartSliceState }) => state.cart.shipping;
export const selectCartTax = (state: { cart: CartSliceState }) => state.cart.tax;
export const selectCartTotal = (state: { cart: CartSliceState }) => state.cart.total;
export const selectCartItemCount = (state: { cart: CartSliceState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;

