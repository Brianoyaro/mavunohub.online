import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],

            /*
             * Add a product to the cart.
             *
             * If the product already exists, increase its quantity.
             */
            addToCart: (product, quantity = 1) => {
                set((state) => {
                    const existingItem = state.cart.find(
                        (item) => item.id === product.id
                    );

                    if (existingItem) {
                        return {
                            cart: state.cart.map((item) =>
                                item.id === product.id
                                    ? {
                                          ...item,
                                          quantity:
                                              item.quantity + quantity,
                                      }
                                    : item
                            ),
                        };
                    }

                    return {
                        cart: [
                            ...state.cart,
                            {
                                ...product,
                                quantity,
                            },
                        ],
                    };
                });
            },

            /*
             * Remove an entire product from the cart.
             */
            removeFromCart: (productId) => {
                set((state) => ({
                    cart: state.cart.filter(
                        (item) => item.id !== productId
                    ),
                }));
            },

            /*
             * Set a product's quantity.
             */
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }

                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.id === productId
                            ? {
                                  ...item,
                                  quantity,
                              }
                            : item
                    ),
                }));
            },

            /*
             * Increase product quantity by one.
             */
            increaseQuantity: (productId) => {
                set((state) => ({
                    cart: state.cart.map((item) =>
                        item.id === productId
                            ? {
                                  ...item,
                                  quantity: item.quantity + 1,
                              }
                            : item
                    ),
                }));
            },

            /*
             * Decrease product quantity by one.
             */
            decreaseQuantity: (productId) => {
                set((state) => {
                    const item = state.cart.find(
                        (item) => item.id === productId
                    );

                    if (!item) {
                        return state;
                    }

                    if (item.quantity <= 1) {
                        return {
                            cart: state.cart.filter(
                                (item) => item.id !== productId
                            ),
                        };
                    }

                    return {
                        cart: state.cart.map((item) =>
                            item.id === productId
                                ? {
                                      ...item,
                                      quantity: item.quantity - 1,
                                  }
                                : item
                        ),
                    };
                });
            },

            /*
             * Remove everything from the cart.
             */
            clearCart: () => {
                set({ cart: [] });
            },

            /*
             * Total number of items.
             *
             * Example:
             * 2 sofas + 3 chairs = 5 items
             */
            getItemCount: () => {
                return get().cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                );
            },

            /*
             * Total cart price.
             */
            getCartTotal: () => {
                return get().cart.reduce(
                    (total, item) =>
                        total + Number(item.price) * item.quantity,
                    0
                );
            },

            /*
             * Find a specific product in the cart.
             */
            getCartItem: (productId) => {
                return get().cart.find(
                    (item) => item.id === productId
                );
            },
        }),
        {
            name: "furniture-cart",
        }
    )
);
