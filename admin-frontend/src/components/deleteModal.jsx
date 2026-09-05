import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { productAPI } from "../api/productsApi";

export const DeleteModal = ({ id, onClose, onDeleted }) => {
    const [deleting, setDeleting] = useState(false);
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        cancelButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !deleting) {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [deleting, onClose]);

    const handleDelete = async () => {
        try {
            setDeleting(true);

            await productAPI.deleteProduct(id);

            toast.success("Furniture deleted successfully");

            onDeleted?.();
            onClose?.();
        } catch (error) {
            console.error("Failed to delete furniture:", error);

            toast.error(
                error?.response?.data?.message ||
                    "Failed to delete furniture. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget && !deleting) {
            onClose?.();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 px-4 py-6 backdrop-blur-sm"
            role="presentation"
            onMouseDown={handleBackdropClick}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
                aria-describedby="delete-modal-description"
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
                onMouseDown={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="border-b border-gray-100 px-6 pb-5 pt-6 sm:px-7">
                    <div className="flex items-start gap-4">
                        
                        <div className="min-w-0 flex-1">
                            <h2
                                id="delete-modal-title"
                                className="text-xl font-bold tracking-tight text-gray-900"
                            >
                                Delete furniture?
                            </h2>

                            <p
                                id="delete-modal-description"
                                className="mt-1 text-sm leading-6 text-gray-500"
                            >
                                This action will permanently remove this
                                furniture item from your products.
                            </p>
                        </div>

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={deleting}
                            aria-label="Close delete dialog"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 6l12 12M18 6L6 18"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="w-full rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {deleting ? (
                            <>
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />

                                    <path
                                        className="opacity-90"
                                        fill="currentColor"
                                        d="M21 12a9 9 0 00-9-9v3a6 6 0 016 6h3z"
                                    />
                                </svg>

                                Deleting...
                            </>
                        ) : (
                            <>
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 7h12m-9 0V5a1 1 0 011-1h2a1 1 0 011 1v2m-6 0v12a2 2 0 002 2h4a2 2 0 002-2V7M10 11v6m4-6v6"
                                    />
                                </svg>

                                Delete Furniture
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

