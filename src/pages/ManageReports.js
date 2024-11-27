import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const ManageReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [absenteeReport, setAbsenteeReport] = useState([]);
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
    if (!startDate || !endDate || !selectedClass) {
      setError('Please select start date, end date, and class');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post(`${API_URL}/api/attendance/absent`, 
        { startDate, endDate, classId: selectedClass },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
  
      setAbsenteeReport(response.data.absenteeReport);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError('Error sending notifications: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Reports</h1>

      <div style={styles.filterContainer}>
        <h2 style={styles.subtitle}>Report Filters</h2>
        <div style={styles.inputGroup}>
          <div style={styles.inputWrapper}>
            <label htmlFor="startDate" style={styles.label}>Start Date:</label>
            <input
              type="date"
              id="startDate"
              style={styles.input}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={styles.inputWrapper}>
            <label htmlFor="endDate" style={styles.label}>End Date:</label>
            <input
              type="date"
              id="endDate"
              style={styles.input}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div style={styles.inputWrapper}>
            <label htmlFor="class" style={styles.label}>Class:</label>
            <select
              id="class"
              style={styles.input}
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
        <div style={styles.buttonGroup}>
          <button onClick={fetchAttendanceReport} style={styles.button} disabled={loading}>
            {loading ? 'Loading...' : 'Display Attendance Report'}
          </button>
          <button onClick={handleDownload} style={styles.button} disabled={loading}>
            {loading ? 'Downloading...' : 'Download Attendance Report'}
          </button>
          <button onClick={sendAbsenceNotifications} style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send Absence Notifications'}
          </button>
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          <span>{error}</span>
        </div>
      )}

      {absenteeReport.length > 0 && (
        <div style={styles.reportContainer}>
          <h2 style={styles.subtitle}>Absentee Report</h2>
          <ul style={styles.list}>
            {absenteeReport.map((report, index) => (
              <li key={index} style={styles.listItem}>
                {report.studentName} ({report.email}): {report.absentSessions.length} sessions missed
              </li>
            ))}
          </ul>
        </div>
      )}

      {attendanceData.length > 0 && (
        <div style={styles.reportContainer}>
          <h2 style={styles.subtitle}>Attendance Report</h2>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Card ID</th>
                  {attendanceData[0].sessions.map((session) => (
                    <th key={session._id} style={styles.th}>
                      {session.startTime} - {session.endTime}
                    </th>
                  ))}
                  <th style={styles.th}>Total Attendance</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record) => (
                  <tr key={record.student._id}>
                    <td style={styles.td}>{record.student.name}</td>
                    <td style={styles.td}>{record.student.cardId}</td>
                    {record.sessions.map((session) => (
                      <td key={session._id} style={styles.td}>{session.count}</td>
                    ))}
                    <td style={styles.td}>{record.totalAttendance}</td>
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

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  filterContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    padding: '20px',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '10px',
  },
  inputWrapper: {
    flex: '1 1 200px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 15px',
    fontSize: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  reportContainer: {
    backgroundColor: 'white',
    borderRadius: '5px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '5px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    padding: '12px',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #dee2e6',
    padding: '12px',
  },
};

export default ManageReports;