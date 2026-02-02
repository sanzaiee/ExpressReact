import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import OrderItem from '../components/order/OrderItem';
import Loader from '../components/ui/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normalize order shape coming from backend (products/totalAmount)
  const normalizeOrder = (order) => {
    if (!order) return order;

    const items = order.items || order.products || [];
    const subtotal =
      order.subtotal ??
      (order.totalAmount !== undefined && order.totalAmount !== null
        ? Number(order.totalAmount)
        : order.total ?? 0);
    const shipping = order.shipping ?? 0;
    const total =
      order.total ??
      (typeof subtotal === 'number' && typeof shipping === 'number'
        ? subtotal + shipping
        : subtotal);

    return {
      ...order,
      items,
      subtotal,
      shipping,
      total,
    };
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getUserOrders();
        // Backend returns { success: true, data: { orders: [...], pagination: {...} } }
        const rawOrders = response.data?.data?.orders || response.data?.orders || [];
        const normalizedOrders = rawOrders.map(normalizeOrder);
        setOrders(normalizedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <OrderItem key={order.id || order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
