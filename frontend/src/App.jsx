import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Home } from './pages/clientHome';
import { NavBar } from './components/navbar';
import { Footer } from './components/footer';
import { ProductDetail } from './pages/clientProductDetail';
import { Cart } from "./pages/cartView";


// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

// layout component for the app
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="container mx-auto p-4">
        {children}<Outlet />
      </main>
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
      </Routes>
    </Router>
  );
};


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;