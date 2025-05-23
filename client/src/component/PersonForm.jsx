import React, { useState } from 'react';
import './PersonForm.css'; // Import the CSS file
import axios from 'axios'
const PersonForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bio: '',
    skills: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/persons', formData);
      alert('Person data submitted!');
      setFormData({ name: '', age: '', bio: '', skills: '' });
    } catch (err) {
      alert('Failed to submit data.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Add Person</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="form-input"
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        required
        className="form-input"
      />
      <textarea
        name="bio"
        placeholder="Bio"
        value={formData.bio}
        onChange={handleChange}
        required
        className="form-textarea"
      />
      <input
        type="text"
        name="skills"
        placeholder="Skills (comma-separated)"
        value={formData.skills}
        onChange={handleChange}
        required
        className="form-input"
      />
      <button type="submit" className="form-button">Submit</button>
    </form>
  );
};

export default PersonForm;
