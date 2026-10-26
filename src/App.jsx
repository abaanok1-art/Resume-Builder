import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Navbar from './Components/Navbar/navbar';
import Sidebar from './Components/Sidebar/sidebar';
import WordToolbar from './Components/WordEditor/WordToolbar';
import AuthModal from './Components/Auth/AuthModal';
import ContactModal from './Components/Contact/ContactModal';
import { useAuth } from './context/AuthContext';
import { 
  Sparkles, 
  Printer, 
  Cloud, 
  RotateCcw, 
  FileText, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

const templateGenerators = {
  blank: (accent) => `
    <h1 style="text-align: center; font-size: 24pt; margin-bottom: 4px; color: ${accent}; font-weight: bold;">[ YOUR NAME ]</h1>
    <p style="text-align: center; color: #64748b; font-size: 10.5pt; margin-bottom: 16px;">email@example.com | (555) 000-0000 | City, Country | linkedin.com/in/profile</p>
    <hr style="border: none; border-top: 1px solid #cbd5e1; margin-bottom: 24px;" />
    <p style="font-size: 11.5pt; line-height: 1.6; color: #334155;">Click anywhere on this document to start typing your resume information...</p>
  `,

  modern: (accent) => `
    <h1 style="color: ${accent}; font-size: 26pt; font-weight: bold; margin-bottom: 2px; text-transform: uppercase;">[ YOUR FULL NAME ]</h1>
    <p style="font-size: 13pt; color: #475569; margin-bottom: 8px; font-weight: 600;">[ Target Job Title / Professional Role ]</p>
    <p style="font-size: 10pt; color: #64748b; margin-bottom: 20px;">[ email@example.com ] • [ (555) 000-0000 ] • [ City, State / Remote ] • [ linkedin.com/in/username ]</p>

    <h2 style="font-size: 12.5pt; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase; font-weight: bold;">PROFESSIONAL SUMMARY</h2>
    <p style="font-size: 11pt; line-height: 1.5; color: #334155; margin-bottom: 16px;">[ Click here to write 2-3 sentences summarizing your career highlights, core strengths, and what value you bring to the organization... ]</p>

    <h2 style="font-size: 12.5pt; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase; font-weight: bold;">WORK EXPERIENCE</h2>
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11.5pt; color: #0f172a;">
      <span>[ Job Title / Position ]</span>
      <span style="font-weight: normal; color: #64748b; font-size: 10.5pt;">[ Start Date – Present / End Date ]</span>
    </div>
    <div style="font-size: 10.5pt; color: #475569; font-style: italic; margin-bottom: 6px;">[ Company Name – City, State ]</div>
    <ul style="margin-left: 20px; font-size: 11pt; line-height: 1.6; color: #334155; margin-bottom: 16px;">
      <li>[ Describe a key accomplishment, project leadership, or responsibility with measurable impact... ]</li>
      <li>[ Accelerated team productivity, optimized workflow, or reduced costs by X%... ]</li>
      <li>[ Collaborated cross-functionally to deliver high-quality deliverables on schedule... ]</li>
    </ul>

    <h2 style="font-size: 12.5pt; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase; font-weight: bold;">EDUCATION</h2>
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11.5pt; color: #0f172a;">
      <span>[ Degree Title, Major / Field of Study ]</span>
      <span style="font-weight: normal; color: #64748b; font-size: 10.5pt;">[ Graduation Year ]</span>
    </div>
    <div style="font-size: 10.5pt; color: #475569; margin-bottom: 16px;">[ University or Institution Name – City, State ]</div>

    <h2 style="font-size: 12.5pt; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase; font-weight: bold;">CORE SKILLS</h2>
    <p style="font-size: 11pt; line-height: 1.6; color: #334155;">
      <strong>Technical Skills:</strong> [ Skill 1, Skill 2, Skill 3, Skill 4, Skill 5 ]<br/>
      <strong>Tools & Technologies:</strong> [ Tool 1, Tool 2, Tool 3, Tool 4 ]
    </p>
  `,

  executive: (accent) => `
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 28pt; font-weight: bold; letter-spacing: 1px; color: ${accent}; margin-bottom: 4px; text-transform: uppercase;">[ FULL NAME ]</h1>
      <p style="font-size: 12pt; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">[ Executive Title / Senior Consultant ]</p>
      <p style="font-size: 10pt; color: #64748b;">[ City, Country ] | [ Phone Number ] | [ Email Address ] | [ LinkedIn Profile ]</p>
      <div style="border-top: 3px double ${accent}; margin-top: 14px;"></div>
    </div>

    <h3 style="font-size: 12pt; font-weight: bold; color: ${accent}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">EXECUTIVE SUMMARY</h3>
    <p style="font-size: 11pt; line-height: 1.6; color: #334155; margin-bottom: 18px;">[ Accomplished executive with demonstrated track record in strategic planning, operational excellence, and team leadership. Driven to scale organization capabilities and maximize ROI. ]</p>

    <h3 style="font-size: 12pt; font-weight: bold; color: ${accent}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">PROFESSIONAL EXPERIENCE</h3>
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11pt; color: #0f172a;">
      <span>[ Position / Executive Title ]</span>
      <span style="color: #64748b; font-weight: normal;">[ 2021 – Present ]</span>
    </div>
    <div style="font-size: 10.5pt; color: #475569; font-style: italic; margin-bottom: 6px;">[ Enterprise Organization – Location ]</div>
    <ul style="margin-left: 20px; font-size: 11pt; line-height: 1.6; color: #334155; margin-bottom: 18px;">
      <li>[ Led strategic transformation initiatives delivering $X million in added value... ]</li>
      <li>[ Managed cross-functional teams across engineering, product, and operations... ]</li>
    </ul>

    <h3 style="font-size: 12pt; font-weight: bold; color: ${accent}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">EDUCATION & CREDENTIALS</h3>
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11pt; color: #0f172a;">
      <span>[ Master of Business Administration (MBA) / Degree ]</span>
      <span style="color: #64748b; font-weight: normal;">[ Year ]</span>
    </div>
    <div style="font-size: 10.5pt; color: #475569;">[ Graduate School of Business – Location ]</div>
  `,

  'two-column': (accent) => `
    <div style="border-bottom: 2px solid ${accent}; padding-bottom: 12px; margin-bottom: 20px;">
      <h1 style="color: ${accent}; font-size: 24pt; font-weight: bold; margin-bottom: 2px;">[ YOUR FULL NAME ]</h1>
      <p style="font-size: 12pt; color: #475569; font-weight: 600;">[ Professional Title / Specialization ]</p>
    </div>

    <div style="display: flex; gap: 28px;">
      <!-- Left Column: Contact & Skills -->
      <div style="width: 32%; border-right: 1px solid #e2e8f0; padding-right: 18px;">
        <h4 style="font-size: 11pt; color: ${accent}; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">CONTACT</h4>
        <p style="font-size: 10pt; color: #334155; line-height: 1.6; margin-bottom: 16px;">
          [ email@example.com ]<br/>
          [ 03340004884 ]<br/>
          [ City, Country ]<br/>
          [ linkedin.com/in/url ]
        </p>

        <h4 style="font-size: 11pt; color: ${accent}; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">SKILLS</h4>
        <ul style="margin-left: 16px; font-size: 10pt; color: #334155; line-height: 1.6; margin-bottom: 16px;">
          <li>[ Skill 1 ]</li>
          <li>[ Skill 2 ]</li>
          <li>[ Skill 3 ]</li>
          <li>[ Skill 4 ]</li>
        </ul>

        <h4 style="font-size: 11pt; color: ${accent}; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">EDUCATION</h4>
        <p style="font-size: 10pt; color: #334155; line-height: 1.5;">
          <strong>[ Degree Name ]</strong><br/>
          [ University Name ]<br/>
          <span style="color: #64748b;">[ 2020 – 2024 ]</span>
        </p>
      </div>

      <!-- Right Column: Experience & Projects -->
      <div style="width: 68%;">
        <h3 style="font-size: 12pt; color: ${accent}; text-transform: uppercase; font-weight: bold; margin-bottom: 6px;">PROFILE</h3>
        <p style="font-size: 10.5pt; line-height: 1.5; color: #334155; margin-bottom: 16px;">[ Enter an impactful summary of your career achievements and core competencies... ]</p>

        <h3 style="font-size: 12pt; color: ${accent}; text-transform: uppercase; font-weight: bold; margin-bottom: 6px;">EXPERIENCE</h3>
        <div style="margin-bottom: 14px;">
          <div style="font-weight: bold; font-size: 11pt; color: #0f172a;">[ Role Title ] – <span style="font-weight: normal; color: #475569;">[ Company Name ]</span></div>
          <div style="font-size: 10pt; color: #64748b; margin-bottom: 4px;">[ Month, Year – Present ]</div>
          <ul style="margin-left: 18px; font-size: 10.5pt; color: #334155; line-height: 1.5;">
            <li>[ Accomplishment detail with numbers or outcomes... ]</li>
            <li>[ Key responsibility or system engineered... ]</li>
          </ul>
        </div>
      </div>
    </div>
  `
};

function App() {
  const { user, token, isAuthenticated } = useAuth();

  // Navigation & Workspace states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [accentColor, setAccentColor] = useState("#0284c7");
  const [currentFont, setCurrentFont] = useState("'Calibri', 'Segoe UI', sans-serif");
  const [currentFontSize, setCurrentFontSize] = useState("11pt");
  const [zoomLevel, setZoomLevel] = useState(100);

  // Cloud Sync & Saving States
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Ref to the MS Word Document Page (contentEditable element)
  const docRef = useRef(null);

  // Show Toast Alert
  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initialize document with default template
  useEffect(() => {
    if (docRef.current && !docRef.current.innerHTML.trim()) {
      const generator = templateGenerators[activeTemplate] || templateGenerators.modern;
      docRef.current.innerHTML = generator(accentColor);
    }
  }, []);

  // When user logs in, load their saved document from MongoDB Atlas
  useEffect(() => {
    const fetchUserResume = async () => {
      if (!isAuthenticated || !token) return;

      try {
        const res = await fetch('/api/resume', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success && data.resume && data.resume.documentHtml) {
          if (docRef.current) {
            docRef.current.innerHTML = data.resume.documentHtml;
          }
          if (data.resume.templateName) {
            setActiveTemplate(data.resume.templateName);
          }
          setLastSavedTime(new Date(data.resume.updatedAt || Date.now()));
          showToast(`Welcome back, ${user?.name}! Your resume document has been loaded.`);
        }
      } catch (err) {
        console.error("Error loading resume:", err);
      }
    };

    fetchUserResume();
  }, [isAuthenticated, token]);

  // Handle Template Selection (Loads clean empty template)
  const handleSelectTemplate = (templateId) => {
    setActiveTemplate(templateId);
    const generator = templateGenerators[templateId] || templateGenerators.blank;
    if (docRef.current) {
      docRef.current.innerHTML = generator(accentColor);
    }
    showToast(`Loaded empty ${templateId.toUpperCase()} template.`);
  };

  // Handle Accent Color Change
  const handleAccentColorChange = (newColor) => {
    setAccentColor(newColor);
    // Optionally re-render or let user colorize text
  };

  // Format Document Commands (Bold, Italic, Alignments, Lists)
  const handleFormatDoc = (command, value = null) => {
    if (docRef.current) {
      docRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  // Quick Insert Sections
  const handleInsertSection = (type) => {
    if (!docRef.current) return;
    docRef.current.focus();

    let htmlToInsert = '';
    switch (type) {
      case 'heading':
        htmlToInsert = `<h2 style="color: ${accentColor}; border-bottom: 2px solid ${accentColor}; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase;">[ NEW SECTION HEADING ]</h2><p>[ Type section description or bullet points here... ]</p>`;
        break;
      case 'summary':
        htmlToInsert = `<h2 style="color: ${accentColor}; border-bottom: 2px solid ${accentColor}; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase;">PROFESSIONAL SUMMARY</h2><p style="font-size: 11pt; line-height: 1.5; color: #334155;">[ Enter 2-3 sentences highlighting your qualifications and achievements... ]</p>`;
        break;
      case 'experience':
        htmlToInsert = `
          <div style="margin-top: 16px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11.5pt; color: #0f172a;">
              <span>[ Position / Job Title ]</span>
              <span style="font-weight: normal; color: #64748b; font-size: 10pt;">[ Dates ]</span>
            </div>
            <div style="font-size: 10.5pt; color: #475569; font-style: italic;">[ Company Name – Location ]</div>
            <ul style="margin-left: 20px; font-size: 11pt; line-height: 1.6; color: #334155; margin-top: 4px;">
              <li>[ Key achievement or contribution... ]</li>
              <li>[ Project milestone or technical delivery... ]</li>
            </ul>
          </div>
        `;
        break;
      case 'education':
        htmlToInsert = `
          <div style="margin-top: 14px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11pt; color: #0f172a;">
              <span>[ Degree / Diploma Name ]</span>
              <span style="font-weight: normal; color: #64748b; font-size: 10pt;">[ Graduation Year ]</span>
            </div>
            <div style="font-size: 10.5pt; color: #475569;">[ College or University Name ]</div>
          </div>
        `;
        break;
      case 'skills':
        htmlToInsert = `
          <h2 style="color: ${accentColor}; border-bottom: 2px solid ${accentColor}; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase;">TECHNICAL SKILLS</h2>
          <p style="font-size: 11pt; line-height: 1.6; color: #334155;">
            <strong>Core:</strong> [ Skill 1, Skill 2, Skill 3, Skill 4 ]<br/>
            <strong>Tools:</strong> [ Tool 1, Tool 2, Tool 3 ]
          </p>
        `;
        break;
      case 'projects':
        htmlToInsert = `
          <h2 style="color: ${accentColor}; border-bottom: 2px solid ${accentColor}; padding-bottom: 3px; margin-top: 18px; margin-bottom: 8px; text-transform: uppercase;">PROJECTS</h2>
          <div style="font-size: 11pt; font-weight: bold; color: #0f172a;">[ Project Name ] – <span style="font-weight: normal; color: #475569;">[ Technologies Used ]</span></div>
          <p style="font-size: 10.5pt; color: #334155; margin-top: 3px; line-height: 1.5;">[ Brief overview of what you built, problem solved, and link to code/demo... ]</p>
        `;
        break;
      case 'divider':
        htmlToInsert = `<hr style="border: none; border-top: 1px solid #cbd5e1; margin: 18px 0;" />`;
        break;
      case 'jobRow':
        htmlToInsert = `
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11pt; color: #0f172a; margin-top: 10px;">
            <span>[ Job Title ] – <span style="font-weight: normal; color: #475569;">[ Company Name ]</span></span>
            <span style="font-weight: normal; color: #64748b; font-size: 10pt;">[ 2023 – Present ]</span>
          </div>
        `;
        break;
      default:
        htmlToInsert = `<p>[ Type text here... ]</p>`;
    }

    document.execCommand('insertHTML', false, htmlToInsert);
  };

  // Reset document to empty page
  const handleResetDocument = () => {
    if (window.confirm("Clear this document and start with an empty page?")) {
      if (docRef.current) {
        docRef.current.innerHTML = `
          <h1 style="text-align: center; font-size: 24pt; font-weight: bold; color: ${accentColor}; margin-bottom: 4px;">[ YOUR NAME ]</h1>
          <p style="text-align: center; color: #64748b; font-size: 10.5pt; margin-bottom: 20px;">[ email@example.com | (555) 000-0000 | City, Country ]</p>
          <hr style="border: none; border-top: 1px solid #cbd5e1; margin-bottom: 20px;" />
          <p style="font-size: 11pt; color: #334155;">[ Click here to write your resume... ]</p>
        `;
      }
      showToast("Document cleared to blank template.");
    }
  };

  // Save Document to MongoDB Atlas account
  const handleSaveResume = async () => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      showToast("Please sign in or create an account to save your resume to the cloud.", true);
      return;
    }

    const currentHtml = docRef.current ? docRef.current.innerHTML : '';
    setIsSaving(true);

    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          documentHtml: currentHtml,
          templateName: activeTemplate,
          documentData: {
            font: currentFont,
            fontSize: currentFontSize,
            accent: accentColor
          }
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save to MongoDB');
      }

      setLastSavedTime(new Date());
      showToast("✅ Resume saved successfully to your MongoDB Atlas account!");
    } catch (err) {
      showToast(err.message || "Failed to save. Ensure your MongoDB Atlas cluster link is configured.", true);
    } finally {
      setIsSaving(false);
    }
  };

  // Export / Print PDF (Standard A4 Print)
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="app-container">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`toast-banner ${toastMessage.isError ? "error" : "success"}`}>
          {toastMessage.isError ? <AlertCircle size={17} /> : <CheckCircle size={17} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar 
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownload={handleExportPDF}
        onPreviewToggle={() => {}}
        isPreviewMode={false}
        onSaveResume={handleSaveResume}
        isSaving={isSaving}
        lastSavedTime={lastSavedTime}
        openAuthModal={(mode) => {
          setAuthModalMode(mode);
          setAuthModalOpen(true);
        }}
        onContactClick={() => setContactModalOpen(true)}
        score={90}
      />

      {/* MS Word Ribbon Toolbar */}
      <WordToolbar 
        currentFont={currentFont}
        setCurrentFont={setCurrentFont}
        currentFontSize={currentFontSize}
        setCurrentFontSize={setCurrentFontSize}
        accentColor={accentColor}
        setAccentColor={handleAccentColorChange}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        onFormatDoc={handleFormatDoc}
        onInsertElement={handleInsertSection}
        onResetDocument={handleResetDocument}
      />

      {/* Main Body: Left Sidebar + Centered MS Word Paper Canvas */}
      <div className="main-layout">
        <Sidebar 
          isSidebarCollapsed={isSidebarCollapsed}
          activeTemplate={activeTemplate}
          onSelectTemplate={handleSelectTemplate}
          onInsertSection={handleInsertSection}
        />

        {/* Word Document Canvas */}
        <main className="word-canvas-viewport">
          <div className="canvas-header-bar no-print">
            <div className="doc-meta-info">
              <FileText size={16} className="cyan-sparkle" />
              <span className="doc-name">
                {isAuthenticated ? `${user?.name}'s Resume Document` : "Untitled Resume.docx"}
              </span>
              <span className="doc-status-badge">
                {isAuthenticated ? "Cloud Sync Ready" : "Local Draft"}
              </span>
            </div>

            <div className="canvas-quick-actions">
              <button 
                className="btn-print-doc" 
                onClick={handleExportPDF}
                title="Print or Save as PDF"
              >
                <Printer size={15} />
                <span>Print / Download PDF</span>
              </button>
            </div>
          </div>

          {/* Centered A4 Document Sheet */}
          <div 
            className="a4-sheet-scroller"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <div 
              ref={docRef}
              className="a4-document-paper"
              id="resume-document"
              contentEditable={true}
              suppressContentEditableWarning={true}
              spellCheck={true}
              style={{ fontFamily: currentFont }}
            />
          </div>
        </main>
      </div>

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={() => {
          showToast("Authentication successful! Cloud sync is now active.");
        }}
      />

      {/* Contact Us Modal (Abaan Mubeen) */}
      <ContactModal 
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </div>
  );
}

export default App;
