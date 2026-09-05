import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { productAPI } from "../api/productsApi";
import { DeleteModal } from "../components/deleteModal";

export const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const IMAGE_BASE_URL =
        import.meta.env.VITE_APP_IMAGE_BASE_URL ||
        "http://localhost:3000";

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return null;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${IMAGE_BASE_URL}${imageUrl}`;
    };

    const fetchProduct = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await productAPI.getProduct(id);

            setProduct(response.data);

            if (response.data.images?.length > 0) {
                setSelectedImage(
                    getImageUrl(response.data.images[0].imageUrl)
                );
            } else {
                setSelectedImage(null);
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
            <div className="min-h-screen bg-gray-100 px-3 py-5 sm:p-6">
                <div className="mx-auto max-w-6xl">
                    <div className="flex min-h-[60vh] items-center justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 sm:h-10 sm:w-10" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-100 px-3 py-5 sm:p-6">
                <div className="mx-auto max-w-6xl">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 sm:mb-6"
                    >
                        <span aria-hidden="true">←</span>
                        Back to Products
                    </button>

                    <div className="rounded-xl bg-white px-4 py-12 text-center shadow-sm sm:rounded-2xl sm:p-12">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                            <svg
                                className="h-7 w-7 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 13h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        <h1 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
                            Product not found
                        </h1>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                            The product you are looking for does not exist or
                            could not be loaded.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
        <div className="min-h-screen bg-gray-100 px-3 py-5 sm:p-6">
            <div className="mx-auto max-w-6xl">

                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-600 transition hover:bg-white hover:text-blue-600 sm:mb-6"
                >
                    <span
                        aria-hidden="true"
                        className="text-base"
                    >
                        ←
                    </span>

                    Back to Products
                </button>

                {/* Product container */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm sm:rounded-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* ================================================= */}
                        {/* Images */}
                        {/* ================================================= */}

                        <div className="bg-gray-50 p-3 sm:p-6">

                            {/* Main image */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 sm:aspect-[4/3] lg:aspect-square">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center px-4 text-gray-400">
                                        <div className="text-center">
                                            <svg
                                                className="mx-auto h-14 w-14 sm:h-20 sm:w-20"
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

                                            <p className="mt-2 text-xs sm:mt-3 sm:text-sm">
                                                No image available
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Image thumbnails */}
                            {images.length > 0 && (
                                <div className="mt-3 -mx-0.5 overflow-x-auto pb-1 sm:mt-4">
                                    <div className="flex gap-2 px-0.5 sm:grid sm:grid-cols-5 sm:gap-3">
                                        {images.map((image, index) => {
                                            const imageUrl = getImageUrl(
                                                image.imageUrl
                                            );

                                            const isSelected =
                                                selectedImage === imageUrl;

                                            return (
                                                <button
                                                    key={image.id || index}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedImage(
                                                            imageUrl
                                                        )
                                                    }
                                                    aria-label={`View ${
                                                        product.name
                                                    } image ${index + 1}`}
                                                    aria-pressed={isSelected}
                                                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:h-20 sm:w-auto ${
                                                        isSelected
                                                            ? "border-blue-600"
                                                            : "border-transparent hover:border-gray-300"
                                                    }`}
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={`${product.name} ${
                                                            index + 1
                                                        }`}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />

                                                    {isSelected && (
                                                        <span className="absolute inset-0 bg-blue-600/10" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ================================================= */}
                        {/* Product information */}
                        {/* ================================================= */}

                        <div className="p-4 sm:p-8 lg:p-10">

                            {/* Category */}
                            {product.category && (
                                <span className="inline-flex max-w-full rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 sm:px-3 sm:text-sm">
                                    <span className="truncate">
                                        {product.category}
                                    </span>
                                </span>
                            )}

                            {/* Name */}
                            <h1 className="mt-3 break-words text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:mt-4 sm:text-4xl">
                                {product.name}
                            </h1>

                            {/* Type */}
                            {product.type && (
                                <p className="mt-1.5 text-sm text-gray-500 sm:mt-2 sm:text-lg">
                                    {product.type}
                                </p>
                            )}

                            {/* Price */}
                            <div className="mt-5 sm:mt-6">
                                <span className="text-2xl font-bold text-blue-600 sm:text-3xl">
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
                            <div className="mt-6 border-t border-gray-100 pt-5 sm:mt-8 sm:pt-6">
                                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                                    Description
                                </h2>

                                <p className="mt-2.5 whitespace-pre-line text-sm leading-6 text-gray-600 sm:mt-3 sm:text-base sm:leading-7">
                                    {product.description ||
                                        "No description available."}
                                </p>
                            </div>

                            {/* Product details */}
                            <div className="mt-6 border-t border-gray-100 pt-5 sm:mt-8 sm:pt-6">
                                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                                    Product Details
                                </h2>

                                <dl className="mt-3 divide-y divide-gray-100 sm:mt-4">
                                    {product.material && (
                                        <div className="grid grid-cols-2 gap-4 py-3">
                                            <dt className="text-sm text-gray-500">
                                                Material
                                            </dt>

                                            <dd className="break-words text-right text-sm font-medium text-gray-900">
                                                {product.material}
                                            </dd>
                                        </div>
                                    )}

                                    {product.type && (
                                        <div className="grid grid-cols-2 gap-4 py-3">
                                            <dt className="text-sm text-gray-500">
                                                Type
                                            </dt>

                                            <dd className="break-words text-right text-sm font-medium text-gray-900">
                                                {product.type}
                                            </dd>
                                        </div>
                                    )}

                                    {product.category && (
                                        <div className="grid grid-cols-2 gap-4 py-3">
                                            <dt className="text-sm text-gray-500">
                                                Category
                                            </dt>

                                            <dd className="break-words text-right text-sm font-medium text-gray-900">
                                                {product.category}
                                            </dd>
                                        </div>
                                    )}

                                    {product.stock !== undefined && (
                                        <div className="grid grid-cols-2 gap-4 py-3">
                                            <dt className="text-sm text-gray-500">
                                                Stock
                                            </dt>

                                            <dd className="text-right text-sm font-medium text-gray-900">
                                                {product.stock}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 grid grid-cols-1 gap-2.5 border-t border-gray-100 pt-5 sm:mt-8 sm:flex sm:flex-row sm:gap-3 sm:pt-6">
                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    className="flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex-1"
                                >
                                    Update Product
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex min-h-11 w-full items-center justify-center rounded-lg border border-red-600 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:flex-1"
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