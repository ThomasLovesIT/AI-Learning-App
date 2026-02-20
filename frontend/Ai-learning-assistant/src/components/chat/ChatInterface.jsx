import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Sparkles, User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import aiService from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkdownRenderer';

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, loading]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if(!documentId) return
      try {
        setInitialLoading(true);
        const response = await aiService.chatHistory(documentId);
        setHistory(response.data || []);
      } catch (error) {
        console.error('Failed to fetch chat history', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);
      
      // CHANGE: your backend returns response.data.answer, not .reply
      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer, 
        timestamp: new Date(),
      };
      
      setHistory((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('chat error', err.message);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';

    return (
      <div key={index} className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
          {/* Avatar Icon */}
          <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center shadow-sm border 
            ${isUser ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-purple-50 border-purple-100 text-purple-600'}`}>
            {isUser ? <User size={18} /> : <Sparkles size={18} />}
          </div>

          {/* Message Bubble */}
          <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
            ${isUser 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{msg.content}</p>
            ) : (
              <MarkdownRenderer content={msg.content} />
            )}
          </div>
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Spinner />
        <p className="mt-4 text-gray-500 font-medium">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] bg-gray-50/30 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
            <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
              <MessageSquare size={40} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Start a conversation</h3>
              <p className="text-gray-500 max-w-xs">Ask me anything about the document and I'll help you summarize or find facts!</p>
            </div>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        {/* Typing Loading Indicator */}
        {loading && (
          <div className="flex justify-start mb-6">
            <div className="flex flex-row gap-3 items-end">
              <div className="flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center bg-purple-50 border border-purple-100 text-purple-600 shadow-sm">
                <Sparkles size={18} />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-4 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question about this document..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;