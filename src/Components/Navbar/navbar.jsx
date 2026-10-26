import React, { useState, useRef, useEffect } from "react";
import "./navbar.css";
import logo from "../../assets/logo.svg";
import { useAuth } from "../../context/AuthContext";
import { 
  PanelLeftClose, 
  PanelLeft, 
  Eye, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Cloud,
  LogOut,
  User as UserIcon,
  ChevronDown
} from "lucide-react";

const Navbar = ({ 
  isSidebarCollapsed, 
  toggleSidebar, 
  activeTab, 
  setActiveTab,
  onDownload,
  onPreviewToggle,
  isPreviewMode,
  onSaveResume,
  isSaving,
  lastSavedTime,
  openAuthModal,
  onContactClick,
  score = 85
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Compute initials from user's name (e.g. "Alex Morgan" -> "AM")
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="navbar-container">
      {/* Left: Sidebar Toggle + Brand Logo */}
      <div className="navbar-left">
        <button 
          className="sidebar-toggle-btn" 
          onClick={toggleSidebar} 
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar"
        >
          {isSidebarCollapsed ? <PanelLeft size={19} /> : <PanelLeftClose size={19} />}
        </button>

        <div className="brand-wrapper">
          <img src={logo} alt="Resume Builder" className="brand-logo-img" />
          <span className="brand-badge">
            <Sparkles size={11} className="badge-sparkle" />
            AI PRO
          </span>
        </div>
      </div>

      {/* Middle: Interactive Navigation Tabs */}
      <nav className="navbar-center">
        <ul className="nav-pill-list">
          {[
            { id: "editor", label: "Editor" },
            { id: "templates", label: "Templates" },
            { id: "ats-scanner", label: "ATS Scanner" }
          ].map((tab) => (
            <li key={tab.id}>
              <button
                className={`nav-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && <span className="active-glow-pill" />}
              </button>
            </li>
          ))}
          <li>
            <button
              className="nav-tab-btn contact-btn-highlight"
              onClick={onContactClick}
              title="Developer & Support Contact"
            >
              Contact Us
            </button>
          </li>
        </ul>
      </nav>

      {/* Right: Cloud Sync, ATS Score, Actions, and User Account */}
      <div className="navbar-right">
        {/* Cloud Save Button */}
        {isAuthenticated && (
          <button 
            className="btn-cloud-save" 
            onClick={onSaveResume}
            disabled={isSaving}
            title="Save resume to your MongoDB Atlas account"
          >
            <Cloud size={15} className={`cloud-icon ${isSaving ? 'cloud-pulse' : ''}`} />
            <span>{isSaving ? "Saving..." : (lastSavedTime ? "Saved" : "Save Resume")}</span>
          </button>
        )}

        {/* ATS Score Indicator Widget */}
        <div className="ats-mini-chip" title="ATS Compatibility Score">
          <div className="ats-dot-pulse" />
          <span className="ats-label">ATS</span>
          <span className="ats-score">{score}%</span>
        </div>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button 
            className={`btn-secondary-glass ${isPreviewMode ? "active-preview" : ""}`}
            onClick={onPreviewToggle}
            title="Toggle Live Fullscreen Preview"
          >
            <Eye size={16} className="btn-icon" />
            <span>{isPreviewMode ? "Close Preview" : "Preview"}</span>
          </button>

          <button 
            className="btn-cyan-gradient" 
            onClick={onDownload}
            title="Download or Print Resume as PDF"
          >
            <Download size={16} className="btn-icon" />
            <span>Export PDF</span>
          </button>
        </div>

        {/* User Account / Login Buttons */}
        {isAuthenticated ? (
          <div className="user-profile-menu-container" ref={dropdownRef}>
            <button 
              className="user-profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title="Click to view account"
            >
              <div className="avatar-circle">
                <span>{getInitials(user?.name)}</span>
                <span className="status-online" />
              </div>
              <div className="user-name-display">
                <span className="user-greeting">Signed in</span>
                <span className="user-full-name">{user?.name}</span>
              </div>
              <ChevronDown size={14} className={`chevron-dropdown ${dropdownOpen ? 'rotated' : ''}`} />
            </button>

            {/* Account Dropdown Menu */}
            {dropdownOpen && (
              <div className="profile-dropdown-card">
                <div className="dropdown-user-info">
                  <p className="dropdown-name">{user?.name}</p>
                  <p className="dropdown-email">{user?.email}</p>
                  <span className="dropdown-tag">MongoDB Synced</span>
                </div>

                <div className="dropdown-divider" />

                <button 
                  className="dropdown-action-item"
                  onClick={() => {
                    onSaveResume();
                    setDropdownOpen(false);
                  }}
                >
                  <Cloud size={15} className="dropdown-icon" />
                  <span>Save Resume to Cloud</span>
                </button>

                <button 
                  className="dropdown-action-item logout"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                >
                  <LogOut size={15} className="dropdown-icon danger" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons-group">
            <button 
              className="btn-signin-nav" 
              onClick={() => openAuthModal('login')}
            >
              Sign In
            </button>
            <button 
              className="btn-signup-nav" 
              onClick={() => openAuthModal('signup')}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;