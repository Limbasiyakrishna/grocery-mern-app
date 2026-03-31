import Message from "../models/message.model.js";
import { sendEmail } from "../utils/messageService.js";

// ── Register Message / Send Notification ──────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message, channel } = req.body;

    if (!name || !email || !subject || !message) {
      return res.json({ success: false, message: "Required fields missing." });
    }

    // Always create record first
    const newMessage = await Message.create({ name, email, phone, subject, message, channel });

    const customerSubject = `Message Received: ${subject}`;
    const customerMsg = `Hi ${name}, thank you for contacting FreshNest. We've received your inquiry: "${message}". We'll get back to you soon. 🌱`;
    
    const adminSubject = `[FreshNest CONTACT] ${subject}`;
    const adminMsg = `New inquiry from ${name} (${email}, Phone: ${phone || 'N/A'})\n\nSubject: ${subject}\nChannel: ${channel}\n\nMessage:\n${message}`;

    // -- Notification Processing (Email only) --
    sendEmail(email, customerSubject, customerMsg).catch(e => console.error("Customer Email Error:", e));
    if (process.env.ADMIN_EMAIL) {
      sendEmail(process.env.ADMIN_EMAIL, adminSubject, adminMsg).catch(e => console.error("Admin Email Error:", e));
    }

    res.json({ success: true, message: "Your message has been received! We will reply shortly.", data: newMessage });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.json({ success: false, message: "Internal server error. Please try again later." });
  }
};

// ── GET /api/message/all  (seller only) ──────────────────────────────────────
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── PATCH /api/message/:id/status (seller only) ───────────────────────────────
export const updateMessageStatus = async (req, res) => {
  try {
    const { status, reply } = req.body;
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { status, reply },
      { new: true }
    );
    if (!msg) return res.json({ success: false, message: "Message not found." });

    // If replying via email, send the reply
    if (reply && msg.email) {
      const emailSent = await sendEmail(msg.email, `Re: ${msg.subject}`, reply);
      if (!emailSent) {
        // We log it but maybe we don't want to fail the whole status update?
        // Actually, it's better to let the admin know the email failed.
        return res.json({ success: false, message: "Status updated, but email delivery failed. Please check your credentials." });
      }
    }

    res.json({ success: true, message: "Updated successfully and email sent.", data: msg });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── DELETE /api/message/:id (seller only) ─────────────────────────────────────
export const deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
