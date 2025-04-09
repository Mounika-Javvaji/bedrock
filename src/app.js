import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const API_ENDPOINT = "https://vfy6wuhri3.execute-api.us-east-1.amazonaws.com/prod";

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', text: userInput };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userInput })
      });

      const data = await response.json();
      const botMessage = { role: 'bot', text: data.response || "No response from bot." };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error: Failed to get response.' }]);
    }

    setUserInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
