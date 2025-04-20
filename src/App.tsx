import React, { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatBox from './components/ChatBox';
import InputArea from './components/InputArea';
import { MessageType } from './types';
import { chatWithOpenRouter } from './services/api';
import './styles/chatStyles.css';

function App() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    setMessages(prevMessages => [
      ...prevMessages, 
      { text: message, sender: 'user' }
    ]);
    
    setIsLoading(true);
    
    try {
      // Get response from API
      const response = await chatWithOpenRouter(message);
      
      // Add bot message to chat
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          text: `Mithra (${response.sentiment}): ${response.response}`, 
          sender: 'bot',
          sentiment: response.sentiment
        }
      ]);
    } catch (error) {
      console.error('Error getting chat response:', error);
      
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          text: 'Sorry, there was an error. Please try again later.', 
          sender: 'bot' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-wrapper">
      <ChatHeader />
      <ChatBox messages={messages} />
      <InputArea 
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
      />
    </div>
  );
}

export default App;