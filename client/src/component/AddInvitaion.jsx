// src/pages/AddInvitation.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddInvitation = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    location: '',
    hostName: '',
    additionalInfo: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/invitation', formData);
      setStatus('Invitation details saved successfully.');
      setFormData({ eventName: '', date: '', location: '', hostName: '', additionalInfo: '' });
    } catch (err) {
      console.error(err);
      setStatus('Error saving invitation.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Add Invitation Details</h2>
      <form onSubmit={handleSubmit}>
        <input name="eventName" value={formData.eventName} onChange={handleChange} placeholder="Event Name" required /><br /><br />
        <input name="date" type="date" value={formData.date} onChange={handleChange} required /><br /><br />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required /><br /><br />
        <input name="hostName" value={formData.hostName} onChange={handleChange} placeholder="Host Name" required /><br /><br />
        <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} placeholder="Additional Information" /><br /><br />
        <button type="submit">Save</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default AddInvitation;
