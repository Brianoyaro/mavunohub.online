import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { productAPI } from "../api/productsApi";
import { DeleteModal } from "../components/deleteModal";

const productCategoryOptions = [
    "Home",
    "Office",
    "Outdoor",
    "Bedroom",
    "Living Room",
];

const productTypeOptions = [
    "Bed",
    "Sofas",
    "Dining Set",
    "Dining Table",
    "Dining Chair",
    "Home Other",
    "Office Chair",
    "Boardroom Table",
    "Workstation",
    "Office Sofa",
    "Office Desk",
    "Office Other",
];

const productMaterialOptions = [
    "Wood",
    "Metal",
    "Plastic",
    "Glass",
    "Fabric",
];

export const Home = () => {
    const navigate = useNavigate();

    const IMAGE_BASE_URL =  import.meta.env.VITE_APP_IMAGE_BASE_URL || "http://localhost:3000";

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteProductId, setDeleteProductId] = useState(null);

    // Filter state
    const [filters, setFilters] = useState({
        category: "",
        type: "",
        material: "",
    });

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await productAPI.getAllProducts();

            console.log("Fetched products:", response.data);

            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /*
     * Update a single filter.
     */
    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value,
        }));
    };

    /*
     * Reset all filters.
     */
    const clearFilters = () => {
        setFilters({
            category: "",
            type: "",
            material: "",
        });
    };

    /*
     * Determine whether any filter is active.
     */
    const hasActiveFilters =
        filters.category ||
        filters.type ||
        filters.material;

    /*
     * Filter products based on all selected filters.
     *
     * Every selected filter must match.
     */
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory =
                !filters.category ||
                product.category === filters.category;

            const matchesType =
                !filters.type ||
                product.type === filters.type;

            const matchesMaterial =
                !filters.material ||
                product.material === filters.material;

            return (
                matchesCategory &&
                matchesType &&
                matchesMaterial
            );
        });
    }, [products, filters]);

    /*
     * Group the FILTERED products by category.
     *
     * This is important because the category sections should
     * reflect the current filters.
     */
    const productsByCategory = useMemo(() => {
        return productCategoryOptions.reduce((groups, category) => {
            groups[category] = filteredProducts.filter(
                (product) => product.category === category
            );

            return groups;
        }, {});
    }, [filteredProducts]);

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return null;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${IMAGE_BASE_URL}${imageUrl}`;
    };

    const handleCardClick = (id) => {
        navigate(`/products/${id}`);
    };

    const handleUpdate = (event, id) => {
        event.stopPropagation();

        navigate(`/update/${id}`);
    };

    const handleDelete = (event, id) => {
        event.stopPropagation();

        setDeleteProductId(id);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="mx-auto max-w-7xl">
                    <h1 className="mb-8 text-3xl font-bold text-gray-900">
                        Products
                    </h1>

                    <div className="flex items-center justify-center py-20">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="mx-auto max-w-7xl">

                {/* ---------------------------------------- */}
                {/* Header */}
                {/* ---------------------------------------- */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Products
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Manage your furniture products
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/create")}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        + Add Product
                    </button>
                </div>

                {/* ---------------------------------------- */}
                {/* Filters */}
                {/* ---------------------------------------- */}

                <div className="mb-10 rounded-xl bg-white p-5 shadow-sm">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Filter Products
                            </h2>

                            <p className="text-sm text-gray-500">
                                Narrow down products by category, type or
                                material.
                            </p>
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm font-semibold text-red-600 hover:text-red-700"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* Category */}
                        <div>
                            <label
                                htmlFor="category"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Category
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="">
                                    All categories
                                </option>

                                {productCategoryOptions.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Type */}
                        <div>
                            <label
                                htmlFor="type"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Type
                            </label>

                            <select
                                id="type"
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="">
                                    All types
                                </option>

                                {productTypeOptions.map((type) => (
                                    <option
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Material */}
                        <div>
                            <label
                                htmlFor="material"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Material
                            </label>

                            <select
                                id="material"
                                name="material"
                                value={filters.material}
                                onChange={handleFilterChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="">
                                    All materials
                                </option>

                                {productMaterialOptions.map((material) => (
                                    <option
                                        key={material}
                                        value={material}
                                    >
                                        {material}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active filter summary */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                            <span className="text-sm font-medium text-gray-500">
                                Active filters:
                            </span>

                            {filters.category && (
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                    Category: {filters.category}
                                </span>
                            )}

                            {filters.type && (
                                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                    Type: {filters.type}
                                </span>
                            )}

                            {filters.material && (
                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                    Material: {filters.material}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ---------------------------------------- */}
                {/* No products at all */}
                {/* ---------------------------------------- */}

                {products.length === 0 ? (
                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900">
                            No products yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Create your first furniture product to get
                            started.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/products/create")}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                        >
                            Create Product
                        </button>
                    </div>
                ) : filteredProducts.length === 0 ? (

                    /* ---------------------------------------- */
                    /* No results after filtering */
                    /* ---------------------------------------- */

                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
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
                                    d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                                />
                            </svg>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900">
                            No matching products
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Try changing or clearing your filters.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (

                    /* ---------------------------------------- */
                    /* Category sections */
                    /* ---------------------------------------- */

                    <div className="space-y-12">
                        {productCategoryOptions.map((category) => {
                            const categoryProducts =
                                productsByCategory[category];

                            if (!categoryProducts?.length) {
                                return null;
                            }

                            return (
                                <section key={category}>
                                    {/* Category heading */}
                                    <div className="mb-5 flex items-center gap-3 border-b border-gray-200 pb-3">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {category}
                                        </h2>

                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                                            {categoryProducts.length}
                                        </span>
                                    </div>

                                    {/* Products */}
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {categoryProducts.map((product) => {
                                            const firstImageUrl =
                                                product.images?.[0]?.imageUrl;

                                            return (
                                                <article
                                                    key={product.id}
                                                    onClick={() =>
                                                        handleCardClick(
                                                            product.id
                                                        )
                                                    }
                                                    className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                                >
                                                    {/* Image */}
                                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                                        {firstImageUrl ? (
                                                            <img
                                                                src={getImageUrl(
                                                                    firstImageUrl
                                                                )}
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                                <div className="text-center">
                                                                    <svg
                                                                        className="mx-auto h-12 w-12"
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

                                                                    <p className="mt-2 text-sm">
                                                                        No image
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {product.images?.length >
                                                            1 && (
                                                            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
                                                                {
                                                                    product
                                                                        .images
                                                                        .length
                                                                }{" "}
                                                                images
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Details */}
                                                    <div className="p-5">
                                                        <div className="mb-3">
                                                            <h3 className="truncate text-lg font-bold text-gray-900">
                                                                {
                                                                    product.name
                                                                }
                                                            </h3>

                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {product.type}
                                                            </p>
                                                        </div>

                                                        <p className="mb-4 line-clamp-2 min-h-[40px] text-sm text-gray-600">
                                                            {
                                                                product.description
                                                            }
                                                        </p>

                                                        <div className="mb-4 flex items-center justify-between">
                                                            <span className="text-xl font-bold text-blue-600">
                                                                {Number(
                                                                    product.price
                                                                ).toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </span>

                                                            {product.material && (
                                                                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                                    {
                                                                        product.material
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-2 border-t border-gray-100 pt-4">
                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    event
                                                                ) =>
                                                                    handleUpdate(
                                                                        event,
                                                                        product.id
                                                                    )
                                                                }
                                                                className="flex-1 rounded-lg border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                                                            >
                                                                Update
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    event
                                                                ) =>
                                                                    handleDelete(
                                                                        event,
                                                                        product.id
                                                                    )
                                                                }
                                                                className="flex-1 rounded-lg border border-red-600 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Delete modal */}
            {deleteProductId && (
                <DeleteModal
                    id={deleteProductId}
                    onClose={() => setDeleteProductId(null)}
                    onDeleted={() => {
                        setDeleteProductId(null);
                        fetchProducts();
                    }}
                />
            )}
        </div>
    );
};