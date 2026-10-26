import React from 'react';
import './ContactModal.css';
import { X, Mail, Phone, User, Send, MessageSquare, Sparkles } from 'lucide-react';

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="contact-overlay" onClick={onClose}>
      <div className="contact-card" onClick={(e) => e.stopPropagation()}>
        <button className="contact-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="contact-header">
          <div className="contact-pill">
            <Sparkles size={12} className="cyan-sparkle" />
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="contact-title">Contact Support & Developer</h2>
          <p className="contact-subtitle">
            Have questions about the Resume Builder or need custom feature support? Reach out directly!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-info-list">
          <div className="contact-info-item">
            <div className="contact-icon-box">
              <User size={18} />
            </div>
            <div className="contact-text-box">
              <span className="contact-label">Lead Developer / Owner</span>
              <strong className="contact-value">Abaan Mubeen</strong>
            </div>
          </div>

          <a href="mailto:abaanok1@gmail.com" className="contact-info-item clickable">
            <div className="contact-icon-box">
              <Mail size={18} />
            </div>
            <div className="contact-text-box">
              <span className="contact-label">Official Email</span>
              <strong className="contact-value">abaanok1@gmail.com</strong>
            </div>
            <span className="contact-action-tag">Send Email</span>
          </a>

          <a href="tel:03340004884" className="contact-info-item clickable">
            <div className="contact-icon-box">
              <Phone size={18} />
            </div>
            <div className="contact-text-box">
              <span className="contact-label">Phone & WhatsApp</span>
              <strong className="contact-value">03340004884</strong>
            </div>
            <span className="contact-action-tag">Call / Message</span>
          </a>
        </div>

        {/* Quick Message Form */}
        <div className="contact-form-section">
          <h4 className="form-subheading">
            <MessageSquare size={15} className="cyan-sparkle" />
            <span>Quick Message</span>
          </h4>
          <textarea 
            rows={3} 
            placeholder="Type your message or inquiry here..." 
            className="contact-textarea"
          />
          <button 
            type="button" 
            className="contact-send-btn"
            onClick={() => {
              window.location.href = "mailto:abaanok1@gmail.com?subject=Resume Builder Inquiry";
            }}
          >
            <Send size={15} />
            <span>Send Direct Message</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
