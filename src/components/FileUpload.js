import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'https://unitytech-backend.vercel.app';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadStudents = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/students/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(`Error: ${error.response.data.message}`);
    }
  };

  return (
    <div>
      <h2>Upload Student Data</h2>
      <input type="file" onChange={handleFileChange} accept=".xlsx,.xls" />
      <button onClick={uploadStudents}>Upload Students</button>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default FileUpload;
