import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";

export const NavBar = () => {
    const cart = useCartStore((state) => state.cart);

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-lg font-bold text-white hover:text-gray-300"
                >
                    mavunohub
                </Link>

                {/* Navigation */}
                <ul className="flex items-center space-x-6">
                    <li>
                        <Link
                            to="/"
                            className="text-white hover:text-gray-300"
                        >
                            Home
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/"
                            className="text-white hover:text-gray-300"
                        >
                            Products
                        </Link>
                    </li>

                    <li>
                        <Link
                            to="/cart"
                            className="relative text-white hover:text-gray-300"
                        >
                            🛒 Cart

                            {cartCount > 0 && (
                                <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};
