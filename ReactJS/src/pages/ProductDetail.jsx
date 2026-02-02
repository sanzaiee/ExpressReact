import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getBySlug(slug);
        // Backend returns { success: true, data: { product: {...} } }
        setProduct(response.data?.data?.product || response.data?.product || response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product.stock < quantity) {
      setError('Not enough stock available');
      return;
    }

    addToCart(product, quantity);
    setError('');
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error || 'Product not found'}</p>
        <Button onClick={() => navigate('/products')} className="mt-4">
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div>
        <img
          src={product.images[0] || 'https://via.placeholder.com/500'}
          alt={product.name}
          className="w-auto h-auto rounded-lg object-contain"
        />
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-3xl font-bold text-primary mb-4">
          {formatPrice(product.price)}
        </p>
        
        {product.description && (
          <p className="text-gray-600 mb-4">{product.description}</p>
        )}

        <div className="mb-4">
          {product.stock > 0 ? (
            <span className="text-green-600 font-semibold">
              In Stock ({product.stock} available)
            </span>
          ) : (
            <span className="text-red-600 font-semibold">Out of Stock</span>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {product.stock > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          variant="primary"
          className="w-full md:w-auto"
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
