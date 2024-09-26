import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    return localStorage.getItem('token') || '';
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/classes`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
      });
      setClasses(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching classes');
    } finally {
      setLoading(false);
    }
  };
  const handleAddClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/classes`,{
        headers: {
          Authorization: `Bearer ${getToken()}`}
      , newClass});
      setNewClass({ name: '' });
      fetchClasses();
      setError(null);
    } catch (err) {
      setError('Error adding class');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/classes/${id}`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      fetchClasses();
      setError(null);
    } catch (err) {
      setError('Error deleting class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Classes</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
        <form onSubmit={handleAddClass} className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Class Name"
            value={newClass.name}
            onChange={(e) => setNewClass({ name: e.target.value })}
            required
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {loading ? 'Adding...' : 'Add Class'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">Classes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classes.map((cls) => (
                <tr key={cls._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{cls.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => handleDeleteClass(cls._id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:underline transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {classes.length === 0 && !loading && (
          <p className="text-center py-4 text-gray-500">No classes found. Add a new class to get started.</p>
        )}
      </div>
    </div>
  );
}