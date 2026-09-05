import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { productAPI } from "../api/productsApi";
import { DeleteModal } from "../components/deleteModal";

export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const IMAGE_BASE_URL =  import.meta.env.VITE_APP_IMAGE_BASE_URL || "http://localhost:3000";

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return null;

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${IMAGE_BASE_URL}${imageUrl}`;
    };

    const fetchProduct = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await productAPI.getProduct(id);

            console.log("Fetched product:", response.data);

            setProduct(response.data);

            // Set the first image as the selected image
            if (response.data.images?.length > 0) {
                setSelectedImage(
                    getImageUrl(response.data.images[0].imageUrl)
                );
            }
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

    const handleUpdate = () => {
        navigate(`/update/${id}`);
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="mx-auto max-w-6xl">
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="mx-auto max-w-6xl">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-6 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        ← Back to Products
                    </button>

                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Product not found
                        </h1>

                        <p className="mt-2 text-gray-500">
                            The product you are looking for does not exist or
                            could not be loaded.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                        >
                            Back to Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const images = product.images || [];

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-6xl">
                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
                >
                    <span>←</span>
                    Back to Products
                </button>

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Images */}
                        <div className="bg-gray-50 p-6">
                            {/* Main image */}
                            <div className="relative flex h-[450px] items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <svg
                                            className="mx-auto h-20 w-20"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>

                                        <p className="mt-3">
                                            No image available
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Image thumbnails */}
                            {images.length > 0 && (
                                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                                    {images.map((image, index) => {
                                        const imageUrl = getImageUrl(
                                            image.imageUrl
                                        );

                                        return (
                                            <button
                                                key={image.id || index}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedImage(imageUrl)
                                                }
                                                className={`relative h-20 overflow-hidden rounded-lg border-2 transition ${
                                                    selectedImage === imageUrl
                                                        ? "border-blue-600"
                                                        : "border-transparent hover:border-gray-300"
                                                }`}
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt={`${product.name} ${
                                                        index + 1
                                                    }`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Product information */}
                        <div className="p-6 sm:p-8 lg:p-10">
                            {/* Category */}
                            {product.category && (
                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                                    {product.category}
                                </span>
                            )}

                            {/* Name */}
                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                {product.name}
                            </h1>

                            {/* Type */}
                            {product.type && (
                                <p className="mt-2 text-lg text-gray-500">
                                    {product.type}
                                </p>
                            )}

                            {/* Price */}
                            <div className="mt-6">
                                <span className="text-3xl font-bold text-blue-600">
                                    {Number(product.price).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Description
                                </h2>

                                <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
                                    {product.description ||
                                        "No description available."}
                                </p>
                            </div>

                            {/* Product details */}
                            <div className="mt-8 border-t border-gray-100 pt-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Product Details
                                </h2>

                                <dl className="mt-4 divide-y divide-gray-100">
                                    {product.material && (
                                        <div className="flex justify-between py-3">
                                            <dt className="text-gray-500">
                                                Material
                                            </dt>

                                            <dd className="font-medium text-gray-900">
                                                {product.material}
                                            </dd>
                                        </div>
                                    )}

                                    {product.type && (
                                        <div className="flex justify-between py-3">
                                            <dt className="text-gray-500">
                                                Type
                                            </dt>

                                            <dd className="font-medium text-gray-900">
                                                {product.type}
                                            </dd>
                                        </div>
                                    )}

                                    {product.category && (
                                        <div className="flex justify-between py-3">
                                            <dt className="text-gray-500">
                                                Category
                                            </dt>

                                            <dd className="font-medium text-gray-900">
                                                {product.category}
                                            </dd>
                                        </div>
                                    )}

                                    {product.stock !== undefined && (
                                        <div className="flex justify-between py-3">
                                            <dt className="text-gray-500">
                                                Stock
                                            </dt>

                                            <dd className="font-medium text-gray-900">
                                                {product.stock}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Update Product
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex-1 rounded-lg border border-red-600 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Delete Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete modal */}
            {deleteModalOpen && (
                <DeleteModal
                    id={product.id}
                    onClose={() => setDeleteModalOpen(false)}
                    onDeleted={() => {
                        setDeleteModalOpen(false);
                        navigate("/");
                    }}
                />
            )}
        </div>
    );
};