import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const FreshnestAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hi! I'm your Freshnest AI assistant. Looking for recipe ideas or help with your groceries today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const { products, addToCart } = useAppContext();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput("");
        setIsTyping(true);

        // Simulate AI Logic
        setTimeout(() => {
            let response = "I'm not sure about that, but our fresh Organic Apples are great today!";
            
            if (userMsg.toLowerCase().includes("pasta")) {
                response = "Great choice! I recommend our Durum Wheat Pasta. Should I add it to your basket?";
                // In a real app, we'd provide a button to add to cart
            } else if (userMsg.toLowerCase().includes("fruit")) {
                response = "We have fresh Mangoes and Bananas in stock. They're perfect for a summer salad!";
            } else if (userMsg.toLowerCase().includes("hello") || userMsg.toLowerCase().includes("hi")) {
                response = "Hello! How can I help you shop today?";
            }

            setMessages(prev => [...prev, { role: 'ai', content: response }]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[280px] sm:w-[350px] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-emerald-600 p-6 text-white flex gap-4 items-center">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
                        <div>
                            <h3 className="font-black text-lg leading-none uppercase tracking-tighter">Freshnest <span className="text-emerald-200">AI</span></h3>
                            <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mt-1">Online & Ready</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 p-6 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                                    msg.role === 'user' 
                                    ? 'bg-emerald-600 text-white rounded-br-none' 
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700 rounded-bl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-300"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-2">
                            <input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 text-gray-700 dark:text-gray-100"
                            />
                            <button 
                                onClick={handleSend}
                                className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-900/10"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
                    isOpen 
                    ? 'bg-slate-900 text-white rotate-180' 
                    : 'bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                }`}
            >
                {isOpen ? '✕' : '🤖'}
            </button>
        </div>
    );
};

export default FreshnestAI;
