import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCartStore } from "../store/cartStore";

export const Cart = () => {
    const navigate = useNavigate();

    const cart = useCartStore((state) => state.cart);
    const increaseQuantity = useCartStore(
        (state) => state.increaseQuantity
    );
    const decreaseQuantity = useCartStore(
        (state) => state.decreaseQuantity
    );
    const removeFromCart = useCartStore(
        (state) => state.removeFromCart
    );
    const clearCart = useCartStore((state) => state.clearCart);

    const IMAGE_BASE_URL = "http://localhost:3000";

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return null;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${IMAGE_BASE_URL}${imageUrl}`;
    };

    /*
     * Calculate the number of individual products/items.
     *
     * Example:
     * Sofa x 2
     * Chair x 3
     *
     * Total items = 5
     */
    const itemCount = useMemo(() => {
        return cart.reduce(
            (total, item) => total + item.quantity,
            0
        );
    }, [cart]);

    /*
     * Calculate cart subtotal.
     */
    const subtotal = useMemo(() => {
        return cart.reduce(
            (total, item) =>
                total + Number(item.price) * item.quantity,
            0
        );
    }, [cart]);

    /*
     * You can replace this with your actual shipping calculation
     * when you introduce checkout.
     */
    const shipping = subtotal > 0 ? 0 : 0;

    const total = subtotal + shipping;

    const formatPrice = (price) => {
        return Number(price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const handleRemove = (product) => {
        removeFromCart(product.id);

        toast.success(`${product.name} removed from cart.`);
    };

    const handleClearCart = () => {
        clearCart();

        toast.success("Cart cleared.");
    };

    // const handleCheckout = () => {
    //     /*
    //      * Replace this with your checkout route/API integration.
    //      */
    //     toast("Checkout functionality coming soon.", {
    //         icon: "🛒",
    //     });
    // };
    const handleCheckout = () => {
        const phoneNumber = "254722474626";

        const orderDetails = cart
            .map((item) => {
                const itemTotal =
                    Number(item.price) * item.quantity;

                return [
                    `Product: ${item.name}`,
                    `Type: ${item.type || "N/A"}`,
                    item.material
                        ? `Material: ${item.material}`
                        : null,
                    `Quantity: ${item.quantity}`,
                    `Unit Price: ${formatPrice(item.price)}`,
                    `Item Total: ${formatPrice(itemTotal)}`,
                ]
                    .filter(Boolean)
                    .join("\n");
            })
            .join("\n\n");

        const message = [
            "Hello, I would like to place an order.",
            "",
            "ORDER DETAILS",
            "--------------------",
            orderDetails,
            "",
            "ORDER SUMMARY",
            "--------------------",
            `Subtotal: ${formatPrice(subtotal)}`,
            `Shipping: ${shipping === 0 ? "Free" : formatPrice(shipping)}`,
            `Total: ${formatPrice(total)}`,
            "",
            "Please let me know the next steps.",
        ].join("\n");

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;

        window.open(whatsappUrl, "_blank");
    };

    /*
     * Empty cart
     */
    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
                <div className="mx-auto max-w-5xl">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Shopping Cart
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Review the products you've selected.
                        </p>
                    </div>

                    {/* Empty state */}
                    <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                            <svg
                                className="h-10 w-10 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 2h13m-9 4a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-gray-900">
                            Your cart is empty
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-gray-500">
                            Looks like you haven't added any furniture to
                            your cart yet.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:py-10">
            <div className="mx-auto max-w-7xl">

                {/* ------------------------------------------ */}
                {/* Header */}
                {/* ------------------------------------------ */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Shopping Cart
                        </h1>

                        <p className="mt-1 text-gray-500">
                            {itemCount}{" "}
                            {itemCount === 1 ? "item" : "items"} in your
                            cart
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                        ← Continue Shopping
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* ------------------------------------------ */}
                    {/* Cart items */}
                    {/* ------------------------------------------ */}

                    <div className="lg:col-span-2">

                        {/* Cart header */}
                        <div className="mb-3 hidden rounded-xl bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 shadow-sm sm:grid sm:grid-cols-[1fr_120px_100px] sm:gap-4">
                            <span>Product</span>
                            <span className="text-center">
                                Quantity
                            </span>
                            <span className="text-right">
                                Total
                            </span>
                        </div>

                        <div className="space-y-4">
                            {cart.map((item) => {
                                const imageUrl =
                                    item.images?.[0]?.imageUrl;

                                const itemTotal =
                                    Number(item.price) *
                                    item.quantity;

                                return (
                                    <article
                                        key={item.id}
                                        className="rounded-xl bg-white p-4 shadow-sm sm:p-5"
                                    >
                                        <div className="flex flex-col gap-5 sm:grid sm:grid-cols-[1fr_120px_100px] sm:items-center sm:gap-4">

                                            {/* Product */}
                                            <div className="flex min-w-0 gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/products/${item.id}`
                                                        )
                                                    }
                                                    className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100"
                                                >
                                                    {imageUrl ? (
                                                        <img
                                                            src={getImageUrl(
                                                                imageUrl
                                                            )}
                                                            alt={
                                                                item.name
                                                            }
                                                            className="h-full w-full object-cover transition hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-gray-400">
                                                            <svg
                                                                className="h-8 w-8"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </button>

                                                <div className="min-w-0 flex-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/products/${item.id}`
                                                            )
                                                        }
                                                        className="text-left"
                                                    >
                                                        <h2 className="truncate text-base font-bold text-gray-900 hover:text-blue-600">
                                                            {item.name}
                                                        </h2>
                                                    </button>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.type}
                                                    </p>

                                                    {item.material && (
                                                        <span className="mt-2 inline-block rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                                            {
                                                                item.material
                                                            }
                                                        </span>
                                                    )}

                                                    <p className="mt-2 text-sm font-semibold text-blue-600">
                                                        {formatPrice(
                                                            item.price
                                                        )}
                                                    </p>

                                                    {/* Remove */}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemove(
                                                                item
                                                            )
                                                        }
                                                        className="mt-2 text-xs font-medium text-red-500 transition hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="flex items-center justify-between sm:justify-center">
                                                <span className="text-sm font-medium text-gray-500 sm:hidden">
                                                    Quantity
                                                </span>

                                                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="flex h-9 w-10 items-center justify-center border-x border-gray-300 text-sm font-semibold text-gray-900">
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item.id
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center text-lg text-gray-600 transition hover:bg-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Item total */}
                                            <div className="flex items-center justify-between sm:block sm:text-right">
                                                <span className="text-sm font-medium text-gray-500 sm:hidden">
                                                    Total
                                                </span>

                                                <span className="text-base font-bold text-gray-900">
                                                    {formatPrice(
                                                        itemTotal
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Clear cart */}
                        <div className="mt-5 flex justify-end">
                            <button
                                type="button"
                                onClick={handleClearCart}
                                className="text-sm font-semibold text-red-500 transition hover:text-red-700"
                            >
                                Clear cart
                            </button>
                        </div>
                    </div>

                    {/* ------------------------------------------ */}
                    {/* Order summary */}
                    {/* ------------------------------------------ */}

                    <aside className="lg:col-span-1">
                        <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold text-gray-900">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-semibold text-gray-900">
                                            Total
                                        </span>

                                        <span className="text-2xl font-bold text-blue-600">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCheckout}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                {/* WhatsApp icon */}
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.887 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.89a11.85 11.85 0 001.594 5.945L.057 24l6.304-1.654a11.882 11.882 0 005.684 1.447h.005c6.555 0 11.89-5.335 11.893-11.89a11.821 11.821 0 00-3.479-8.415" />
                                </svg>

                                Order via WhatsApp
                            </button>
                            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                                Your order details will be sent to us on WhatsApp.
                                We'll confirm availability, shipping, and payment details with you.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};
