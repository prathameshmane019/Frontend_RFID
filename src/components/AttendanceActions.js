import React from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function AttendanceActions() {
  const [message, setMessage] = React.useState('');

  const sendAbsenceNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/attendance/absent`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(`Error: ${error.response.data.message}`);
    }
  };

  return (
    <div>
      <h2>Attendance Actions</h2>
      <button onClick={sendAbsenceNotifications}>Send Absence Notifications</button>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default AttendanceActions;
