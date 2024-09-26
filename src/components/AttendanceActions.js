import React from 'react';
import axios from 'axios';

const API_URL = 'https://unitytech-backend.vercel.app/api';

function AttendanceActions() {
  const [message, setMessage] = React.useState('');

  const sendAbsenceNotifications = async () => {
    try {
      const response = await axios.get(`/attendance/absent`);
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
