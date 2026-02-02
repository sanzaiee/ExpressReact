import { useEffect, useState } from "react";
import { orderAPI } from "../../services/api";
import { FiChevronDown, FiTrash2 } from "react-icons/fi";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

const Order = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const response = await orderAPI.getAll();
            if (response.data.success) {
                setOrders(response.data.data.orders);
            } else {
                setError(response.data.message);
            }
            setLoading(false);
        }
        fetchOrders();
    }, []);

    const handleChangeStatus = async (id, status) => {
        const response = await orderAPI.updateOrderStatus(id, { status: status });
        if (response.data.success) {
            setOrders(orders.map((order) => order.id === id ? { ...order, status: status } : order));
        } else {
            console.error(response.data.message);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6"><Link to="/dashboard">Dashboard </Link> / <span className="text-primary hover:text-primary-dark"> Orders</span></h1>
            <div className="bg-white rounded-lg shadow-md p-6 w-full md:col-span-2"> 
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">List</h2>
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 p-2">Order ID</th>
                                <th className="border border-gray-300 p-2">User</th>
                                <th className="border border-gray-300 p-2">Total Amount</th>
                                <th className="border border-gray-300 p-2">Status</th>
                                <th className="border border-gray-300 p-2">Created At</th>
                                <th className="border border-gray-300 p-2">Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2">{index + 1}</td>
                                    <td className="border border-gray-300 p-2">{order.user?.name || 'N/A'}</td>
                                    <td className="border border-gray-300 p-2">{order.totalAmount}</td>
                                    <td className="border border-gray-300 p-2">
                                        <span className="text-sm font-medium text-gray-600 badge">{order.status}</span>
                                        <div className="flex flex-row gap-2 justify-end">
                                            <Button variant="primary" className="text-sm mr-2" onClick={() => handleChangeStatus(order.id, 'processing')}>
                                                Processing 
                                            </Button>
                                            <Button variant="primary" className="text-sm mr-2" onClick={() => handleChangeStatus(order.id, 'shipped')}>
                                                Shipped 
                                            </Button>
                                            <Button variant="primary" className="text-sm mr-2" onClick={() => handleChangeStatus(order.id, 'delivered')}>
                                                Delivered 
                                            </Button>
                                            <Button variant="primary" className="text-sm mr-2" onClick={() => handleChangeStatus(order.id, 'cancelled')}>
                                                Cancelled
                                            </Button>
                                        </div>
                                    </td>
                                    <td className="border border-gray-300 p-2">{order.createdAt}</td>
                                    <td className="border border-gray-300 p-2">{order.updatedAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Order;