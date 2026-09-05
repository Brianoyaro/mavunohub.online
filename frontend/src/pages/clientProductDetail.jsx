import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import toast from "react-hot-toast";

import { productAPI } from "../api/productsApi";

export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const addToCart = useCartStore((state) => state.addToCart);

    const IMAGE_BASE_URL = "http://localhost:3000";

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const fetchProduct = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await productAPI.getProduct(id);

            console.log("Fetched product:", response.data);

            setProduct(response.data);
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to load product.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return null;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${IMAGE_BASE_URL}${imageUrl}`;
    };

    const increaseQuantity = () => {
        setQuantity((current) => current + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((current) => Math.max(1, current - 1));
    };

    const handleAddToCart = () => {
        /*
         * Replace this with your cart logic/context/API call.
         *
         * Example:
         *
         * addToCart(product, quantity);
         */

        console.log("Adding to cart:", {
            product,
            quantity,
        });
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <svg
                                className="h-8 w-8 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            Product not found
                        </h1>

                        <p className="mt-2 text-gray-500">
                            The product you are looking for may have been
                            removed or does not exist.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const images = product.images || [];

    const selectedImageUrl =
        images.length > 0
            ? getImageUrl(images[selectedImage]?.imageUrl)
            : null;

    const formattedPrice = Number(product.price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">

                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
                >
                    <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>

                    Back to Products
                </button>

                {/* Product */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* -------------------------------- */}
                        {/* Images */}
                        {/* -------------------------------- */}

                        <div className="p-4 sm:p-6 lg:p-8">

                            {/* Main image */}
                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                                {selectedImageUrl ? (
                                    <img
                                        src={selectedImageUrl}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <svg
                                                className="mx-auto h-20 w-20"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>

                                            <p className="mt-3">
                                                No image available
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Image counter */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium text-white backdrop-blur">
                                        {selectedImage + 1} / {images.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="mt-4 grid grid-cols-5 gap-3">
                                    {images.map((image, index) => (
                                        <button
                                            key={image.id || index}
                                            type="button"
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                                                selectedImage === index
                                                    ? "border-blue-600 ring-2 ring-blue-100"
                                                    : "border-transparent hover:border-gray-300"
                                            }`}
                                        >
                                            <img
                                                src={getImageUrl(
                                                    image.imageUrl
                                                )}
                                                alt={`${product.name} ${
                                                    index + 1
                                                }`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* -------------------------------- */}
                        {/* Product information */}
                        {/* -------------------------------- */}

                        <div className="flex flex-col p-6 sm:p-8 lg:p-12">

                            {/* Category / Type */}
                            <div className="flex flex-wrap items-center gap-2">
                                {product.category && (
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {product.category}
                                    </span>
                                )}

                                {product.type && (
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                        {product.type}
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="mt-5">
                                <span className="text-3xl font-bold text-blue-600">
                                    {formattedPrice}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="my-7 border-t border-gray-200" />

                            {/* Description */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Description
                                </h2>

                                <p className="mt-3 leading-7 text-gray-600">
                                    {product.description ||
                                        "No description available for this product."}
                                </p>
                            </div>

                            {/* Product specifications */}
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Product Details
                                </h2>

                                <div className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200">
                                    {product.category && (
                                        <div className="flex items-center justify-between px-4 py-3">
                                            <span className="text-sm text-gray-500">
                                                Category
                                            </span>

                                            <span className="text-sm font-semibold text-gray-900">
                                                {product.category}
                                            </span>
                                        </div>
                                    )}

                                    {product.type && (
                                        <div className="flex items-center justify-between px-4 py-3">
                                            <span className="text-sm text-gray-500">
                                                Type
                                            </span>

                                            <span className="text-sm font-semibold text-gray-900">
                                                {product.type}
                                            </span>
                                        </div>
                                    )}

                                    {product.material && (
                                        <div className="flex items-center justify-between px-4 py-3">
                                            <span className="text-sm text-gray-500">
                                                Material
                                            </span>

                                            <span className="text-sm font-semibold text-gray-900">
                                                {product.material}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Add to cart */}
                            <div className="mt-auto pt-8">

                                {/* Quantity */}
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Quantity
                                    </label>

                                    <div className="flex w-fit items-center overflow-hidden rounded-lg border border-gray-300">
                                        <button
                                            type="button"
                                            onClick={decreaseQuantity}
                                            disabled={quantity <= 1}
                                            className="flex h-11 w-11 items-center justify-center text-xl text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            −
                                        </button>

                                        <span className="flex h-11 w-12 items-center justify-center border-x border-gray-300 text-sm font-semibold text-gray-900">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={increaseQuantity}
                                            className="flex h-11 w-11 items-center justify-center text-xl text-gray-600 transition hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 2h13m-9 4a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                                        />
                                    </svg>

                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};