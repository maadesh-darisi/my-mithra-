import React, { useState } from 'react';

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, onClearChat }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <footer className="input-area">
      <input 
        type="text" 
        id="user-input" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your feelings..." 
        autoComplete="off"
      />
      <button onClick={handleSend}>Send</button>
      <button onClick={onClearChat}>Clear All</button>
    </footer>
  );
};

export default InputArea;