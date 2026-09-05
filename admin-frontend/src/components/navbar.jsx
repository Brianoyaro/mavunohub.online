export const NavBar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-lg font-bold">Admin Dashboard</h1>
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="text-white hover:text-gray-300">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/create" className="text-white hover:text-gray-300">
                            Create Furniture
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};