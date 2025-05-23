import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Invitation = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

//   useEffect(() => {
//     // Initial greeting from AI
//     startConversation();
//   }, []);

//   const startConversation = async () => {
//     const res = await axios.post('http://localhost:5000/api/invitation/chat', {
//       message: 'hi'
//     });
//     setMessages([{ sender: 'AI', text: res.data.reply }]);
//   };


  useEffect(() => {
  const startConversation = async () => {
    const res = await axios.post('http://localhost:5000/api/invitation/chat', {
      message: '',
      history: []
    });

    setMessages([{ sender: 'AI', text: res.data.reply }]);
    setChatHistory([{ role: 'assistant', content: res.data.reply }]);
  };

  startConversation();
}, []);


//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: 'You', text: input };
//     setMessages(prev => [...prev, userMessage]);

//     const res = await axios.post('http://localhost:5000/api/invitation/chat', {
//       message: input
//     });

//     const aiReply = { sender: 'AI', text: res.data.reply };
//     setMessages(prev => [...prev, aiReply]);
//     setInput('');
//   };

  const [chatHistory, setChatHistory] = useState([]);

const sendMessage = async () => {
  if (!input.trim()) return;

  const newUserMsg = { role: 'user', content: input };
  const updatedHistory = [...chatHistory, newUserMsg];

  setMessages((prev) => [...prev, { sender: 'You', text: input }]);
  setInput('');

  const res = await axios.post('http://localhost:5000/api/invitation/chat', {
    message: input,
    history: updatedHistory
  });

  const aiReply = res.data.reply;
  setMessages((prev) => [...prev, { sender: 'AI', text: aiReply }]);

  setChatHistory([...updatedHistory, { role: 'assistant', content: aiReply }]);
};


  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Invitation Chat</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <div key={idx}><strong>{msg.sender}:</strong> {msg.text}</div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your reply..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Invitation;
