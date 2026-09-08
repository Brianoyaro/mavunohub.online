const formatPrice = (price) =>
    Number(price).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export const WhatsAppButton = ({ product, quantity = 1, className = "" }) => {

    const baseUrl = `https://mavunohub.online`

    const handleWhatsApp = (event) => {
        event.stopPropagation();

        const itemTotal = Number(product.price) * quantity;
        const productUrl = `${baseUrl}/${product.id}`
        const productDetails = [
            `Product: ${product.name}`,
            `Type: ${product.type || "N/A"}`,
            product.material ? `Material: ${product.material}` : null,
            `Quantity: ${quantity}`,
            `Product Preview: ${productUrl}`,
            `Unit Price: ${formatPrice(product.price)}`,
            `Item Total: ${formatPrice(itemTotal)}`,
        ]
            .filter(Boolean)
            .join("\n");

        const message = [
            "Hello, I am interested in this product.",
            "",
            "PRODUCT DETAILS",
            "--------------------",
            productDetails,
            "",
            "Please let me know the next steps.",
        ].join("\n");

        const phoneNumber =
            import.meta.env.VITE_APP_WHATSAPP_NUMBER || "254722474626";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            message
        )}`;

        window.open(whatsappUrl, "_blank");
    };

    return (
        <button
            type="button"
            onClick={handleWhatsApp}
            className={`flex min-h-10 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-green-600 px-2 py-2 text-[11px] font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${className}`}
        >
            <svg
                className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.075-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.001-5.45 4.436-9.884 9.893-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.891 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.478-8.413" />
            </svg>

            WhatsApp
        </button>
    );
};