import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { categoryAPI } from "../../services/api";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Loader from "../../components/ui/Loader";
import { Link } from "react-router-dom";

const Category = () => {

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [categoryId, setCategoryId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isEditing) {
            const response = await categoryAPI.update(categoryId, { name, slug });
            if (response.data.success) {
                setCategories(categories.map((category) => category.id === categoryId ? response.data.data.category : category));
                setError('');
                setName('');
                setSlug('');
                setCategoryId('');
            } else {
                setError(response.data.message || 'Failed to update category');
            }
            setIsEditing(false);
        } else {
            const response = await categoryAPI.create({ name, slug });
            console.log(response.data.success);
            if (response.data.success) {
                setCategories([...categories, response.data.data.category]);
                setError('');
                setName('');
                setSlug('');
                setCategoryId('');
            } else {
                setError(response.data.message || 'Failed to create category');
            }
        }
        setLoading(false);
    }

    const handleEdit = async (slug) => {
        const response = await categoryAPI.getBySlug(slug);
        setIsEditing(true);
        setCategoryId(response.data.data.category.id);
        setName(response.data.data.category.name);
        setSlug(response.data.data.category.slug);
    }

    const handleDelete = async (id) => {
        setLoading(true);
        const response = await categoryAPI.delete(id);
        if (response.data.success) {
            setCategories(categories.filter((category) => category.id !== id));
            setError('');
        } else {
            setError(response.data.message || 'Failed to delete category');
        }
        setLoading(false);
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await categoryAPI.getAll();
            setCategories(response.data.data.categories);
        }
        fetchCategories();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6"><Link to="/dashboard">Dashboard </Link> / <span className="text-primary hover:text-primary-dark"> Categories</span></h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="bg-white rounded-lg shadow-md p-6 w-full md:col-span-1">

                    <h2 className="text-xl font-bold mb-4">Create Category</h2>
                    <form onSubmit={handleSubmit}>
                        <Input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-4" required/>
                        <Input type="text" placeholder="Enter Slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="mb-4" required/>
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
                                <th className="text-left border border-gray-300 p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id} className="border border-gray-300 p-2">
                                    <td className="border border-gray-300 p-2">{category.name}</td>
                                    <td className="border border-gray-300 p-2">{category.slug}</td>
                                    <td className="border border-gray-300 p-2">
                                        <Button variant="primary" className="mr-2" onClick={() => handleEdit(category.slug)}>
                                            <FiEdit2 />
                                        </Button>
                                        <Button variant="danger" className="mr-2" onClick={() => handleDelete(category.id)}>
                                            <FiTrash2 />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <Loader size="sm" />}
                </div>
            </div>
        </div>
    )
}

export default Category;