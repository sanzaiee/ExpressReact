import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b">
      <Link to={`/products/${item.slug}`} className="flex-shrink-0">
        <img
          src={item.images[0] || 'https://via.placeholder.com/100'}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
      </Link>
      <div className="flex-grow">
        <Link to={`/products/${item.slug}`}>
          <h3 className="font-semibold text-lg hover:text-primary">{item.name}</h3>
        </Link>
        <p className="text-primary font-bold">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="p-2 hover:bg-gray-100"
          >
            <FiMinus />
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="p-2 hover:bg-gray-100"
            disabled={item.quantity >= item.stock}
          >
            <FiPlus />
          </button>
        </div>
        <p className="font-bold min-w-[5rem] text-right">
          {formatPrice(item.price * item.quantity)}
        </p>
        <button
          onClick={() => removeFromCart(item._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
