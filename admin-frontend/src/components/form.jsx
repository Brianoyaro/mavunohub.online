import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
    productCategoryOptions,
    productTypeOptions,
    productMaterialOptions,
} from "./configs";

import { productAPI } from "../api/productsApi";

const furnitureSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),

    description: z.string().trim().min(1, "Description is required"),

    price: z.coerce
        .number({
            invalid_type_error: "Price must be a number",
        })
        .positive("Price must be greater than 0"),

    category: z
        .string()
        .min(1, "Please select a category")
        .refine(
            (value) => productCategoryOptions.includes(value),
            "Invalid category"
        ),

    type: z
        .string()
        .min(1, "Please select a type")
        .refine(
            (value) => productTypeOptions.includes(value),
            "Invalid type"
        ),

    material: z
        .string()
        .min(1, "Please select a material")
        .refine(
            (value) => productMaterialOptions.includes(value),
            "Invalid material"
        ),

    images: z.any().optional(),
});

const defaultValues = {
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
    material: "",
    images: [],
};

const inputBaseClass =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:ring-4";

const FurnitureForm = ({ formType = "create" }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const IMAGE_BASE_URL =
        import.meta.env.VITE_APP_IMAGE_BASE_URL || "http://localhost:3000";

    const [imagesToKeep, setImagesToKeep] = useState([]);
    const [isLoadingProduct, setIsLoadingProduct] = useState(
        formType === "update"
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(furnitureSchema),
        defaultValues,
    });

    const images = watch("images") || [];

    const isUpdate = formType === "update";

    const pageTitle = isUpdate ? "Update furniture" : "Add new furniture";

    const pageDescription = isUpdate
        ? "Update the details, pricing and images for this product."
        : "Add a new piece of furniture to your catalogue.";

    const submitLabel = isSubmitting
        ? isUpdate
            ? "Updating product..."
            : "Creating product..."
        : isUpdate
        ? "Update product"
        : "Create product";

    // --------------------------------------------------
    // Fetch existing product
    // --------------------------------------------------

    useEffect(() => {
        if (!isUpdate || !id) {
            setIsLoadingProduct(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                setIsLoadingProduct(true);

                const response = await productAPI.getProduct(id);
                const product = response.data;

                reset({
                    name: product.name ?? "",
                    description: product.description ?? "",
                    price: product.price ?? "",
                    category: product.category ?? "",
                    type: product.type ?? "",
                    material: product.material ?? "",
                    images: [],
                });

                setImagesToKeep(product.images || []);
            } catch (error) {
                console.error("Error fetching product data:", error);
                toast.error("Unable to load product.");
                navigate("/");
            } finally {
                setIsLoadingProduct(false);
            }
        };

        fetchProduct();
    }, [isUpdate, id, reset, navigate]);

    // --------------------------------------------------
    // Image helpers
    // --------------------------------------------------

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            return null;
        }

        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${IMAGE_BASE_URL}${imageUrl}`;
    };

    const imagePreviews = useMemo(() => {
        return images.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
    }, [images]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
            });
        };
    }, [imagePreviews]);

    const handleRemoveImageToKeep = (image) => {
        setImagesToKeep((previousImages) =>
            previousImages.filter((item) => item !== image)
        );
    };

    const handleImageChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);

        if (!selectedFiles.length) {
            return;
        }

        const currentImages = watch("images") || [];

        setValue("images", [...currentImages, ...selectedFiles], {
            shouldDirty: true,
            shouldValidate: true,
        });

        event.target.value = "";
    };

    const handleRemoveNewImage = (indexToRemove) => {
        const currentImages = watch("images") || [];

        const updatedImages = currentImages.filter(
            (_, index) => index !== indexToRemove
        );

        setValue("images", updatedImages, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    // --------------------------------------------------
    // Submit
    // --------------------------------------------------

    const onSubmit = async (formData) => {
        try {
            setIsSubmitting(true);

            const {
                images: newImages = [],
                ...productData
            } = formData;

            if (!isUpdate) {
                await productAPI.createProduct(
                    productData,
                    newImages
                );

                toast.success("Product created successfully!");

                setTimeout(() => {
                    navigate("/");
                }, 800);

                return;
            }

            await productAPI.updateProduct(
                id,
                productData,
                newImages,
                imagesToKeep
            );

            toast.success("Product updated successfully!");

            setTimeout(() => {
                navigate("/");
            }, 800);
        } catch (error) {
            console.error(
                `Error ${isUpdate ? "updating" : "creating"} product:`,
                error
            );

            toast.error(
                `Unable to ${
                    isUpdate ? "update" : "create"
                } product. Please try again.`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // --------------------------------------------------
    // Loading state
    // --------------------------------------------------

    if (isLoadingProduct) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <div className="animate-pulse">
                        <div className="h-4 w-24 rounded bg-gray-200" />
                        <div className="mt-4 h-9 w-72 rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-96 max-w-full rounded bg-gray-200" />

                        <div className="mt-8 grid gap-6 lg:grid-cols-3">
                            <div className="h-[500px] rounded-2xl bg-gray-200 lg:col-span-2" />
                            <div className="h-[500px] rounded-2xl bg-gray-200" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-blue-600"
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
                        Back
                    </button>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                {isUpdate
                                    ? "Product management"
                                    : "New product"}
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                {pageTitle}
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                                {pageDescription}
                            </p>
                        </div>

                        <div className="hidden rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:block">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Required fields
                            </p>

                            <p className="mt-1 text-sm font-semibold text-gray-700">
                                All fields marked with{" "}
                                <span className="text-red-500">*</span>
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* -------------------------------- */}
                        {/* Main information */}
                        {/* -------------------------------- */}

                        <div className="space-y-6 lg:col-span-2">

                            {/* Basic information */}
                            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 px-5 py-5 sm:px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.8}
                                                    d="M4 6h16M4 12h16M4 18h10"
                                                />
                                            </svg>
                                        </div>

                                        <div>
                                            <h2 className="font-bold text-gray-900">
                                                Product information
                                            </h2>

                                            <p className="text-xs text-gray-500">
                                                Tell customers about this
                                                furniture piece.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5 p-5 sm:p-6">

                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Product name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="e.g. Modern Oak Dining Table"
                                            {...register("name")}
                                            className={`${inputBaseClass} ${
                                                errors.name
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10"
                                            }`}
                                        />

                                        {errors.name && (
                                            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                <span>⚠</span>
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label
                                                htmlFor="description"
                                                className="block text-sm font-semibold text-gray-700"
                                            >
                                                Description{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>

                                            <span className="text-xs text-gray-400">
                                                Describe the product clearly
                                            </span>
                                        </div>

                                        <textarea
                                            id="description"
                                            rows={6}
                                            placeholder="Describe the furniture, its features, style, dimensions, ideal use, and anything else customers should know..."
                                            {...register("description")}
                                            className={`${inputBaseClass} resize-y leading-6 ${
                                                errors.description
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10"
                                            }`}
                                        />

                                        {errors.description && (
                                            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                <span>⚠</span>
                                                {errors.description.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Price{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-bold text-gray-400">
                                                KSh
                                            </span>

                                            <input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                {...register("price")}
                                                className={`${inputBaseClass} pl-14 ${
                                                    errors.price
                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10"
                                                }`}
                                            />
                                        </div>

                                        {errors.price && (
                                            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                                                <span>⚠</span>
                                                {errors.price.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Classification */}
                            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 px-5 py-5 sm:px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.8}
                                                    d="M7 7h.01M7 3h5l9 9-5 5-9-9V3zM3 7h.01"
                                                />
                                            </svg>
                                        </div>

                                        <div>
                                            <h2 className="font-bold text-gray-900">
                                                Product classification
                                            </h2>

                                            <p className="text-xs text-gray-500">
                                                Help customers discover this
                                                product.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-5 p-5 sm:grid-cols-3 sm:p-6">

                                    {/* Category */}
                                    <div>
                                        <label
                                            htmlFor="category"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Category{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            id="category"
                                            {...register("category")}
                                            className={`${inputBaseClass} ${
                                                errors.category
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10"
                                            }`}
                                        >
                                            <option value="">
                                                Select category
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

                                        {errors.category && (
                                            <p className="mt-2 text-xs font-medium text-red-600">
                                                {errors.category.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <label
                                            htmlFor="type"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Type{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            id="type"
                                            {...register("type")}
                                            className={`${inputBaseClass} ${
                                                errors.type
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10"
                                            }`}
                                        >
                                            <option value="">
                                                Select type
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

                                        {errors.type && (
                                            <p className="mt-2 text-xs font-medium text-red-600">
                                                {errors.type.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Material */}
                                    <div>
                                        <label
                                            htmlFor="material"
                                            className="mb-2 block text-sm font-semibold text-gray-700"
                                        >
                                            Material{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            id="material"
                                            {...register("material")}
                                            className={`${inputBaseClass} ${
                                                errors.material
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                                                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/10"
                                            }`}
                                        >
                                            <option value="">
                                                Select material
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

                                        {errors.material && (
                                            <p className="mt-2 text-xs font-medium text-red-600">
                                                {errors.material.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* -------------------------------- */}
                        {/* Images sidebar */}
                        {/* -------------------------------- */}

                        <div className="space-y-6">

                            {/* Existing images */}
                            {isUpdate && (
                                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                    <div className="border-b border-gray-100 px-5 py-5">
                                        <h2 className="font-bold text-gray-900">
                                            Current images
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Remove any images you no longer
                                            want to keep.
                                        </p>
                                    </div>

                                    <div className="p-5">
                                        {imagesToKeep.length === 0 ? (
                                            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                                                <p className="text-sm font-medium text-gray-500">
                                                    No current images
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-3">
                                                {imagesToKeep.map(
                                                    (image, index) => (
                                                        <div
                                                            key={`${image}-${index}`}
                                                            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                                                        >
                                                            <img
                                                                src={getImageUrl(
                                                                    image.imageUrl
                                                                )}
                                                                alt={`Current ${
                                                                    index + 1
                                                                }`}
                                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                            />

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveImageToKeep(
                                                                        image
                                                                    )
                                                                }
                                                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg leading-none text-white shadow-lg transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                                aria-label={`Remove current image ${
                                                                    index + 1
                                                                }`}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Upload */}
                            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="border-b border-gray-100 px-5 py-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="font-bold text-gray-900">
                                                Product images
                                            </h2>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Add high-quality photos of the
                                                furniture.
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                                            {images.length} new
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">

                                    {/* Upload dropzone */}
                                    <label
                                        htmlFor="images"
                                        className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition group-hover:scale-105">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.8}
                                                    d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                                                />
                                            </svg>
                                        </div>

                                        <span className="mt-4 text-sm font-bold text-gray-700">
                                            Click to upload images
                                        </span>

                                        <span className="mt-1 text-xs text-gray-400">
                                            PNG, JPG, JPEG or WEBP
                                        </span>

                                        <span className="mt-3 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">
                                            Choose files
                                        </span>
                                    </label>

                                    <input
                                        id="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    {errors.images && (
                                        <p className="mt-2 text-xs font-medium text-red-600">
                                            {errors.images.message}
                                        </p>
                                    )}

                                    {/* New previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <h3 className="text-sm font-bold text-gray-800">
                                                    New images
                                                </h3>

                                                <span className="text-xs text-gray-400">
                                                    {imagePreviews.length}{" "}
                                                    selected
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {imagePreviews.map(
                                                    (preview, index) => (
                                                        <div
                                                            key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                                                            className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                                                        >
                                                            <img
                                                                src={
                                                                    preview.url
                                                                }
                                                                alt={`New preview ${
                                                                    index + 1
                                                                }`}
                                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                            />

                                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-8">
                                                                <p className="truncate text-[10px] font-medium text-white">
                                                                    {
                                                                        preview
                                                                            .file
                                                                            .name
                                                                    }
                                                                </p>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveNewImage(
                                                                        index
                                                                    )
                                                                }
                                                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg leading-none text-white shadow-lg transition hover:bg-red-700"
                                                                aria-label={`Remove new image ${
                                                                    index + 1
                                                                }`}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* -------------------------------- */}
                    {/* Submit bar */}
                    {/* -------------------------------- */}

                    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div>
                                <p className="text-sm font-bold text-gray-900">
                                    {isUpdate
                                        ? "Ready to save your changes?"
                                        : "Ready to add this product?"}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Make sure all product information is
                                    correct before continuing.
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={isSubmitting}
                                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-400"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            {submitLabel}
                                        </>
                                    ) : (
                                        <>
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
                                                    d="M5 12l4 4L19 6"
                                                />
                                            </svg>

                                            {submitLabel}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FurnitureForm;