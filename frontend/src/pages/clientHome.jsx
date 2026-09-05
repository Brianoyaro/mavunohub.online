import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../store/cartStore";

import { productAPI } from "../api/productsApi";

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
    const addToCart = useCartStore((state) => state.addToCart);

    const IMAGE_BASE_URL =  import.meta.env.VITE_APP_IMAGE_BASE_URL || "http://localhost:3000";

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const hasActiveFilters =
        filters.category ||
        filters.type ||
        filters.material;

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
     * Navigate to the product details page.
     */
    const handleCardClick = (id) => {
        navigate(`/products/${id}`);
    };

    /*
     * Add product to cart.
     *
     * This is currently local/client-side.
     * Replace this with your cart context/store/API later.
     */
    const handleAddToCart = (event, product) => {
        event.stopPropagation();

        console.log("Adding product to cart:", product);
        let quantity = 1;
        addToCart(product, quantity);

        toast.success(`${product.name} added to cart!`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
                        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-11 animate-pulse rounded-lg bg-gray-200"
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-xl bg-white shadow-sm"
                            >
                                <div className="h-56 animate-pulse bg-gray-200" />

                                <div className="space-y-3 p-5">
                                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                                    <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

                {/* ---------------------------------------- */}
                {/* Header */}
                {/* ---------------------------------------- */}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Discover Our Furniture
                    </h1>

                    <p className="mt-2 max-w-2xl text-gray-500">
                        Find the perfect furniture pieces for your home,
                        office, bedroom and outdoor spaces.
                    </p>
                </div>

                {/* ---------------------------------------- */}
                {/* Filters */}
                {/* ---------------------------------------- */}

                <div className="mb-10 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
                                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
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
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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

                    {/* Active filters */}
                    {hasActiveFilters && (
                        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                            <span className="mr-1 text-sm text-gray-500">
                                Filters:
                            </span>

                            {filters.category && (
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    {filters.category}
                                </span>
                            )}

                            {filters.type && (
                                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                                    {filters.type}
                                </span>
                            )}

                            {filters.material && (
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    {filters.material}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ---------------------------------------- */}
                {/* No products */}
                {/* ---------------------------------------- */}

                {products.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
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
                            No products available
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Check back later for new furniture.
                        </p>
                    </div>
                ) : filteredProducts.length === 0 ? (

                    /* ---------------------------------------- */
                    /* No filter results */
                    /* ---------------------------------------- */

                    <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
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
                            No products found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Try adjusting your filters to find more products.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
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
                                    <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-3">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {category}
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Explore our {category.toLowerCase()}{" "}
                                                furniture
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                                            {categoryProducts.length}{" "}
                                            {categoryProducts.length === 1
                                                ? "product"
                                                : "products"}
                                        </span>
                                    </div>

                                    {/* Product grid */}
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
                                                    className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                                >
                                                    {/* Product image */}
                                                    <div className="relative h-60 overflow-hidden bg-gray-100">
                                                        {firstImageUrl ? (
                                                            <img
                                                                src={getImageUrl(
                                                                    firstImageUrl
                                                                )}
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
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

                                                        {/* Category */}
                                                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur">
                                                            {product.category}
                                                        </span>

                                                        {/* Image count */}
                                                        {product.images?.length >
                                                            1 && (
                                                            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
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
                                                    <div className="flex flex-1 flex-col p-5">
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

                                                        <p className="mb-5 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-600">
                                                            {
                                                                product.description
                                                            }
                                                        </p>

                                                        {/* Price + material */}
                                                        <div className="mb-5 flex items-center justify-between">
                                                            <span className="text-xl font-bold text-gray-900">
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

                                                        {/* Add to cart */}
                                                        <button
                                                            type="button"
                                                            onClick={(event) =>
                                                                handleAddToCart(
                                                                    event,
                                                                    product
                                                                )
                                                            }
                                                            className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
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
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};