import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import { productAPI } from '../api/productsApi';

const productCategoryOptions = [
    'Home',
    'Office',
    'Outdoor',
    'Bedroom',
    'Living Room',
];

const productTypeOptions = [
    'Bed',
    'Sofas',
    'Dining Set',
    'Dining Table',
    'Dining Chair',
    'Home Other',
    'Office Chair',
    'Boardroom Table',
    'Workstation',
    'Office Sofa',
    'Office Desk',
    'Office Other',
];

const productMaterialOptions = [
    'Wood',
    'Metal',
    'Plastic',
    'Glass',
    'Fabric',
];

// --------------------------------------------------
// Zod schema
// --------------------------------------------------

const furnitureSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required'),

    description: z
        .string()
        .trim()
        .min(1, 'Description is required'),

    price: z
        .coerce
        .number({
            invalid_type_error: 'Price must be a number',
        })
        .positive('Price must be greater than 0'),

    category: z
        .string()
        .min(1, 'Please select a category')
        .refine(
            (value) => productCategoryOptions.includes(value),
            'Invalid category'
        ),

    type: z
        .string()
        .min(1, 'Please select a type')
        .refine(
            (value) => productTypeOptions.includes(value),
            'Invalid type'
        ),

    material: z
        .string()
        .min(1, 'Please select a material')
        .refine(
            (value) => productMaterialOptions.includes(value),
            'Invalid material'
        ),

    // Files are handled separately from the normal form fields.
    images: z.any().optional(),
});

const defaultValues = {
    name: '',
    description: '',
    price: '',
    category: '',
    type: '',
    material: '',
    images: [],
};

const FurnitureForm = ({ formType = 'create' }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [imagesToKeep, setImagesToKeep] = useState([]);
    const [isLoadingProduct, setIsLoadingProduct] = useState(
        formType === 'update'
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

    const images = watch('images') || [];

    // --------------------------------------------------
    // Fetch existing product when editing
    // --------------------------------------------------

    useEffect(() => {
        if (formType !== 'update' || !id) {
            setIsLoadingProduct(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                setIsLoadingProduct(true);

                const response = await productAPI.getProduct(id);
                const product = response.data;

                console.log('Fetched product data:', product);

                // Populate the form with the existing product data.
                reset({
                    name: product.name ?? '',
                    description: product.description ?? '',
                    price: product.price ?? '',
                    category: product.category ?? '',
                    type: product.type ?? '',
                    material: product.material ?? '',
                    images: [],
                });

                // Existing image URLs are kept separately because
                // they aren't File objects.
                setImagesToKeep(product.images || []);
            } catch (error) {
                console.error('Error fetching product data:', error);
                toast.error('Unable to load product.');

                navigate('/');
            } finally {
                setIsLoadingProduct(false);
            }
        };

        fetchProduct();
    }, [formType, id, reset, navigate]);

    // --------------------------------------------------
    // New image previews
    // --------------------------------------------------

    const imagePreviews = useMemo(() => {
        return images.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
    }, [images]);

    // Revoke object URLs when previews change/unmount.
    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
            });
        };
    }, [imagePreviews]);

    // --------------------------------------------------
    // Existing image handlers
    // --------------------------------------------------

    const handleRemoveImageToKeep = (imgUrl) => {
        setImagesToKeep((previousImages) =>
            previousImages.filter((url) => url !== imgUrl)
        );
    };

    // --------------------------------------------------
    // New image handlers
    // --------------------------------------------------

    const handleImageChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);

        if (!selectedFiles.length) {
            return;
        }

        const currentImages = watch('images') || [];

        setValue(
            'images',
            [...currentImages, ...selectedFiles],
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        // Allows selecting the same file again after removing it.
        event.target.value = '';
    };

    const handleRemoveNewImage = (indexToRemove) => {
        const currentImages = watch('images') || [];

        const updatedImages = currentImages.filter(
            (_, index) => index !== indexToRemove
        );

        setValue('images', updatedImages, {
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

            if (formType === 'create') {
                console.log(
                    'Creating product:',
                    productData,
                    'Images:',
                    newImages
                );

                const response = await productAPI.createProduct(
                    productData,
                    newImages
                );

                console.log('Product created:', response.data);

                toast.success('Product created successfully!');

                setTimeout(() => {
                    navigate('/');
                }, 1000);

                return;
            }

            if (formType === 'update') {
                console.log(
                    'Updating product:',
                    productData,
                    'New images:',
                    newImages,
                    'Images to keep:',
                    imagesToKeep
                );

                const response = await productAPI.updateProduct(
                    id,
                    productData,
                    newImages,
                    imagesToKeep
                );

                console.log('Product updated:', response.data);

                toast.success('Product updated successfully!');

                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            console.error(
                `Error ${formType === 'create' ? 'creating' : 'updating'} product:`,
                error
            );

            toast.error(
                `Error ${
                    formType === 'create' ? 'creating' : 'updating'
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
            <div className="max-w-md mx-auto mt-10 p-6 text-center">
                <p className="text-gray-600">Loading product...</p>
            </div>
        );
    }

    // --------------------------------------------------
    // Form
    // --------------------------------------------------

    return (
        <form
            className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h2 className="text-2xl font-bold mb-6">
                {formType === 'update'
                    ? 'Update Furniture'
                    : 'Create Furniture'}
            </h2>

            {/* Name */}
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                >
                    Name
                </label>

                <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.name ? 'border-red-500' : ''
                    }`}
                />

                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    rows="4"
                    {...register('description')}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.description ? 'border-red-500' : ''
                    }`}
                />

                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Price */}
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="price"
                >
                    Price
                </label>

                <input
                    type="number"
                    id="price"
                    step="0.01"
                    {...register('price')}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.price ? 'border-red-500' : ''
                    }`}
                />

                {errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.price.message}
                    </p>
                )}
            </div>

            {/* Category */}
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="category"
                >
                    Category
                </label>

                <select
                    id="category"
                    {...register('category')}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.category ? 'border-red-500' : ''
                    }`}
                >
                    <option value="">Select a category</option>

                    {productCategoryOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.category.message}
                    </p>
                )}
            </div>

            {/* Type */}
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="type"
                >
                    Type
                </label>

                <select
                    id="type"
                    {...register('type')}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.type ? 'border-red-500' : ''
                    }`}
                >
                    <option value="">Select a type</option>

                    {productTypeOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                {errors.type && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.type.message}
                    </p>
                )}
            </div>

            {/* Material */}
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="material"
                >
                    Material
                </label>

                <select
                    id="material"
                    {...register('material')}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                        errors.material ? 'border-red-500' : ''
                    }`}
                >
                    <option value="">Select a material</option>

                    {productMaterialOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                {errors.material && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.material.message}
                    </p>
                )}
            </div>

            {/* Existing Images */}
            {formType === 'update' && (
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Existing Images
                    </label>

                    {imagesToKeep.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                            No existing images.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {imagesToKeep.map((imgUrl, index) => (
                                <div
                                    key={`${imgUrl}-${index}`}
                                    className="relative inline-block"
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Existing ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveImageToKeep(imgUrl)
                                        }
                                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                        aria-label={`Remove existing image ${
                                            index + 1
                                        }`}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* File Input */}
            <div className="mb-4">
                <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="images"
                >
                    Add Images
                </label>

                <input
                    type="file"
                    id="images"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

                {errors.images && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.images.message}
                    </p>
                )}
            </div>

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        New Images
                    </label>

                    <div className="flex flex-wrap gap-2">
                        {imagePreviews.map((preview, index) => (
                            <div
                                key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                                className="relative inline-block"
                            >
                                <img
                                    src={preview.url}
                                    alt={`New preview ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveNewImage(index)
                                    }
                                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                    aria-label={`Remove new image ${
                                        index + 1
                                    }`}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-700'
                }`}
            >
                {isSubmitting
                    ? 'Submitting...'
                    : formType === 'update'
                    ? 'Update Furniture'
                    : 'Create Furniture'}
            </button>
        </form>
    );
};

export default FurnitureForm;