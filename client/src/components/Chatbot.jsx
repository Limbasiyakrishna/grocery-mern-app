import { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const Chatbot = () => {
    const { axios, isDarkMode } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm your FreshNest AI Chef. 🧑‍🍳 I can help you with recipes, cooking tips, and choosing the best ingredients. What's on your mind today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const { data } = await axios.post("/api/chat", { message: userMessage });
            if (data.success) {
                setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having a bit of a brain freeze. Can you try again?" }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "I'm offline for a moment, but I'll be back soon to help you cook something amazing!" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className={`w-[320px] sm:w-[380px] h-[500px] mb-4 flex flex-col rounded-[2.5rem] shadow-2xl border transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-5 ${
                    isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                }`}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl">
                                    👨‍🍳
                                </div>
                                <div className="text-left">
                                    <h3 className="font-black text-sm uppercase tracking-widest">AI Chef Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-100">Ready to cook</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/10 rounded-xl transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed whitespace-pre-line ${
                                    m.role === 'user' 
                                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-100' 
                                    : `${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'} rounded-tl-none`
                                }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className={`p-4 rounded-2xl rounded-tl-none text-emerald-600 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-current animate-bounce" />
                                        <div className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className={`p-4 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about recipes or ingredients..."
                                className={`w-full pl-5 pr-12 py-3.5 rounded-2xl outline-none text-sm font-semibold transition-all ${
                                    isDarkMode 
                                    ? 'bg-gray-800 text-white border-transparent focus:border-emerald-500' 
                                    : 'bg-gray-50 text-gray-800 border-transparent focus:border-emerald-600'
                                } border`}
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || loading}
                                className="absolute right-2 p-2 text-emerald-600 hover:scale-110 active:scale-95 transition-all disabled:opacity-30"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Float Bubbles */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-2xl sm:text-3xl shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 group relative ${
                    isOpen 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                }`}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    "🧑‍🍳"
                )}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
                )}
                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute right-full mr-4 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Chat with Chef
                    </div>
                )}
            </button>
        </div>
    );
};

export default Chatbot;
