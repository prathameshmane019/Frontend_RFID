import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({ days: [], startTime: '', endTime: '' });
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    return localStorage.getItem('token') || '';
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/sessions`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("fetching sessions data");
      setSessions(response.data);
      setError(null);
      console.log("fetched data");
    } catch (err) {
      setError('Error fetching sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async () => {
    if (!newSession.days.length || !newSession.startTime || !newSession.endTime) {
      setError('Please select days, start time, and end time');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/sessions`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      newSession});
      setNewSession({ days: [], startTime: '', endTime: '' });
      fetchSessions();
      setError(null);
    } catch (err) {
      setError('Error adding session');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSession = async () => {
    if (!editingSession.days.length || !editingSession.startTime || !editingSession.endTime) {
      setError('Please select days, start time, and end time');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/sessions/${editingSession._id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      editingSession});
      setEditingSession(null);
      fetchSessions();
      setError(null);
    } catch (err) {
      setError('Error updating session');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/sessions/${id}`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      fetchSessions();
      setError(null);
    } catch (err) {
      setError('Error deleting session');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day, isEditing = false) => {
    const updateSession = isEditing ? editingSession : newSession;
    const updateFunction = isEditing ? setEditingSession : setNewSession;

    const days = updateSession.days.includes(day)
      ? updateSession.days.filter((d) => d !== day)
      : [...updateSession.days, day];
    updateFunction({ ...updateSession, days });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Sessions</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">{editingSession ? 'Edit Session' : 'Add New Session'}</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((day) => (
              <button
                key={day}
                onClick={() => handleDayToggle(day, !!editingSession)}
                className={`px-3 py-1 rounded ${
                  (editingSession ? editingSession.days : newSession.days).includes(day)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <input
              type="time"
              value={editingSession ? editingSession.startTime : newSession.startTime}
              onChange={(e) =>
                editingSession
                  ? setEditingSession({ ...editingSession, startTime: e.target.value })
                  : setNewSession({ ...newSession, startTime: e.target.value })
              }
              className="border rounded px-3 py-2"
            />
            <input
              type="time"
              value={editingSession ? editingSession.endTime : newSession.endTime}
              onChange={(e) =>
                editingSession
                  ? setEditingSession({ ...editingSession, endTime: e.target.value })
                  : setNewSession({ ...newSession, endTime: e.target.value })
              }
              className="border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={editingSession ? handleUpdateSession : handleAddSession}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingSession ? 'Update Session' : 'Add Session'}
          </button>
          {editingSession && (
            <button
              onClick={() => setEditingSession(null)}
              className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div>
        <h3 className="text-xl font-semibold mb-4">Sessions</h3>
        {loading ? (
          <p>Loading sessions...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Days</th>
                <th className="border p-2 text-left">Start Time</th>
                <th className="border p-2 text-left">End Time</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session._id} className="border-b">
                  <td className="border p-2">{session.days.join(', ')}</td>
                  <td className="border p-2">{session.startTime}</td>
                  <td className="border p-2">{session.endTime}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => setEditingSession(session)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageSessions;