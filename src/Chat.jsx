import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the NestJS server

function Chat() {
  const [userId, setUserId] = useState('4'); // Default or empty string if you prefer
  const [senderId, setsenderId] = useState(''); // Default or empty string if you prefer
  const [adminId, setAdminId] = useState('5'); // Default or empty string if you prefer
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Re-join the room on userId or adminId change
    const roomId = `chat_${userId}_${adminId}`;
    socket.emit('join_room', { userId, adminId });

    // Setup listener for incoming messages
    const handleReceiveMessage = (data) => {
      if (data.roomId === roomId) {
        setMessages((msgs) => [...msgs, data]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [userId, adminId]);

  const sendMessage = () => {
    const roomId = `chat_${userId}_${adminId}`;
    if (message !== '') {
      socket.emit('send_message', { roomId, message, senderId: senderId,vendorId:senderId, userId:userId });
      setMessage(''); // Clear the input after sending
    }
  };
console.log(messages,"messages")
  return (
    <div>
      <input
        type="text"
        placeholder="Your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Admin ID"
        value={senderId}
        onChange={(e) => setsenderId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <div>
        <h3>Messages</h3>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId === userId ? userId : `User ${msg.senderId}`}: </strong>
            {msg.message}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Chat;
