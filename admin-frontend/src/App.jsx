import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Home } from './pages/home';
import { CreateFurniture } from './pages/createFurniture';
import { UpdateFurniture } from './pages/updateFurniture';
import { DeleteModal } from './components/deleteModal';
import  { NavBar } from './components/navbar';
import { ProductDetail } from './pages/productDetail';
import { ProductListView } from './pages/productListView';

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
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<ProductDetail />} />
          <Route path="/create" element={<CreateFurniture />} />
          <Route path="/update/:id" element={<UpdateFurniture />} />
          <Route path="/delete/:id" element={<DeleteModal />} />
          <Route path="/products" element={<ProductListView />} />
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