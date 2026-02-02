import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';

const CartSummary = () => {
  const { cartItems, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 10 : 0; // Example shipping cost
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-20">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>
      <Link to="/checkout" className="block">
        <Button className="w-full" variant="primary">
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
};

export default CartSummary;
