import React from 'react';
import './sidebar.css';
import { 
  FileText, 
  Layout, 
  Columns, 
  FilePlus, 
  PlusCircle, 
  Sparkles, 
  Palette, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  FolderPlus,
  CheckCircle2
} from 'lucide-react';

const Sidebar = ({ 
  isSidebarCollapsed, 
  activeTemplate, 
  onSelectTemplate, 
  onInsertSection 
}) => {
  const templates = [
    {
      id: 'blank',
      name: 'Blank Document',
      desc: 'Completely empty MS Word page to write freely from scratch',
      icon: FilePlus,
      tag: 'Empty'
    },
    {
      id: 'modern',
      name: 'Modern Outline',
      desc: 'Clean structure with placeholders for Summary, Work, Education',
      icon: Layout,
      tag: 'Popular'
    },
    {
      id: 'executive',
      name: 'Executive Classic',
      desc: 'Traditional centered layout with elegant dividers',
      icon: FileText,
      tag: 'Classic'
    },
    {
      id: 'two-column',
      name: 'Two-Column Grid',
      desc: 'Side column for contact & skills with main column for history',
      icon: Columns,
      tag: 'Split'
    }
  ];

  const quickInsertSections = [
    { type: 'header', label: 'Name & Header', icon: User },
    { type: 'summary', label: 'Summary Section', icon: Sparkles },
    { type: 'experience', label: 'Experience Block', icon: Briefcase },
    { type: 'education', label: 'Education Block', icon: GraduationCap },
    { type: 'skills', label: 'Skills Section', icon: Code2 },
    { type: 'projects', label: 'Projects Section', icon: FolderPlus }
  ];

  return (
    <aside className={`sidebar-container ${isSidebarCollapsed ? 'collapsed' : ''} no-print`}>
      <div className="sidebar-nav-scroll">
        {/* Section 1: Empty Templates */}
        <div className="sidebar-group">
          {!isSidebarCollapsed && (
            <div className="sidebar-group-title">
              EMPTY TEMPLATES
            </div>
          )}

          <div className="template-cards-list">
            {templates.map((tpl) => {
              const Icon = tpl.icon;
              const isSelected = activeTemplate === tpl.id;

              return (
                <button
                  key={tpl.id}
                  className={`template-select-card ${isSelected ? 'active-template' : ''}`}
                  onClick={() => onSelectTemplate(tpl.id)}
                  title={isSidebarCollapsed ? tpl.name : ''}
                >
                  <div className="tpl-icon-box">
                    <Icon size={18} />
                  </div>

                  {!isSidebarCollapsed && (
                    <div className="tpl-info">
                      <div className="tpl-header-row">
                        <span className="tpl-name">{tpl.name}</span>
                        <span className="tpl-tag">{tpl.tag}</span>
                      </div>
                      <p className="tpl-desc">{tpl.desc}</p>
                    </div>
                  )}

                  {isSelected && <div className="active-strip" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Quick Insert Blocks */}
        {!isSidebarCollapsed && (
          <div className="sidebar-group">
            <div className="sidebar-group-title">
              INSERT EMPTY BLOCKS
            </div>

            <div className="quick-insert-grid">
              {quickInsertSections.map((sec, i) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={i}
                    className="insert-block-btn"
                    onClick={() => onInsertSection(sec.type)}
                    title={`Insert empty ${sec.label}`}
                  >
                    <PlusCircle size={15} className="insert-plus-icon" />
                    <Icon size={15} />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom MS Word Quick Tip */}
      {!isSidebarCollapsed && (
        <div className="sidebar-bottom-widget">
          <div className="word-tip-card">
            <div className="tip-header">
              <Sparkles size={14} className="cyan-sparkle" />
              <span>MS Word Mode</span>
            </div>
            <p className="tip-text">
              Click anywhere directly on the paper to type, highlight text to format, or press <strong>Ctrl+B</strong> for bold!
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;