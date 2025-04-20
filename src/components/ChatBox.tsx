import React from 'react';
import { MessageType } from '../types';

interface ChatBoxProps {
  messages: MessageType[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const chatBoxRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="chat-box" ref={chatBoxRef}>
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
        >
          {message.text}
        </div>
      ))}
    </main>
  );
};

export default ChatBox;