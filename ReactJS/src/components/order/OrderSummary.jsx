import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';

const OrderSummary = ({ order }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Order ID</span>
          <span className="font-mono text-sm">#{(order.id || order._id).toString().slice(-8)}</span>
        </div>
        <div className="flex justify-between">
          <span>Date</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>Status</span>
          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        <div className="border-t pt-2 mt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal || order.total)}</span>
          </div>
          {order.shipping && (
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
