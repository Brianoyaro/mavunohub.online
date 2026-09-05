import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useCartStore } from "../store/cartStore";
import {
    productCategoryOptions,
    productTypeOptions,
    productMaterialOptions,
} from "../components/configs";
import { productAPI } from "../api/productsApi";

const PRODUCTS_PER_PAGE = parseInt(import.meta.env.VITE_APP_PRODUCTS_PER_PAGE) || 1;

export const ProductListView = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const addToCart = useCartStore((state) => state.addToCart);

    const IMAGE_BASE_URL =
        import.meta.env.VITE_APP_IMAGE_BASE_URL ||
        "http://localhost:3000";

    /*
     * URL state
     */
    const categoryFromUrl = searchParams.get("category") || "";
    const pageFromUrl = Number(searchParams.get("page")) || 1;
    const searchFromUrl = searchParams.get("search") || "";
    const typeFromUrl = searchParams.get("type") || "";
    const materialFromUrl = searchParams.get("material") || "";

    const category = productCategoryOptions.includes(categoryFromUrl)
        ? categoryFromUrl
        : "";

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /*
     * Local search input so we don't update the URL
     * on every keystroke.
     */
    const [searchInput, setSearchInput] = useState(searchFromUrl);

    /*
     * Mobile filters
     */
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    /*
     * Fetch products
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
     * Keep local search input synchronized with URL.
     */
    useEffect(() => {
        setSearchInput(searchFromUrl);
    }, [searchFromUrl]);

    /*
     * Image URL helper
     */
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return null;
        }

        if (
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
        ) {
            return imageUrl;
        }

        return `${IMAGE_BASE_URL}${imageUrl}`;
    };

    /*
     * Filter products
     */
    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchFromUrl.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                !category || product.category === category;

            const matchesType =
                !typeFromUrl || product.type === typeFromUrl;

            const matchesMaterial =
                !materialFromUrl ||
                product.material === materialFromUrl;

            const matchesSearch =
                !normalizedSearch ||
                product.name?.toLowerCase().includes(normalizedSearch) ||
                product.description
                    ?.toLowerCase()
                    .includes(normalizedSearch) ||
                product.type?.toLowerCase().includes(normalizedSearch) ||
                product.material?.toLowerCase().includes(normalizedSearch);

            return (
                matchesCategory &&
                matchesType &&
                matchesMaterial &&
                matchesSearch
            );
        });
    }, [
        products,
        category,
        typeFromUrl,
        materialFromUrl,
        searchFromUrl,
    ]);

    /*
     * Pagination
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

    const paginatedProducts = useMemo(() => {
        const startIndex =
            (currentPage - 1) * PRODUCTS_PER_PAGE;

        return filteredProducts.slice(
            startIndex,
            startIndex + PRODUCTS_PER_PAGE
        );
    }, [filteredProducts, currentPage]);

    /*
     * Update URL parameters.
     */
    const updateParams = (updates = {}) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        setSearchParams(params);
    };

    /*
     * Search
     */
    const handleSearchSubmit = (event) => {
        event.preventDefault();

        updateParams({
            search: searchInput.trim(),
            page: 1,
        });
    };

    /*
     * Filters
     */
    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        updateParams({
            [name]: value,
            page: 1,
        });
    };

    /*
     * Clear filters
     */
    const clearFilters = () => {
        setSearchInput("");

        const params = new URLSearchParams();

        if (category) {
            params.set("category", category);
        }

        setSearchParams(params);
    };

    /*
     * Pagination
     */
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }

        updateParams({
            page: page === 1 ? "" : page,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const goToPreviousPage = () => {
        goToPage(currentPage - 1);
    };

    const goToNextPage = () => {
        goToPage(currentPage + 1);
    };

    /*
     * Product details
     */
    const handleCardClick = (id) => {
        navigate(`/${id}`);
    };

    /*
     * Add to cart
     */
    const handleAddToCart = (event, product) => {
        event.stopPropagation();

        addToCart(product, 1);

        toast.success(`${product.name} added to cart!`);
    };

    /*
     * Currency formatter
     */
    const priceFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "KSH",
    });

    /*
     * Active filters
     */
    const activeFilterCount = [
        searchFromUrl,
        typeFromUrl,
        materialFromUrl,
    ].filter(Boolean).length;

    /*
     * Pagination numbers
     *
     * Keeps the pagination compact when there are many pages.
     */
    const paginationItems = useMemo(() => {
        const items = [];

        if (totalPages <= 7) {
            for (let page = 1; page <= totalPages; page++) {
                items.push(page);
            }

            return items;
        }

        items.push(1);

        if (currentPage > 4) {
            items.push("...");
        }

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(
            totalPages - 1,
            currentPage + 1
        );

        for (let page = start; page <= end; page++) {
            items.push(page);
        }

        if (currentPage < totalPages - 3) {
            items.push("...");
        }

        items.push(totalPages);

        return items;
    }, [currentPage, totalPages]);

    /*
     * Loading state
     */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

                    <div className="mb-8">
                        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />

                        <div className="mt-4 h-9 w-72 animate-pulse rounded bg-gray-200" />

                        <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="mb-8 h-20 animate-pulse rounded-2xl bg-gray-200" />

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="overflow-hidden rounded-2xl bg-white shadow-sm"
                                >
                                    <div className="h-44 animate-pulse bg-gray-200 sm:h-60" />

                                    <div className="space-y-3 p-4">
                                        <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
                                        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                                        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
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
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

                {/* Header */}
                <div className="mb-6 sm:mb-8">

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-blue-600"
                    >
                        <span>←</span>
                        Back to Home
                    </Link>

                    <div className="mt-5 flex flex-col gap-4 sm:mt-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    {category || "All Products"}
                                </h1>

                                {category && (
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        Collection
                                    </span>
                                )}
                            </div>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                                {category
                                    ? `Explore our ${category.toLowerCase()} furniture collection.`
                                    : "Explore our complete furniture collection."}
                            </p>
                        </div>

                        <div className="shrink-0 rounded-xl bg-white px-4 py-3 text-center shadow-sm ring-1 ring-gray-100">
                            <p className="text-xl font-bold text-gray-900">
                                {totalProducts}
                            </p>

                            <p className="text-xs text-gray-500">
                                {totalProducts === 1
                                    ? "Product"
                                    : "Products"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search and filters */}
                <div className="mb-7 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                    {/* Search */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex flex-col gap-3 p-4 sm:flex-row sm:p-5"
                    >
                        <div className="relative flex-1">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                                />
                            </svg>

                            <input
                                type="search"
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(
                                        event.target.value
                                    )
                                }
                                placeholder="Search furniture..."
                                className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                        >
                            Search
                        </button>
                    </form>

                    {/* Mobile filter button */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsFiltersOpen(
                                (current) => !current
                            )
                        }
                        className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-3.5 text-left md:hidden"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
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
                                        d="M3 5h18M6 12h12M10 19h4"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Filters
                                </p>

                                <p className="text-xs text-gray-500">
                                    {activeFilterCount
                                        ? `${activeFilterCount} active`
                                        : "Refine products"}
                                </p>
                            </div>
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
                                d="m19 9-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {/* Filters */}
                    <div
                        className={`border-t border-gray-100 ${
                            isFiltersOpen
                                ? "block"
                                : "hidden"
                        } md:block`}
                    >
                        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-5">

                            {/* Category */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                                >
                                    Category
                                </label>

                                <select
                                    id="category"
                                    name="category"
                                    value={category}
                                    onChange={
                                        handleFilterChange
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                >
                                    <option value="">
                                        All categories
                                    </option>

                                    {productCategoryOptions.map(
                                        (option) => (
                                            <option
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label
                                    htmlFor="type"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                                >
                                    Type
                                </label>

                                <select
                                    id="type"
                                    name="type"
                                    value={typeFromUrl}
                                    onChange={
                                        handleFilterChange
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                >
                                    <option value="">
                                        All types
                                    </option>

                                    {productTypeOptions.map(
                                        (option) => (
                                            <option
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Material */}
                            <div>
                                <label
                                    htmlFor="material"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                                >
                                    Material
                                </label>

                                <select
                                    id="material"
                                    name="material"
                                    value={materialFromUrl}
                                    onChange={
                                        handleFilterChange
                                    }
                                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                >
                                    <option value="">
                                        All materials
                                    </option>

                                    {productMaterialOptions.map(
                                        (option) => (
                                            <option
                                                key={option}
                                                value={option}
                                            >
                                                {option}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        {(activeFilterCount > 0 ||
                            typeFromUrl ||
                            materialFromUrl) && (
                            <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:px-5">
                                <p className="text-xs text-gray-500 sm:text-sm">
                                    Filters are applied to this collection.
                                </p>

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 sm:text-sm"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results summary */}
                {totalProducts > 0 && (
                    <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
                        <p className="text-xs text-gray-500 sm:text-sm">
                            Showing{" "}
                            <span className="font-semibold text-gray-900">
                                {(currentPage - 1) *
                                    PRODUCTS_PER_PAGE +
                                    1}
                            </span>
                            {" – "}
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
                            </span>
                        </p>

                        <p className="text-xs text-gray-400">
                            Page {currentPage} of {totalPages}
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {paginatedProducts.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">
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
                                    d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                                />
                            </svg>
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            No products found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            We couldn't find any furniture matching your
                            current search and filters.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Product grid */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                            {paginatedProducts.map((product) => {
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
                                        className="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl"
                                    >
                                        {/* Image */}
                                        <div className="relative h-40 overflow-hidden bg-gray-100 sm:h-60">
                                            {firstImageUrl ? (
                                                <img
                                                    src={getImageUrl(
                                                        firstImageUrl
                                                    )}
                                                    alt={
                                                        product.name
                                                    }
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-gray-400">
                                                    <svg
                                                        className="h-10 w-10 sm:h-12 sm:w-12"
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

                                            <span className="absolute left-2 top-2 max-w-[75%] truncate rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold text-gray-700 shadow-sm backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                                                {
                                                    product.category
                                                }
                                            </span>

                                            {product.images?.length >
                                                1 && (
                                                <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[9px] font-medium text-white backdrop-blur sm:bottom-3 sm:right-3 sm:px-2.5 sm:text-xs">
                                                    {
                                                        product
                                                            .images
                                                            .length
                                                    }{" "}
                                                    photos
                                                </span>
                                            )}
                                        </div>

                                        {/* Information */}
                                        <div className="flex flex-1 flex-col p-3 sm:p-5">
                                            <div className="mb-2 sm:mb-3">
                                                <h2 className="line-clamp-2 min-h-[34px] text-sm font-bold leading-4 text-gray-900 sm:min-h-0 sm:text-lg sm:leading-6">
                                                    {
                                                        product.name
                                                    }
                                                </h2>

                                                {product.type && (
                                                    <p className="mt-1 truncate text-[11px] text-gray-500 sm:text-sm">
                                                        {
                                                            product.type
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <p className="mb-3 hidden min-h-[40px] text-sm leading-5 text-gray-600 sm:mb-5 sm:block">
                                                {description.length >
                                                100
                                                    ? `${description.slice(
                                                          0,
                                                          100
                                                      )}...`
                                                    : description}
                                            </p>

                                            <div className="mb-3 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                                                <span className="truncate text-base font-bold text-gray-900 sm:text-xl">
                                                    {priceFormatter.format(
                                                        Number(
                                                            product.price
                                                        )
                                                    )}
                                                </span>

                                                {product.material && (
                                                    <span className="w-fit max-w-full truncate rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 sm:px-2.5 sm:text-xs">
                                                        {
                                                            product.material
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={(event) =>
                                                    handleAddToCart(
                                                        event,
                                                        product
                                                    )
                                                }
                                                className="mt-auto flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 py-2 text-[11px] font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                                            >
                                                <svg
                                                    className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h13M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                                                    />
                                                </svg>

                                                Add to Cart
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <nav
                                className="mt-8 flex items-center justify-center sm:mt-10"
                                aria-label="Product pagination"
                            >
                                <div className="flex items-center gap-1 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-gray-100 sm:gap-2 sm:p-2">

                                    {/* Previous */}
                                    <button
                                        type="button"
                                        onClick={
                                            goToPreviousPage
                                        }
                                        disabled={
                                            currentPage === 1
                                        }
                                        className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                                        aria-label="Previous page"
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
                                                d="m15 18-6-6 6-6"
                                            />
                                        </svg>

                                        <span className="hidden sm:inline">
                                            Previous
                                        </span>
                                    </button>

                                    {/* Page numbers */}
                                    <div className="flex items-center gap-1">
                                        {paginationItems.map(
                                            (item, index) => {
                                                if (
                                                    item ===
                                                    "..."
                                                ) {
                                                    return (
                                                        <span
                                                            key={`ellipsis-${index}`}
                                                            className="flex h-9 w-8 items-center justify-center text-sm text-gray-400"
                                                        >
                                                            ...
                                                        </span>
                                                    );
                                                }

                                                const isActive =
                                                    item ===
                                                    currentPage;

                                                return (
                                                    <button
                                                        key={item}
                                                        type="button"
                                                        onClick={() =>
                                                            goToPage(
                                                                item
                                                            )
                                                        }
                                                        aria-current={
                                                            isActive
                                                                ? "page"
                                                                : undefined
                                                        }
                                                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
                                                            isActive
                                                                ? "bg-blue-600 text-white shadow-sm"
                                                                : "text-gray-600 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        {item}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    {/* Next */}
                                    <button
                                        type="button"
                                        onClick={goToNextPage}
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        className="inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
                                        aria-label="Next page"
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
                                                d="m9 18 6-6-6-6"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductListView;

