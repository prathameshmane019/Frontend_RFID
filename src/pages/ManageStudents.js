
// ManageStudents.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export default function ManageStudents() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ name: '', cardId: '', email: '', class: '' });
  const [selectedClass, setSelectedClass] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false); // State to control form visibility

  
  const getToken = () => {
    // Replace with the appropriate method to get the token
    return localStorage.getItem('token') || '';
  };
  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/classes`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setClasses(response.data);
    } catch (err) {
      setError('Error fetching classes');
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/students`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editing) {
        await axios.put(`${API_URL}/api/students/${newStudent._id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          newStudent}
        );
      } else {
        await axios.post(`${API_URL}/api/students`, newStudent);
      }

      setNewStudent({ name: '', cardId: '', email: '', class: '' });
      setEditing(false);
      fetchStudents();
      setError(null);
    } catch (err) {
      setError(editing ? 'Error updating student' : 'Error adding student');
    } finally {
      setLoading(false);
      setFormVisible(false)
    }
  };

  const handleDeleteStudent = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/students/${id}`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      fetchStudents();
      setError(null);
    } catch (err) {
      setError('Error deleting student');
    } finally {
      setLoading(false);
    }
  };

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    if (formVisible) {
      // Reset the form when hiding it
      setEditing(false);
      setNewStudent({ name: '', cardId: '', email: '', class: '' });
    }
  };

  const handleEditStudent = (student) => {
    setFormVisible(true)
    setNewStudent(student);
    setEditing(true);
  };

  const filteredStudents = selectedClass
    ? students.filter(student => student.class && student.class._id === selectedClass)
    : students;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Students</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <button
        onClick={toggleFormVisibility}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mb-4"
      >
        {formVisible ? 'Cancel' : editing ? 'Edit Student' : 'Add New Student'}
      </button>

      {formVisible && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Student' : 'Add New Student'}</h2>
          <form onSubmit={handleAddOrUpdateStudent} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Card ID"
              value={newStudent.cardId}
              onChange={(e) => setNewStudent({ ...newStudent, cardId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newStudent.class}
              onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {loading ? 'Saving...' : editing ? 'Update Student' : 'Add Student'}
            </button>
          </form>
        </div>
      )}

      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Students</h2>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.cardId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.class ? student.class.name : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline transition-colors duration-200 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
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
        {filteredStudents.length === 0 && !loading && (
          <p className="text-center py-4 text-gray-500">No students found. Add a new student to get started.</p>
        )}
      </div>
    </div>
  );
}
