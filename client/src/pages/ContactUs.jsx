import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CHANNELS = [
  { value: "email", label: "Email Support", icon: "✉️" },
];

const INFO_CARDS = [
  {
    icon: "📧",
    title: "Email Us",
    lines: ["support@greenbasket.com", "We reply within 24 hours"],
    color: "#059669",
  },
  {
    icon: "📞",
    title: "Call / SMS",
    lines: ["+91 98765 43210", "Mon – Sat, 9 AM – 7 PM"],
    color: "#0d9488",
  },
  {
    icon: "📍",
    title: "Visit Us",
    lines: ["12, Green Street", "Mumbai, MH 400001"],
    color: "#047857",
  },
];

const ContactUs = () => {
  const { axios } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    channel: "email",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/message/send", form);
      if (data.success) {
        setSent(true);
        toast.success("Message sent! We'll get back to you soon 🌿");
        setForm({ name: "", email: "", phone: "", subject: "", message: "", channel: "email" });
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 lg:mb-20 animate-fade-in">
        <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-[8px] sm:text-xs font-bold uppercase tracking-widest px-3 sm:px-4 py-1 sm:py-2 rounded-full mb-2 sm:mb-4">
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          Contact Support
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-gray-900 mb-2 sm:mb-4 leading-tight">
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Touch</span>
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl">
          Have a question, suggestion, or just want to say hi? We'd love to hear from you.
          Choose your preferred contact channel below.
        </p>
      </div>

      {/* ── Info Cards ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12 md:mb-16 px-2">
        {INFO_CARDS.map((card, i) => (
          <div
            key={card.title}
            className={`bg-white rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] p-4 sm:p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform stagger-${i + 1}`}
          >
            <div
              className="w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-full text-xl sm:text-2xl mb-2 sm:mb-3"
              style={{ background: `${card.color}18` }}
            >
              {card.icon}
            </div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">{card.title}</h3>
            {card.lines.map((l) => (
              <p key={l} className="text-gray-500 text-[8px] sm:text-xs md:text-sm leading-snug">{l}</p>
            ))}
          </div>
        ))}
      </div>

      {/* ── Main Form Card ─────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto animate-fade-in px-2">
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
          {/* top accent bar */}
          <div className="h-1 sm:h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600" />

          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {sent && (
              <div className="mb-6 sm:mb-8 flex flex-col items-center text-center bg-emerald-50 border border-emerald-200 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] p-4 sm:p-6 md:p-8 animate-scale-up">
                <span className="text-4xl sm:text-5xl mb-2 sm:mb-3">✅</span>
                <h3 className="font-bold text-emerald-700 text-base sm:text-lg md:text-xl mb-0.5 sm:mb-1">Message Received!</h3>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base">
                  We'll get back to you as soon as possible. Check your inbox or phone.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-3 sm:mt-4 text-emerald-600 text-xs sm:text-sm font-semibold underline underline-offset-2"
                >
                  Send another message
                </button>
              </div>
            )}

            {!sent && (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                  <div>
                    <label className="block text-[8px] sm:text-xs md:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="input-field text-xs sm:text-sm md:text-base py-2 sm:py-2.5 px-3 sm:px-4"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] sm:text-xs md:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="What's this about?"
                    className="input-field"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us how we can help you…"
                    className="input-field resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  id="contact-submit"
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Send Message</span>
                      <span>✉️</span>
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ hint */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Looking for quick answers?{" "}
          <a href="/blog" className="text-emerald-600 underline underline-offset-2 font-semibold">
            Check our Blog
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
