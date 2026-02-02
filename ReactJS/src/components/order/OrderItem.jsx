import { Link } from 'react-router-dom';
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers';

const OrderItem = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <Link
            to={`/orders/${order.id || order._id}`}
            className="text-lg font-semibold text-primary hover:underline"
          >
            Order #{(order.id || order._id).toString().slice(-8)}
          </Link>
          <p className="text-gray-600 text-sm mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="mt-2 md:mt-0">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">
              {order.items?.length || 0} item(s)
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>
        <Link
          to={`/orders/${order.id || order._id}`}
          className="mt-4 inline-block text-primary hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default OrderItem;
