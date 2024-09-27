
// ManageReports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL;

const ManageReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => {
    // Replace with the appropriate method to get the token
    return localStorage.getItem('token') || '';
  };

  
  console.log(API_URL);

  useEffect(() => {
    fetchClasses();
  }, []);

  
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/classes`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
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
// ManageReports.js (continued)
const fetchAttendanceReport = async () => {
  if (!startDate || !endDate || !selectedClass) {
    setError('Please select start date, end date, and class');
    return;
  }

  setLoading(true);
  try {
    const response = await axios.get(`${API_URL}/api/attendance/report`, {
      params: { startDate, endDate, class: selectedClass },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      
    });
    setAttendanceData(response.data);
    setError(null);
  } catch (err) {
    setError('Error fetching attendance report');
  } finally {
    setLoading(false);
  }
};

const handleDownload = async () => {
  if (!startDate || !endDate || !selectedClass) {
    setError('Please select start date, end date, and class');
    return;
  }

  setLoading(true);
  try {
    const response = await axios.get(`${API_URL}/api/attendance/report/download`, {
      params: { startDate, endDate, class: selectedClass },
      
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_report_${selectedClass}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setError(null);
  } catch (err) {
    setError('Error downloading attendance report');
  } finally {
    setLoading(false);
  }
};

const sendAbsenceNotifications = async () => {
  setLoading(true);
  try {
    await axios.get(`${API_URL}/api/attendance/absent`,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    setError(null);
    alert('Absence notifications sent successfully');
  } catch (err) {
    setError('Error sending absence notifications');
  } finally {
    setLoading(false);
  }
};

return (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Manage Reports</h1>

    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Report Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
          <input
            type="date"
            id="startDate"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
          <input
            type="date"
            id="endDate"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">Class:</label>
          <select
            id="class"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={fetchAttendanceReport}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Display Attendance Report'}
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Downloading...' : 'Download Attendance Report'}
        </button>
        <button
          onClick={sendAbsenceNotifications}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Absence Notifications'}
        </button>
      </div>
    </div>

    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )}

    {attendanceData.length > 0 && (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">Attendance Report</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Card ID</th>
                {attendanceData[0].sessions.map((session) => (
                  <th key={session._id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {session.startTime} - {session.endTime}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.map((record) => (
                <tr key={record.student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{record.student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.student.cardId}</td>
                  {record.sessions.map((session) => (
                    <td key={session._id} className="px-6 py-4 whitespace-nowrap">{session.count}</td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">{record.totalAttendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);
};

export default ManageReports;