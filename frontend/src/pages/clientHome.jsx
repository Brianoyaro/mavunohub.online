import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCartStore } from "../store/cartStore";
import {
    productCategoryOptions,
    productTypeOptions,
    productMaterialOptions,
} from "../components/configs";
import { productAPI } from "../api/productsApi";

const PRODUCTS_PER_CATEGORY = parseInt(import.meta.env.VITE_APP_PRODUCTS_PER_CATEGORY) || 4;

export const Home = () => {
    const navigate = useNavigate();
    const addToCart = useCartStore((state) => state.addToCart);

    const IMAGE_BASE_URL =
        import.meta.env.VITE_APP_IMAGE_BASE_URL ||
        "http://localhost:3000";

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    /*
     * Update filters.
     */
    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((currentFilters) => ({
            ...currentFilters,
            [name]: value,
        }));
    };

    /*
     * Clear all filters.
     */
    const clearFilters = () => {
        setFilters({
            category: "",
            type: "",
            material: "",
        });
    };

    /*
     * Number of active filters.
     */
    const activeFilterCount = [
        filters.category,
        filters.type,
        filters.material,
    ].filter(Boolean).length;

    const hasActiveFilters = activeFilterCount > 0;

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
     * Group filtered products by category.
     */
    const productsByCategory = useMemo(() => {
        return productCategoryOptions.reduce((groups, category) => {
            groups[category] = filteredProducts.filter(
                (product) => product.category === category
            );

            return groups;
        }, {});
    }, [filteredProducts]);

    /*
     * Build image URL.
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
     * Navigate to product details.
     */
    const handleCardClick = (id) => {
        navigate(`/${id}`);
    };

    /*
     * Navigate to all products in a category.
     */
    const handleViewAll = (category) => {
        navigate(
            `/products?category=${encodeURIComponent(category)}`
        );
    };

    /*
     * Add product to cart.
     */
    const handleAddToCart = (event, product) => {
        event.stopPropagation();

        addToCart(product, 1);

        toast.success(`${product.name} added to cart!`);
    };

    /*
     * Currency formatter.
     */
    const priceFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "KSH",
    });

    /*
     * Loading state.
     */
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
                    <div className="mb-6 sm:mb-8">
                        <div className="h-7 w-52 animate-pulse rounded bg-gray-200 sm:h-8 sm:w-60" />
                        <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="mb-6 space-y-3 sm:mb-10 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-11 animate-pulse rounded-lg bg-gray-200"
                            />
                        ))}
                    </div>

                    <div className="space-y-10">
                        {[1, 2, 3].map((section) => (
                            <section key={section}>
                                <div className="mb-5 h-7 w-40 animate-pulse rounded bg-gray-200" />

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="overflow-hidden rounded-xl bg-white shadow-sm"
                                        >
                                            <div className="h-40 animate-pulse bg-gray-200 sm:h-60" />

                                            <div className="space-y-3 p-3 sm:p-5">
                                                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
                                                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                                                <div className="h-9 w-full animate-pulse rounded bg-gray-200" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Discover Our Furniture
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-5 text-gray-500 sm:text-base sm:leading-6">
                        Find the perfect furniture pieces for your home,
                        office, bedroom and outdoor spaces.
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-7 rounded-xl border border-gray-100 bg-white shadow-sm sm:mb-10 sm:rounded-2xl">
                    {/* Mobile filter toggle */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsFiltersOpen((current) => !current)
                        }
                        aria-expanded={isFiltersOpen}
                        aria-controls="mobile-filter-panel"
                        className="flex w-full items-center justify-between px-4 py-3.5 text-left md:hidden"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
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

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                        Filters
                                    </span>

                                    {hasActiveFilters && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </div>

                                <p className="mt-0.5 truncate text-xs text-gray-500">
                                    {hasActiveFilters
                                        ? `${activeFilterCount} filter${
                                              activeFilterCount === 1
                                                  ? ""
                                                  : "s"
                                          } applied`
                                        : "Filter the furniture collection"}
                                </p>
                            </div>
                        </div>

                        <svg
                            className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
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

                    {/* Filter content */}
                    <div
                        id="mobile-filter-panel"
                        className={`${
                            isFiltersOpen ? "block" : "hidden"
                        } border-t border-gray-100 md:block md:border-t-0`}
                    >
                        <div className="p-3 sm:p-5">
                            <div className="mb-4 hidden items-center justify-between gap-3 md:flex md:mb-5">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Find what you're looking for
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Filter our furniture collection.
                                    </p>
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>

                            <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        Refine your search
                                    </h2>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Choose one or more filters.
                                    </p>
                                </div>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="shrink-0 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                                {/* Category */}
                                <div>
                                    <label
                                        htmlFor="category"
                                        className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm"
                                    >
                                        Category
                                    </label>

                                    <select
                                        id="category"
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="">
                                            All categories
                                        </option>

                                        {productCategoryOptions.map(
                                            (category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                {/* Type */}
                                <div>
                                    <label
                                        htmlFor="type"
                                        className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm"
                                    >
                                        Type
                                    </label>

                                    <select
                                        id="type"
                                        name="type"
                                        value={filters.type}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                                        className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm"
                                    >
                                        Material
                                    </label>

                                    <select
                                        id="material"
                                        name="material"
                                        value={filters.material}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="">
                                            All materials
                                        </option>

                                        {productMaterialOptions.map(
                                            (material) => (
                                                <option
                                                    key={material}
                                                    value={material}
                                                >
                                                    {material}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3 sm:mt-5 sm:gap-2 sm:pt-4">
                                    <span className="mr-1 text-xs text-gray-500 sm:text-sm">
                                        Active:
                                    </span>

                                    {filters.category && (
                                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 sm:px-3 sm:text-xs">
                                            {filters.category}
                                        </span>
                                    )}

                                    {filters.type && (
                                        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-700 sm:px-3 sm:text-xs">
                                            {filters.type}
                                        </span>
                                    )}

                                    {filters.material && (
                                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 sm:px-3 sm:text-xs">
                                            {filters.material}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Empty states */}
                {products.length === 0 ? (
                    <div className="rounded-xl bg-white px-4 py-12 text-center shadow-sm sm:rounded-2xl sm:px-6 sm:py-16">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
                            <svg
                                className="h-7 w-7 text-gray-400 sm:h-8 sm:w-8"
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

                        <h2 className="mt-4 text-lg font-semibold text-gray-900 sm:mt-5 sm:text-xl">
                            No products available
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Check back later for new furniture.
                        </p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="rounded-xl bg-white px-4 py-12 text-center shadow-sm sm:rounded-2xl sm:px-6 sm:py-16">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16">
                            <svg
                                className="h-7 w-7 text-gray-400 sm:h-8 sm:w-8"
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

                        <h2 className="mt-4 text-lg font-semibold text-gray-900 sm:mt-5 sm:text-xl">
                            No products found
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Try adjusting your filters to find more products.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:mt-6"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    /* Category sections */
                    <div className="space-y-10 sm:space-y-14">
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
                                    <div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="h-7 w-1 rounded-full bg-blue-600 sm:h-8" />

                                                <h2 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                                                    {category}
                                                </h2>
                                            </div>

                                            <p className="mt-1.5 hidden pl-3 text-sm text-gray-500 sm:block">
                                                Explore our{" "}
                                                {category.toLowerCase()}{" "}
                                                furniture
                                            </p>
                                        </div>

                                        {/* View all */}
                                        {hasMoreProducts && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewAll(category)
                                                }
                                                className="group inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 sm:px-3 sm:py-2 sm:text-sm"
                                            >
                                                View all
                                                <svg
                                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
                                        )}
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
                                                    className="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl"
                                                >
                                                    {/* Product image */}
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
                                                                <div className="text-center">
                                                                    <svg
                                                                        className="mx-auto h-8 w-8 sm:h-12 sm:w-12"
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

                                                                    <p className="mt-1 hidden text-sm sm:mt-2 sm:block">
                                                                        No image
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Category */}
                                                        <span className="absolute left-2 top-2 max-w-[75%] truncate rounded-full bg-white/90 px-2 py-1 text-[9px] font-semibold text-gray-700 shadow-sm backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                                                            {product.category}
                                                        </span>

                                                        {/* Image count */}
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

                                                    {/* Product information */}
                                                    <div className="flex flex-1 flex-col p-3 sm:p-5">
                                                        <div className="mb-2 sm:mb-3">
                                                            <h3 className="line-clamp-2 min-h-[34px] text-sm font-bold leading-4 text-gray-900 sm:min-h-0 sm:text-lg sm:leading-6">
                                                                {
                                                                    product.name
                                                                }
                                                            </h3>

                                                            <p className="mt-1 truncate text-[11px] text-gray-500 sm:text-sm">
                                                                {product.type}
                                                            </p>
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

                                                        <div className="mb-3 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
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

                                                        {/* Add to cart */}
                                                        <button
                                                            type="button"
                                                            onClick={(event) =>
                                                                handleAddToCart(
                                                                    event,
                                                                    product
                                                                )
                                                            }
                                                            className="mt-auto flex min-h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 py-2 text-[11px] font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:min-h-0 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 7h13M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                                                                />
                                                            </svg>

                                                            <span className="truncate">
                                                                Add to Cart
                                                            </span>
                                                        </button>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>

                                    {/* Mobile-friendly bottom View All */}
                                    {hasMoreProducts && (
                                        <div className="mt-4 flex justify-center sm:hidden">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewAll(category)
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                            >
                                                View all{" "}
                                                {category.toLowerCase()}
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
        </div>
    );
};
