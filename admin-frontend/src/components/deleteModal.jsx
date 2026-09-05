import { useState } from "react";
import toast from "react-hot-toast";
import { productAPI } from "../api/productsApi";

export const DeleteModal = ({ id, onClose, onDeleted }) => {
    const [deleting, setDeleting] = useState(false);

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
                error?.response?.data?.message || "Failed to delete furniture"
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-center text-gray-900">
                    Delete Furniture
                </h2>

                <p className="mt-3 text-center text-gray-600">
                    Are you sure you want to delete this furniture? This action
                    cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting}
                        className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};