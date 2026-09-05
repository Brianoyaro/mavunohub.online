import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { productTypeOptions, productCategoryOptions, productMaterialOptions } from "../components/configs";

import { productAPI } from "../api/productsApi";
import { DeleteModal } from "../components/deleteModal";

const PRODUCTS_PER_CATEGORY = parseInt(import.meta.env.VITE_APP_PRODUCTS_PER_CATEGORY) || 4;

export const Home = () => {
    const navigate = useNavigate();

    const IMAGE_BASE_URL =
        import.meta.env.VITE_APP_IMAGE_BASE_URL ||
        "http://localhost:3000";

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteProductId, setDeleteProductId] = useState(null);

    const [filters, setFilters] = useState({
        category: "",
        type: "",
        material: "",
    });

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await productAPI.getAllProducts();

            setProducts(response.data || []);
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

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: "",
            type: "",
            material: "",
        });
    };

    const hasActiveFilters =
        Boolean(filters.category) ||
        Boolean(filters.type) ||
        Boolean(filters.material);

    const activeFilterCount = [
        filters.category,
        filters.type,
        filters.material,
    ].filter(Boolean).length;

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
        navigate(`/${id}`);
    };

    const handleUpdate = (event, id) => {
        event.stopPropagation();
        navigate(`/update/${id}`);
    };

    const handleDelete = (event, id) => {
        event.stopPropagation();
        setDeleteProductId(id);
    };

    const handleViewAll = (category) => {
        navigate(
            `/products?category=${encodeURIComponent(category)}`
        );
    };

    const priceFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "KES",
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
                    <div className="mb-6 sm:mb-8">
                        <div className="h-7 w-36 animate-pulse rounded bg-gray-200 sm:h-9 sm:w-48" />

                        <div className="mt-3 h-4 w-64 max-w-full animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="mb-6 h-12 animate-pulse rounded-xl bg-gray-200 sm:hidden" />

                    <div className="mb-8 hidden rounded-xl bg-white p-5 shadow-sm sm:block">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-11 animate-pulse rounded-lg bg-gray-200"
                                />
                            ))}
                        </div>
                    </div>

                    {[1, 2].map((section) => (
                        <div
                            key={section}
                            className="mb-10"
                        >
                            <div className="mb-5 h-7 w-40 animate-pulse rounded bg-gray-200" />

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="overflow-hidden rounded-xl bg-white shadow-sm"
                                    >
                                        <div className="h-36 animate-pulse bg-gray-200 sm:h-56" />

                                        <div className="space-y-3 p-3 sm:p-5">
                                            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
                                            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                                            <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Products
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                            Manage your furniture products
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/create")}
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:rounded-lg sm:py-2.5"
                    >
                        <svg
                            className="mr-2 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>

                        Add Product
                    </button>
                </div>

                {/* Mobile filters */}
                <div className="mb-5 sm:hidden">
                    <button
                        type="button"
                        onClick={() =>
                            setIsFiltersOpen((current) => !current)
                        }
                        aria-expanded={isFiltersOpen}
                        className="flex min-h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 4h18M6 12h12M10 20h4"
                                    />
                                </svg>
                            </span>

                            <div className="text-left">
                                <p className="text-sm font-semibold text-gray-900">
                                    Filters
                                </p>

                                <p className="text-xs text-gray-500">
                                    {activeFilterCount > 0
                                        ? `${activeFilterCount} active`
                                        : "Filter products"}
                                </p>
                            </div>

                            {activeFilterCount > 0 && (
                                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>

                        <svg
                            className={`h-5 w-5 text-gray-500 transition-transform ${
                                isFiltersOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {isFiltersOpen && (
                        <div className="mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        Filter Products
                                    </h2>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Narrow down your products.
                                    </p>
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                <FilterSelect
                                    id="mobile-category"
                                    name="category"
                                    label="Category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    options={productCategoryOptions}
                                    placeholder="All categories"
                                />

                                <FilterSelect
                                    id="mobile-type"
                                    name="type"
                                    label="Type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    options={productTypeOptions}
                                    placeholder="All types"
                                />

                                <FilterSelect
                                    id="mobile-material"
                                    name="material"
                                    label="Material"
                                    value={filters.material}
                                    onChange={handleFilterChange}
                                    options={productMaterialOptions}
                                    placeholder="All materials"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop filters */}
                <div className="mb-8 hidden rounded-xl bg-white p-5 shadow-sm sm:block lg:mb-10">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Filter Products
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Narrow down products by category, type or
                                material.
                            </p>
                        </div>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FilterSelect
                            id="category"
                            name="category"
                            label="Category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            options={productCategoryOptions}
                            placeholder="All categories"
                        />

                        <FilterSelect
                            id="type"
                            name="type"
                            label="Type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            options={productTypeOptions}
                            placeholder="All types"
                        />

                        <FilterSelect
                            id="material"
                            name="material"
                            label="Material"
                            value={filters.material}
                            onChange={handleFilterChange}
                            options={productMaterialOptions}
                            placeholder="All materials"
                        />
                    </div>
                </div>

                {/* Results */}
                {products.length === 0 ? (
                    <EmptyState
                        title="No products yet"
                        message="Create your first furniture product to get started."
                        action="Create Product"
                        onAction={() => navigate("/create")}
                    />
                ) : filteredProducts.length === 0 ? (
                    <EmptyState
                        title="No matching products"
                        message="Try changing or clearing your filters."
                        action="Clear Filters"
                        onAction={clearFilters}
                    />
                ) : (
                    <div className="space-y-10 sm:space-y-12">
                        {productCategoryOptions.map((category) => {
                            const categoryProducts =
                                productsByCategory[category];

                            if (!categoryProducts?.length) {
                                return null;
                            }

                            const visibleProducts =
                                categoryProducts.slice(
                                    0,
                                    PRODUCTS_PER_CATEGORY
                                );

                            const hasMoreProducts =
                                categoryProducts.length >
                                PRODUCTS_PER_CATEGORY;

                            return (
                                <section key={category}>
                                    {/* Category heading */}
                                    <div className="mb-4 flex items-end justify-between gap-4 border-b border-gray-200 pb-3 sm:mb-5">
                                        <div className="min-w-0">
                                            <h2 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                                                {category}
                                            </h2>

                                            <p className="mt-1 hidden text-sm text-gray-500 sm:block">
                                                Manage your{" "}
                                                {category.toLowerCase()}{" "}
                                                furniture
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewAll(category)
                                            }
                                            className="group flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 sm:px-3 sm:py-2 sm:text-sm"
                                        >
                                            <span>
                                                {hasMoreProducts
                                                    ? "View all"
                                                    : "View products"}
                                            </span>

                                            <svg
                                                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Product count */}
                                    <div className="mb-4">
                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {categoryProducts.length}{" "}
                                            {categoryProducts.length === 1
                                                ? "product"
                                                : "products"}
                                        </span>
                                    </div>

                                    {/* Product grid */}
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                                        {visibleProducts.map((product) => {
                                            const firstImageUrl =
                                                product.images?.[0]?.imageUrl;

                                            const description =
                                                product.description || "";

                                            return (
                                                <article
                                                    key={product.id}
                                                    onClick={() =>
                                                        handleCardClick(
                                                            product.id
                                                        )
                                                    }
                                                    className="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:rounded-2xl"
                                                >
                                                    {/* Image */}
                                                    <div className="relative h-36 overflow-hidden bg-gray-100 sm:h-56">
                                                        {firstImageUrl ? (
                                                            <img
                                                                src={getImageUrl(
                                                                    firstImageUrl
                                                                )}
                                                                alt={
                                                                    product.name
                                                                }
                                                                loading="lazy"
                                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-gray-400">
                                                                <svg
                                                                    className="h-9 w-9 sm:h-12 sm:w-12"
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

                                                        {product.images?.length >
                                                            1 && (
                                                            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[9px] font-medium text-white backdrop-blur sm:bottom-3 sm:right-3 sm:px-2.5 sm:text-xs">
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
                                                    <div className="flex flex-1 flex-col p-3 sm:p-5">
                                                        <div className="mb-2 sm:mb-3">
                                                            <h3 className="line-clamp-2 min-h-[32px] text-sm font-bold leading-4 text-gray-900 sm:min-h-0 sm:text-lg sm:leading-6">
                                                                {
                                                                    product.name
                                                                }
                                                            </h3>

                                                            {product.type && (
                                                                <p className="mt-1 truncate text-[10px] text-gray-500 sm:text-sm">
                                                                    {
                                                                        product.type
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <p className="mb-3 hidden line-clamp-2 text-sm leading-5 text-gray-600 sm:mb-4 sm:block sm:min-h-[40px]">
                                                            {description
                                                                ? description.length >
                                                                  100
                                                                    ? `${description.slice(
                                                                          0,
                                                                          100
                                                                      )}...`
                                                                    : description
                                                                : "No description available."}
                                                        </p>

                                                        <div className="mb-3 flex min-w-0 flex-col gap-1.5 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                                                            <span className="truncate text-sm font-bold text-blue-600 sm:text-xl">
                                                                {priceFormatter.format(
                                                                    Number(
                                                                        product.price
                                                                    )
                                                                )}
                                                            </span>

                                                            {product.material && (
                                                                <span className="w-fit max-w-full truncate rounded-md bg-gray-100 px-2 py-1 text-[9px] font-medium text-gray-600 sm:px-2.5 sm:text-xs">
                                                                    {
                                                                        product.material
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="mt-auto flex gap-1.5 border-t border-gray-100 pt-3 sm:gap-2 sm:pt-4">
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
                                                                className="min-h-9 flex-1 rounded-lg border border-blue-600 px-1.5 py-1.5 text-[10px] font-semibold text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 sm:min-h-10 sm:px-3 sm:py-2 sm:text-sm"
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
                                                                className="min-h-9 flex-1 rounded-lg border border-red-600 px-1.5 py-1.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 sm:min-h-10 sm:px-3 sm:py-2 sm:text-sm"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>

                                    {/* Bottom View All */}
                                    {hasMoreProducts && (
                                        <div className="mt-5 flex justify-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewAll(category)
                                                }
                                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                            >
                                                View all{" "}
                                                {category.toLowerCase()}{" "}
                                                products

                                                <svg
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>

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


/* -------------------------------------------------- */
/* Reusable filter select */
/* -------------------------------------------------- */

const FilterSelect = ({
    id,
    name,
    label,
    value,
    onChange,
    options,
    placeholder,
}) => {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                {label}
            </label>

            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};


/* -------------------------------------------------- */
/* Empty state */
/* -------------------------------------------------- */

const EmptyState = ({
    title,
    message,
    action,
    onAction,
}) => {
    return (
        <div className="rounded-2xl bg-white px-4 py-14 text-center shadow-sm sm:p-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
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
                        d="M3 7h18M5 7l1 13h12l1-13M9 7V5a3 3 0 016 0v2"
                    />
                </svg>
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
                {title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                {message}
            </p>

            <button
                type="button"
                onClick={onAction}
                className="mt-6 min-h-11 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                {action}
            </button>
        </div>
    );
};