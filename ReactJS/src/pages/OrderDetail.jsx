import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/helpers';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import OrderSummary from '../components/order/OrderSummary';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Normalize order shape coming from backend (products/totalAmount)
  const normalizeOrder = (orderData) => {
    if (!orderData) return orderData;

    const items = orderData.items || orderData.products || [];
    const subtotal =
      orderData.subtotal ??
      (orderData.totalAmount !== undefined && orderData.totalAmount !== null
        ? Number(orderData.totalAmount)
        : orderData.total ?? 0);
    const shipping = orderData.shipping ?? 0;
    const total =
      orderData.total ??
      (typeof subtotal === 'number' && typeof shipping === 'number'
        ? subtotal + shipping
        : subtotal);

    return {
      ...orderData,
      items,
      subtotal,
      shipping,
      total,
    };
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getOrder(id);
        // Backend returns { success: true, data: { order: {...} } }
        const rawOrder = response.data?.data?.order || response.data?.order || response.data;
        setOrder(normalizeOrder(rawOrder));
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      await orderAPI.cancelOrder(id);
      const response = await orderAPI.getOrder(id);
      // Backend returns { success: true, data: { order: {...} } }
      const rawOrder = response.data?.data?.order || response.data?.order || response.data;
      setOrder(normalizeOrder(rawOrder));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Order not found</p>
        <Button onClick={() => navigate('/orders')} className="mt-4">
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div>
      {location.state?.orderPlaced && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Order placed successfully!
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <Button onClick={() => navigate('/orders')} variant="outline">
          Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 border-b pb-4">
                  <img
                    src={item.product?.images || 'https://via.placeholder.com/80'}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.product?.name || 'Product'}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Address:</span> {order.shippingAddress}</p>
              {order.phone && (
                <p><span className="font-semibold">Phone:</span> {order.phone}</p>
              )}
              <p><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
              <p><span className="font-semibold">Order Date:</span> {formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummary order={order} />
          {order.status === 'pending' && (
            <Button
              onClick={handleCancel}
              variant="danger"
              className="w-full mt-4"
              disabled={cancelling}
            >
              {cancelling ? <Loader size="sm" /> : 'Cancel Order'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
