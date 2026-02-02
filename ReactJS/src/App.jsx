import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Index from './pages/dashboard/Index';
import Category from './pages/dashboard/Category';
import Product from './pages/dashboard/Product';
import Order from './pages/dashboard/Order';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },

        {
          path: 'dashboard',
          element: (
            <AdminRoute>
              <Index />
            </AdminRoute>
          )
        },
        {
          path: 'dashboard/category',
          element: (
            <AdminRoute>
              <Category />
            </AdminRoute>
          )
        },
        {
          path: 'dashboard/product',
          element: (
            <AdminRoute>
              <Product />
            </AdminRoute>
          )
        },
        {
          path: 'dashboard/order',
          element: (
            <AdminRoute>
              <Order />
            </AdminRoute>
          )
        },

        { path: 'products', element: <Products /> },
        { path: 'products/:slug', element: <ProductDetail /> },
        {
          path: 'cart',
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          )
        },
        {
          path: 'checkout',
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          )
        },
        {
          path: 'orders',
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          )
        },
        {
          path: 'orders/:id',
          element: (
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          )
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )
        }
      ]
    }
  ],
  {
    future: {
      v7_startTransition: true
    }
  }
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
