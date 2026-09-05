import { useCallback, useEffect, useMemo, useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import {
    productCategoryOptions,
    productTypeOptions,
    productMaterialOptions,
} from "../components/configs";

import { productAPI } from "../api/productsApi";
import { DeleteModal } from "../components/deleteModal";

const PRODUCTS_PER_PAGE = parseInt(import.meta.env.VITE_APP_PRODUCTS_PER_PAGE) || 8;

export const ProductListView = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const IMAGE_BASE_URL =
        import.meta.env.VITE_APP_IMAGE_BASE_URL ||
        "http://localhost:3000";

    const categoryFromUrl = searchParams.get("category") || "";
    const pageFromUrl = Number(searchParams.get("page")) || 1;

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const [filters, setFilters] = useState({
        category: categoryFromUrl,
        type: searchParams.get("type") || "",
        material: searchParams.get("material") || "",
    });

    /*
     * Fetch products.
     */
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

    /*
     * Keep local filters synchronized with URL.
     */
    useEffect(() => {
        setFilters({
            category: searchParams.get("category") || "",
            type: searchParams.get("type") || "",
            material: searchParams.get("material") || "",
        });
    }, [searchParams]);

    /*
     * Update filters.
     */
    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        const nextFilters = {
            ...filters,
            [name]: value,
        };

        setFilters(nextFilters);

        const nextParams = new URLSearchParams();

        if (nextFilters.category) {
            nextParams.set(
                "category",
                nextFilters.category
            );
        }

        if (nextFilters.type) {
            nextParams.set(
                "type",
                nextFilters.type
            );
        }

        if (nextFilters.material) {
            nextParams.set(
                "material",
                nextFilters.material
            );
        }

        // Always reset to first page when filters change.
        nextParams.set("page", "1");

        setSearchParams(nextParams);
    };

    /*
     * Clear filters.
     */
    const clearFilters = () => {
        setFilters({
            category: "",
            type: "",
            material: "",
        });

        setSearchParams({
            page: "1",
        });
    };

    /*
     * Filter products.
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
     * Pagination.
     */
    const totalProducts = filteredProducts.length;

    const totalPages = Math.max(
        1,
        Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
    );

    const currentPage = Math.min(
        Math.max(pageFromUrl, 1),
        totalPages
    );

    /*
     * Products for current page.
     */
    const paginatedProducts = useMemo(() => {
        const startIndex =
            (currentPage - 1) * PRODUCTS_PER_PAGE;

        return filteredProducts.slice(
            startIndex,
            startIndex + PRODUCTS_PER_PAGE
        );
    }, [filteredProducts, currentPage]);

    /*
     * Update page.
     */
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        const nextParams = new URLSearchParams(
            searchParams
        );

        nextParams.set("page", String(page));

        setSearchParams(nextParams);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    /*
     * Image URL.
     */
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
     * Navigation.
     */
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

    /*
     * Active filters.
     */
    const activeFilterCount = [
        filters.category,
        filters.type,
        filters.material,
    ].filter(Boolean).length;

    const hasActiveFilters = activeFilterCount > 0;

    /*
     * Pagination numbers.
     */
    const paginationItems = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    }, [currentPage, totalPages]);

    const priceFormatter = new Intl.NumberFormat(
        undefined,
        {
            style: "currency",
            currency: "KES",
        }
    );

    /*
     * Loading.
     */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
                    <div className="mb-8">
                        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
                        <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-11 animate-pulse rounded-lg bg-gray-200"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="overflow-hidden rounded-xl bg-white shadow-sm"
                                >
                                    <div className="h-40 animate-pulse bg-gray-200 sm:h-56" />

                                    <div className="space-y-3 p-3 sm:p-5">
                                        <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
                                        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                                        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-gray-500 transition hover:text-blue-600"
                        >
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
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>

                            Back to Products
                        </button>

                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            {filters.category
                                ? filters.category
                                : "All Products"}
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                            {filters.category
                                ? `Browse all ${filters.category.toLowerCase()} furniture`
                                : "Browse our complete furniture collection"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/create")}
                        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto sm:rounded-lg sm:py-2.5"
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

                {/* Filters */}
                <div className="mb-6 rounded-xl bg-white shadow-sm sm:mb-8 sm:rounded-2xl">
                    {/* Mobile */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsFiltersOpen(
                                (current) => !current
                            )
                        }
                        className="flex min-h-12 w-full items-center justify-between px-4 sm:hidden"
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
                                    {activeFilterCount
                                        ? `${activeFilterCount} active`
                                        : "Refine products"}
                                </p>
                            </div>

                            {activeFilterCount > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>

                        <svg
                            className={`h-5 w-5 text-gray-400 transition-transform ${
                                isFiltersOpen
                                    ? "rotate-180"
                                    : ""
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

                    <div
                        className={`${
                            isFiltersOpen
                                ? "block"
                                : "hidden"
                        } border-t border-gray-100 p-4 sm:block sm:border-0 sm:p-5`}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="hidden sm:block">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Filter Products
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Filter by category, type or
                                    material.
                                </p>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="ml-auto rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:text-sm"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                            <FilterSelect
                                id="product-list-category"
                                name="category"
                                label="Category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                options={
                                    productCategoryOptions
                                }
                                placeholder="All categories"
                            />

                            <FilterSelect
                                id="product-list-type"
                                name="type"
                                label="Type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                options={productTypeOptions}
                                placeholder="All types"
                            />

                            <FilterSelect
                                id="product-list-material"
                                name="material"
                                label="Material"
                                value={filters.material}
                                onChange={handleFilterChange}
                                options={
                                    productMaterialOptions
                                }
                                placeholder="All materials"
                            />
                        </div>
                    </div>
                </div>

                {/* Results summary */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
                    <p className="text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-semibold text-gray-900">
                            {totalProducts === 0
                                ? 0
                                : (currentPage - 1) *
                                      PRODUCTS_PER_PAGE +
                                  1}
                        </span>
                        {" - "}
                        <span className="font-semibold text-gray-900">
                            {Math.min(
                                currentPage *
                                    PRODUCTS_PER_PAGE,
                                totalProducts
                            )}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900">
                            {totalProducts}
                        </span>{" "}
                        products
                    </p>

                    {totalPages > 1 && (
                        <p className="text-xs text-gray-400 sm:text-sm">
                            Page {currentPage} of{" "}
                            {totalPages}
                        </p>
                    )}
                </div>

                {/* Empty state */}
                {totalProducts === 0 ? (
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
                                    d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-gray-900">
                            No matching products
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Try changing or clearing your
                            filters.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Product grid */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                            {paginatedProducts.map(
                                (product) => {
                                    const firstImageUrl =
                                        product.images?.[0]
                                            ?.imageUrl;

                                    const description =
                                        product.description ||
                                        "";

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

                                                {product.images
                                                    ?.length >
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
                                                        className="min-h-9 flex-1 rounded-lg border border-blue-600 px-1.5 py-1.5 text-[10px] font-semibold text-blue-600 transition hover:bg-blue-50 sm:min-h-10 sm:px-3 sm:py-2 sm:text-sm"
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
                                                        className="min-h-9 flex-1 rounded-lg border border-red-600 px-1.5 py-1.5 text-[10px] font-semibold text-red-600 transition hover:bg-red-50 sm:min-h-10 sm:px-3 sm:py-2 sm:text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
                                <div className="flex items-center gap-1.5 rounded-xl bg-white p-2 shadow-sm ring-1 ring-gray-100 sm:gap-2">
                                    {/* Previous */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            goToPage(
                                                currentPage -
                                                    1
                                            )
                                        }
                                        disabled={
                                            currentPage === 1
                                        }
                                        className="flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:px-3"
                                    >
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
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>

                                        <span className="hidden sm:inline">
                                            Previous
                                        </span>
                                    </button>

                                    {/* Page numbers */}
                                    {paginationItems.map(
                                        (
                                            item,
                                            index
                                        ) => {
                                            if (
                                                item ===
                                                "..."
                                            ) {
                                                return (
                                                    <span
                                                        key={`ellipsis-${index}`}
                                                        className="flex h-9 w-7 items-center justify-center text-sm text-gray-400 sm:h-10 sm:w-9"
                                                    >
                                                        …
                                                    </span>
                                                );
                                            }

                                            return (
                                                <button
                                                    key={
                                                        item
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        goToPage(
                                                            item
                                                        )
                                                    }
                                                    aria-current={
                                                        currentPage ===
                                                        item
                                                            ? "page"
                                                            : undefined
                                                    }
                                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition sm:h-10 sm:w-10 ${
                                                        currentPage ===
                                                        item
                                                            ? "bg-blue-600 text-white shadow-sm"
                                                            : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                                >
                                                    {
                                                        item
                                                    }
                                                </button>
                                            );
                                        }
                                    )}

                                    {/* Next */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            goToPage(
                                                currentPage +
                                                    1
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        className="flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:px-3"
                                    >
                                        <span className="hidden sm:inline">
                                            Next
                                        </span>

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

                                <p className="text-xs text-gray-500">
                                    Page{" "}
                                    <span className="font-semibold text-gray-900">
                                        {currentPage}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-gray-900">
                                        {totalPages}
                                    </span>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete modal */}
            {deleteProductId && (
                <DeleteModal
                    id={deleteProductId}
                    onClose={() =>
                        setDeleteProductId(null)
                    }
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
/* Filter Select */
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
                <option value="">
                    {placeholder}
                </option>

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

export default ProductListView;