import { Link } from "react-router-dom";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: "Facebook",
            href: import.meta.env.VITE_APP_FACEBOOK_URL,
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.4-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.2z" />
                </svg>
            ),
        },

        {
            name: "Instagram",
            href: import.meta.env.VITE_APP_INSTAGRAM_URL,
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="5"
                        strokeWidth="2"
                    />

                    <circle
                        cx="12"
                        cy="12"
                        r="4"
                        strokeWidth="2"
                    />

                    <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        fill="currentColor"
                        stroke="none"
                    />
                </svg>
            ),
        },

        {
            name: "TikTok",
            href: import.meta.env.VITE_APP_TIKTOK_URL,
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M15.5 3c.3 1.8 1.3 3.1 3.1 3.7v3.1c-1.1-.1-2.1-.4-3.1-.9v5.7c0 3.5-2.4 5.6-5.5 5.6-3 0-5.2-2-5.2-4.8 0-3.1 2.6-5 5.9-4.8v3.1c-1.5-.2-2.7.4-2.7 1.7 0 .9.7 1.6 1.8 1.6 1.2 0 2.5-.8 2.5-2.8V3h3.2z" />
                </svg>
            ),
        },

        {
            name: "WhatsApp",
            href: `https://wa.me/${import.meta.env.VITE_APP_WHATSAPP_NUMBER}`,
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 11.5a8 8 0 01-11.8 7L4 20l1.5-4.1A8 8 0 1120 11.5z"
                    />

                    <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        d="M9 8.5c.2-.4.5-.4.8-.1l1 1.2c.2.2.2.5 0 .8l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.3-.2.6-.2.8 0l1.2 1c.3.3.3.6-.1.8-.5.3-1.1.4-1.7.2-2.7-.9-4.8-3-5.7-5.7-.2-.6-.1-1.2.2-1.7z"
                    />
                </svg>
            ),
        },

        {
            name: "Twitter / X",
            href: import.meta.env.VITE_APP_TWITTER_URL,
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231h.001zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
            ),
        },

        {
            name: "Pinterest",
            href: import.meta.env.VITE_APP_PINTEREST_URL,
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M12 2.25a9.75 9.75 0 00-3.55 18.83c-.08-1.6-.01-3.53.4-5.36l1.05-4.43s-.27-.55-.27-1.37c0-1.28.74-2.24 1.66-2.24.78 0 1.16.59 1.16 1.3 0 .79-.5 1.97-.76 3.07-.22.92.46 1.67 1.37 1.67 1.64 0 2.74-1.73 2.74-4.24 0-2.21-1.59-3.76-3.86-3.76-2.63 0-4.17 1.97-4.17 4.01 0 .8.31 1.65.69 2.11.08.1.09.19.07.29l-.26 1.08c-.04.17-.14.2-.32.12-1.18-.55-1.91-2.28-1.91-3.67 0-2.99 2.17-5.73 6.25-5.73 3.28 0 5.83 2.34 5.83 5.46 0 3.26-2.06 5.89-4.92 5.89-.96 0-1.86-.5-2.17-1.09l-.59 2.24c-.21.81-.77 1.82-1.15 2.44.87.27 1.78.41 2.73.41A9.75 9.75 0 0012 2.25z" />
                </svg>
            ),
        },
    ];

    return (
        <footer className="mt-auto border-t border-gray-200 bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* Main footer */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="sm:col-span-2">
                        <Link
                            to="/"
                            className="inline-block text-xl font-extrabold tracking-tight text-white transition hover:text-blue-400"
                        >
                            mavunohub
                        </Link>

                        <p className="mt-3 max-w-md text-sm leading-6 text-gray-400">
                            Quality furniture for your home, office, bedroom,
                            living spaces and outdoor areas.
                        </p>

                        {/* Socials */}
                        <div className="mt-6">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                                Follow Us
                            </h2>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Follow mavunohub on ${social.name}`}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Quick Links
                        </h2>

                        <ul className="mt-4 space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-gray-400 transition hover:text-white"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/"
                                    className="text-sm text-gray-400 transition hover:text-white"
                                >
                                    Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/cart"
                                    className="text-sm text-gray-400 transition hover:text-white"
                                >
                                    Shopping Cart
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                            Categories
                        </h2>

                        <ul className="mt-4 space-y-3">
                            <li className="text-sm text-gray-400">
                                Home Furniture
                            </li>

                            <li className="text-sm text-gray-400">
                                Office Furniture
                            </li>

                            <li className="text-sm text-gray-400">
                                Bedroom Furniture
                            </li>

                            <li className="text-sm text-gray-400">
                                Outdoor Furniture
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="my-8 border-t border-gray-800" />

                {/* Bottom */}
                <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
                    <p className="text-xs text-gray-500 sm:text-sm">
                        © {currentYear} mavunohub. All rights reserved.
                    </p>

                    <p className="text-xs text-gray-500 sm:text-sm">
                        Quality furniture for every space.
                    </p>
                </div>
            </div>
        </footer>
    );
};