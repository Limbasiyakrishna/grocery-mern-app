import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  unread: { 
    bg: "bg-red-50", 
    text: "text-red-600", 
    border: "border-red-100", 
    dot: "bg-red-500",
    label: "Unread" 
  },
  read: { 
    bg: "bg-amber-50", 
    text: "text-amber-600", 
    border: "border-amber-100", 
    dot: "bg-amber-400",
    label: "Read" 
  },
  replied: { 
    bg: "bg-emerald-50", 
    text: "text-emerald-600", 
    border: "border-emerald-100", 
    dot: "bg-emerald-500",
    label: "Replied" 
  },
};

const CHANNEL_BADGES = {
  email: { icon: "✉️", label: "Email" },
  sms: { icon: "📱", label: "SMS" },
  both: { icon: "🔔", label: "Multi" },
};

const SellerMessages = () => {
  const { axios } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/message/all");
      if (data.success) setMessages(data.messages);
      else toast.error(data.message);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const markRead = async (id) => {
    try {
      const { data } = await axios.patch(`/api/message/${id}/status`, { status: "read", reply: "" });
      if (data.success) {
        setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, status: "read" } : m)));
        if (selected?._id === id) setSelected((prev) => ({ ...prev, status: "read" }));
      }
    } catch { /* silent */ }
  };

  const sendReply = async () => {
    if (!reply.trim()) return toast.error("Please type a message to reply.");
    setReplying(true);
    try {
      const { data } = await axios.patch(`/api/message/${selected._id}/status`, {
        status: "replied",
        reply: reply.trim(),
      });
      if (data.success) {
        toast.success("Reply dispatched successfully");
        setMessages((prev) =>
          prev.map((m) => (m._id === selected._id ? { ...m, status: "replied", reply: reply.trim() } : m))
        );
        setSelected((prev) => ({ ...prev, status: "replied", reply: reply.trim() }));
        setReply("");
      } else toast.error(data.message);
    } catch { toast.error("Failed to send reply"); }
    finally { setReplying(false); }
  };

  const deleteMsg = async (id) => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;
    try {
      const { data } = await axios.delete(`/api/message/${id}`);
      if (data.success) {
        toast.success("Message archived");
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selected?._id === id) setSelected(null);
      } else toast.error(data.message);
    } catch { toast.error("Failed to delete"); }
  };

  const open = (msg) => {
    setSelected(msg);
    setReply(msg.reply || "");
    if (msg.status === "unread") markRead(msg._id);
  };

  const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);
  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="p-4 md:p-8 lg:p-10 min-h-screen bg-[#fcfcfd]">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-2xl">📥</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Inbox</h1>
              <p className="text-gray-500 font-medium">Manage customer relationships and inquiries</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 p-1 rounded-2xl flex shadow-sm">
            {["all", "unread", "replied"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                  ${filter === f 
                    ? "bg-gray-900 text-white shadow-md" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
              </button>
            ))}
          </div>
          <button
            onClick={fetchMessages}
            className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 text-gray-600 rounded-2xl hover:border-emerald-400 hover:text-emerald-600 transition-all shadow-sm"
            title="Refresh messages"
          >
            <span className="text-xl">🔄</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden flex flex-col lg:flex-row h-[750px]">
          
          {/* ── Left Sidebar: Message List ────────────────────────────────── */}
          <aside className="lg:w-[380px] border-r border-gray-50 flex flex-col bg-gray-50/30">
            <div className="p-6 border-b border-gray-50">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search interactions..."
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hydrating Inbox...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-4xl opacity-50">🏝️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Inbox Zero</h3>
                    <p className="text-sm text-gray-500">Perfect time for a coffee break!</p>
                  </div>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filtered.map((msg) => {
                    const cfg = STATUS_CONFIG[msg.status] || STATUS_CONFIG.read;
                    const isSelected = selected?._id === msg._id;
                    return (
                      <button
                        key={msg._id}
                        onClick={() => open(msg)}
                        className={`w-full text-left p-4 rounded-3xl transition-all duration-300 relative group
                          ${isSelected 
                            ? "bg-white shadow-xl shadow-gray-200/50 scale-[1.02] z-10 border border-gray-100" 
                            : "hover:bg-white/60 border border-transparent hover:border-gray-100"}`}
                      >
                        <div className="flex gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg font-bold
                            ${isSelected ? "bg-emerald-600 text-white" : "bg-white border border-gray-200 text-gray-400"}`}>
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className={`font-bold truncate text-sm ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                                {msg.name}
                              </p>
                              <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                                {new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-emerald-600/80 mb-1 truncate">{msg.subject}</p>
                            <p className="text-[11px] text-gray-400 truncate leading-relaxed line-clamp-1">{msg.message}</p>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                {cfg.label}
                              </span>
                              {msg.channel && (
                                <span className="bg-white border border-gray-100 px-2.5 py-1 rounded-lg text-[10px] shadow-sm">
                                  {CHANNEL_BADGES[msg.channel]?.icon}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {msg.status === "unread" && !isSelected && (
                          <div className="absolute right-4 bottom-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* ── Right Panel: Message Content & Interaction ────────────────── */}
          <section className="flex-1 flex flex-col bg-white overflow-hidden relative">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center pointer-events-none">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-emerald-50 rounded-[3rem] rotate-12 absolute -top-4 -right-4" />
                  <div className="w-32 h-32 bg-white border border-emerald-100 rounded-[3rem] flex items-center justify-center relative shadow-sm">
                    <span className="text-6xl">✨</span>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Select a Conversation</h2>
                <p className="text-gray-500 max-w-xs mx-auto font-medium">Select a customer inquiry from the left to start collaborating on a resolution.</p>
              </div>
            ) : (
              <>
                {/* Detail Header */}
                <header className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">
                      👤
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 leading-tight">{selected.name}</h2>
                      <div className="flex items-center gap-3 mt-1.5">
                        <a href={`mailto:${selected.email}`} className="text-sm font-bold text-emerald-600 hover:underline">{selected.email}</a>
                        {selected.phone && (
                          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                            📱 {selected.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => deleteMsg(selected._id)}
                      className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm group"
                      title="Archive conversation"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">🗑️</span>
                    </button>
                  </div>
                </header>

                {/* Message Canvas */}
                <div className="flex-1 overflow-y-auto p-8 bg-[#fafafa]/50 space-y-8">
                  <div className="max-w-3xl mx-auto space-y-10 py-4">
                    
                    {/* Timestamp Separator */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                      <span className="relative bg-[#fafafa] px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Initial Inquiry • {new Date(selected.createdAt).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Customer Bubble */}
                    <div className="flex flex-col items-start gap-2">
                      <div className="bg-white border border-gray-100 p-6 rounded-[2rem] rounded-tl-lg shadow-sm max-w-[85%] relative group">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-black text-gray-900 uppercase">Message</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-xs font-bold text-emerald-600">{selected.subject}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">{selected.message}</p>
                      </div>
                    </div>

                    {selected.reply && (
                      <>
                         {/* Reply Separator */}
                        <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-emerald-100/50"></div></div>
                          <span className="relative bg-[#fafafa] px-4 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                            Sent Reply ✨
                          </span>
                        </div>

                        {/* Admin Bubble */}
                        <div className="flex flex-col items-end gap-2">
                          <div className="bg-emerald-600 text-white p-6 rounded-[2rem] rounded-tr-lg shadow-xl shadow-emerald-200/50 max-w-[85%] relative">
                            <div className="flex items-center gap-2 mb-3 opacity-90">
                              <span className="text-xs font-black uppercase">Your response</span>
                              <span className="text-lg">📩</span>
                            </div>
                            <p className="leading-relaxed font-medium whitespace-pre-wrap">{selected.reply}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Interactive Reply Zone */}
                <footer className="p-8 border-t border-gray-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                  <div className="max-w-3xl mx-auto">
                    <div className="relative group">
                      <textarea
                        rows={3}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder={`Compose a reply to ${selected.name.split(" ")[0]}...`}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-3xl p-6 pb-20 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 focus:bg-white transition-all resize-none shadow-inner"
                      />
                      <div className="absolute bottom-4 left-6 flex items-center gap-2 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1">⌨️ <kbd className="bg-gray-100 px-1 rounded">Shift+Enter</kbd></span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>Sending from: <span className="text-emerald-600">FreshNest Support</span></span>
                      </div>
                      <button
                        onClick={sendReply}
                        disabled={replying}
                        className={`absolute bottom-4 right-4 flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black tracking-wide shadow-xl transition-all duration-300
                          ${replying 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                            : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200 active:scale-95"}`}
                      >
                        {replying ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                            Dispatching...
                          </>
                        ) : (
                          <>Send Message <span className="text-base group-hover:translate-x-1 transition-transform">🚀</span></>
                        )}
                      </button>
                    </div>
                  </div>
                </footer>
              </>
            )}
          </section>
        </div>
      </main>
      
      {/* Global Aesthetics Style Tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(10deg); }
          100% { transform: translateY(0px) rotate(12deg); }
        }
      `}} />
    </div>
  );
};

export default SellerMessages;
