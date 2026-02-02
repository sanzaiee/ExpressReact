import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { productAPI, categoryAPI, orderAPI } from "../../services/api";

const Index = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
            const [categoriesResponse, productsResponse, ordersResponse] = await Promise.all([
                categoryAPI.getAll(),
                productAPI.getAll(),
                orderAPI.getAll()
            ]);
                setCategories(categoriesResponse.data.data.categories);
                setProducts(productsResponse.data.data.products);
                setOrders(ordersResponse.data.data.orders);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Total Categories</h2>
                    <p className="text-2xl font-bold text-primary">
                        {categories.length}
                    </p>

                    <Link to="/dashboard/category" className="text-primary hover:underline">View Categories</Link>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Total Products</h2>
                    <p className="text-2xl font-bold text-primary">
                        {products.length}
                    </p>

                    <Link to="/dashboard/product" className="text-primary hover:underline">View Products</Link>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Total Orders</h2>
                    <p className="text-2xl font-bold text-primary">
                        {orders.length}
                    </p>

                    <Link to="/dashboard/order" className="text-primary hover:underline">View Orders</Link>
                </div>
            </div>
        </div>
    );
};

export default Index;