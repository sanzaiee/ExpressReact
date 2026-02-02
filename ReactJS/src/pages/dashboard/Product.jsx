import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { categoryAPI, productAPI } from "../../services/api";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";

const Product = () => {

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [productId, setProductId] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('slug', slug);
            formData.append('description', description);
            formData.append('price', Number(price));
            formData.append('stock', Number(stock));
            formData.append('category', Number(category));
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (isEditing) {
                const response = await productAPI.update(productId, formData);
                if (response.data.success) {
                    setProducts((prev) => prev.map((product) => product.id === productId ? response.data.data.product : product));
                    setError('');
                    setName('');
                    setSlug('');
                    setDescription('');
                    setPrice('');
                    setStock('');
                    setImageFile(null);
                    setCategory('');
                } else {
                    setError(response.data.message || 'Failed to update product');
                }
                setIsEditing(false);
                setProductId('');
            } else {
                const response = await productAPI.create(formData);
                if (response.data.success) {
                    setProducts((prev) => [...prev, response.data.data.product]);
                    setError('');
                    setName('');
                    setSlug('');
                    setDescription('');
                    setPrice('');
                    setStock('');
                    setImageFile(null);
                    setCategory('');
                } else {
                    setError(response.data.message || 'Failed to create product');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await categoryAPI.getAll();
            if (response.data.success) {
                setCategories(response.data.data.categories);
            } else {
                setError(response.data.message || 'Failed to fetch categories');
            }
            setLoading(false);
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await productAPI.getAll();
            setProducts(response.data.data.products);
        }
        fetchProducts();
    }, []);

    const handleEdit = async (slug) => {
        const response = await productAPI.getBySlug(slug);
        if (response.data.success) {
            setName(response.data.data.product.name);
            setSlug(response.data.data.product.slug);
            setDescription(response.data.data.product.description);
            setPrice(response.data.data.product.price);
            setStock(response.data.data.product.stock);
            setImageFile(null);
            setCategory(response.data.data.product.category.id);
            setError('');
            setIsEditing(true);
            setProductId(response.data.data.product.id);
        }
        else {
            setError(response.data.message || 'Failed to edit product');
        }
        setLoading(false);
    }

    const handleDelete = async (id) => {
        setLoading(true);
        const response = await productAPI.delete(id);
        if (response.data.success) {
            setProducts(products.filter((product) => product.id !== id));
            setError('');
        }
        else {
            setError(response.data.message || 'Failed to delete product');
        }
        setLoading(false);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6"><Link to="/dashboard">Dashboard </Link> / <span className="text-primary hover:text-primary-dark"> Products</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="bg-white rounded-lg shadow-md p-6 w-full md:col-span-1">
                    <h2 className="text-xl font-bold mb-4">Create Products</h2>
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="mb-4 w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <Input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-4" required/>
                        <Input
                            type="file"
                            placeholder="Upload Image"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="mb-4"
                            required={!isEditing}
                        />
                        <Input type="text" placeholder="Enter Slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="mb-4" required/>
                        <Input type="text" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} className="mb-4" required/>
                        <Input type="number" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-4" required/>
                        <Input type="number" placeholder="Enter Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="mb-4" required/>
                        {/* <Input type="text" placeholder="Enter Images Link" value={images} onChange={(e) => setImages(e.target.value)} className="mb-4" required/> */}
                        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                            {loading ? <Loader size="sm" /> : 'Create'}
                        </Button>
                    </form>
                </div>


                <div className="bg-white rounded-lg shadow-md p-6 w-full md:col-span-2"> 
                    <h2 className="text-xl font-bold mb-4">List</h2>
                    <table className="w-full border-collapse border border-gray-300 rounded-lg">
                        <thead>
                            <tr>
                                <th className="text-left border border-gray-300 p-2">Name</th>
                                <th className="text-left border border-gray-300 p-2">Slug</th>
                                <th className="text-left border border-gray-300 p-2">Description</th>
                                <th className="text-left border border-gray-300 p-2">Price</th>
                                <th className="text-left border border-gray-300 p-2">Stock</th>
                                <th className="text-left border border-gray-300 p-2">Images</th>
                                <th className="text-left border border-gray-300 p-2">Category</th>
                                <th className="text-left border border-gray-300 p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="border border-gray-300 p-2">{product.name}</td>
                                    <td className="border border-gray-300 p-2">{product.slug}</td>
                                    <td className="border border-gray-300 p-2">{product.description}</td>
                                    <td className="border border-gray-300 p-2">{product.price}</td>
                                    <td className="border border-gray-300 p-2">{product.stock}</td>
                                    <td className="border border-gray-300 p-2">
                                        <img src={`/data/uploads/${product.images[0]}`} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {product.category?.name || '-'}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <Button variant="primary" className="mr-2" onClick={() => handleEdit(product.slug)}>
                                            <FiEdit2 />
                                        </Button>
                                        <Button variant="danger" className="mr-2" onClick={() => handleDelete(product.id)}>
                                            <FiTrash2 />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Product;