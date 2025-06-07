import React, { useState, useRef, useEffect } from 'react';
import '../styles/chatbot.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons';

// API URL configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const TypingIndicator = () => (
  <div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

const ChatbotHead = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [quickQuestionsVisible, setQuickQuestionsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [shakeTooltip, setShakeTooltip] = useState(false);
  const chatbotWindowRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Shake the tooltip every 5 seconds while visible
  useEffect(() => {
    if (!showTooltip) return;
    const shakeInterval = setInterval(() => {
      setShakeTooltip(true);
      setTimeout(() => setShakeTooltip(false), 600); // shake duration
    }, 5000);
    return () => clearInterval(shakeInterval);
  }, [showTooltip]);

  // Prevent website scroll when mouse is over chat messages
  useEffect(() => {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    const wheelHandler = (e) => {
      e.preventDefault();
      chatMessages.scrollTop += e.deltaY;
    };
    chatMessages.addEventListener('wheel', wheelHandler, { passive: false });
    return () => {
      chatMessages.removeEventListener('wheel', wheelHandler);
    };
  }, [isOpen]);

  // Close chatbot when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (chatbotWindowRef.current && !chatbotWindowRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{ text: "Hello! I'm your AI assistant. How can I help you today?", sender: 'bot' }]);
    }
    setShowTooltip(false);
  };

  // Refactor message sending logic to use backend API
  const sendMessage = async (message) => {
    if (!message.trim() || isTyping) return;
    setInput('');
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);
    setIsTyping(true);
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      console.log('API response:', data.response);
      let botText = data.response;
      // If it's an object with a 'value' property, use that
      if (botText && typeof botText === 'object' && botText.value) {
        botText = botText.value;
      }
      // If it's an array, join the string values or extract .value
      if (Array.isArray(botText)) {
        botText = botText.map(part => {
          if (typeof part === 'string') return part;
          if (part && typeof part === 'object' && part.value) return part.value;
          return '';
        }).join(' ');
      }
      setMessages(prev => [...prev, { text: botText, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting right now. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const handleQuickQuestion = (question) => {
    setQuickQuestionsVisible(false);
    sendMessage(question);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (quickQuestionsVisible && e.target.value.trim().length > 0) {
      setQuickQuestionsVisible(false);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-window" ref={chatbotWindowRef}>
          <div className="chatbot-header">
            <h4>T-Global Help Desk</h4>
            <button className="close-btn" onClick={handleClick}>×</button>
          </div>
          <div className="chatbot-body">
            <div
              className="chat-messages"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-container ${message.sender === 'user' ? 'user-container' : 'bot-container'}`}
                >
                  <div className="message-avatar">
                    <FontAwesomeIcon 
                      icon={message.sender === 'user' ? faUser : faRobot} 
                      className="avatar-icon"
                    />
                  </div>
                  <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message-container bot-container">
                  <div className="message-avatar">
                    <FontAwesomeIcon icon={faRobot} className="avatar-icon" />
                  </div>
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Quick Questions Column */}
            {quickQuestionsVisible && (
              <div className="quick-questions-column">
                <button className="quick-question-btn" onClick={() => handleQuickQuestion('What are your operating hours?')}>What are your operating hours?</button>
                <button className="quick-question-btn" onClick={() => handleQuickQuestion('How much is the rent?')}>How much is the rent?</button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="chat-input"
                disabled={isTyping}
              />
              <button type="submit" className="send-button" disabled={isTyping}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="chatbot-head" onClick={handleClick}>
        {showTooltip && (
          <div className={`chatbot-tooltip${shakeTooltip ? ' shake' : ''}`}>
            <span>💬 Need help? Chat with us!</span>
          </div>
        )}
        <FontAwesomeIcon icon={faRobot} className="chatbot-icon" />
      </div>
    </div>
  );
};

export default ChatbotHead; 