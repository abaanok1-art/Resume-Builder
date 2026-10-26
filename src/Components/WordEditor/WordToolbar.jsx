import React from 'react';
import './WordToolbar.css';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Type, 
  Minus, 
  Sparkles, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Palette
} from 'lucide-react';

const WordToolbar = ({ 
  currentFont, 
  setCurrentFont, 
  currentFontSize, 
  setCurrentFontSize,
  accentColor,
  setAccentColor,
  zoomLevel,
  setZoomLevel,
  onFormatDoc,
  onInsertElement,
  onResetDocument
}) => {
  const fonts = [
    { label: "Calibri", value: "'Calibri', 'Segoe UI', sans-serif" },
    { label: "Arial", value: "Arial, Helvetica, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Poppins", value: "'Poppins', sans-serif" },
    { label: "Inter", value: "'Inter', sans-serif" }
  ];

  const fontSizes = ["10pt", "11pt", "12pt", "14pt", "16pt", "18pt", "24pt", "30pt"];

  const colors = [
    { name: "Obsidian", value: "#0f172a" },
    { name: "Cyan Blue", value: "#0284c7" },
    { name: "Deep Navy", value: "#1e3a8a" },
    { name: "Slate Grey", value: "#475569" },
    { name: "Emerald", value: "#059669" }
  ];

  return (
    <div className="word-toolbar-container no-print">
      {/* 1. Font Family & Size Selectors */}
      <div className="toolbar-group">
        <select 
          className="toolbar-select font-select"
          value={currentFont}
          onChange={(e) => setCurrentFont(e.target.value)}
          title="Font Family"
        >
          {fonts.map((f, i) => (
            <option key={i} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select 
          className="toolbar-select size-select"
          value={currentFontSize}
          onChange={(e) => {
            setCurrentFontSize(e.target.value);
            onFormatDoc('fontSize', e.target.value);
          }}
          title="Font Size"
        >
          {fontSizes.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="toolbar-divider" />

      {/* 2. Text Formatting (Bold, Italic, Underline) */}
      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => onFormatDoc('bold')} 
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => onFormatDoc('italic')} 
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => onFormatDoc('underline')} 
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* 3. Text Alignment */}
      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => onFormatDoc('justifyLeft')} 
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => onFormatDoc('justifyCenter')} 
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => onFormatDoc('justifyRight')} 
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => onFormatDoc('justifyFull')} 
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* 4. Lists */}
      <div className="toolbar-group">
        <button 
          className="toolbar-btn" 
          onClick={() => onFormatDoc('insertUnorderedList')} 
          title="Bulleted List"
        >
          <List size={16} />
        </button>
        <button 
          className="toolbar-btn" 
          onClick={() => onFormatDoc('insertOrderedList')} 
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* 5. Quick Insert Elements */}
      <div className="toolbar-group insert-group">
        <button 
          className="toolbar-btn insert-btn" 
          onClick={() => onInsertElement('heading')} 
          title="Insert Heading"
        >
          <Heading1 size={15} />
          <span>Heading</span>
        </button>
        <button 
          className="toolbar-btn insert-btn" 
          onClick={() => onInsertElement('divider')} 
          title="Insert Divider Line"
        >
          <Minus size={15} />
          <span>Divider</span>
        </button>
        <button 
          className="toolbar-btn insert-btn" 
          onClick={() => onInsertElement('jobRow')} 
          title="Insert Job / Role Row"
        >
          <Type size={15} />
          <span>Role Row</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* 6. Accent Color Palette */}
      <div className="toolbar-group colors-group" title="Accent Color">
        {colors.map((c, i) => (
          <button 
            key={i}
            className={`color-dot ${accentColor === c.value ? 'active-color' : ''}`}
            style={{ backgroundColor: c.value }}
            onClick={() => setAccentColor(c.value)}
            title={c.name}
          />
        ))}
      </div>

      <div className="toolbar-divider" />

      {/* 7. Zoom & Reset */}
      <div className="toolbar-group zoom-group">
        <button 
          className="toolbar-btn" 
          onClick={() => setZoomLevel(prev => Math.max(prev - 10, 70))}
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>
        <span className="zoom-text">{zoomLevel}%</span>
        <button 
          className="toolbar-btn" 
          onClick={() => setZoomLevel(prev => Math.min(prev + 10, 140))}
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>

        <button 
          className="toolbar-btn reset-btn" 
          onClick={onResetDocument}
          title="Clear / Reset Document to Blank"
        >
          <RotateCcw size={14} />
          <span>Clear Page</span>
        </button>
      </div>
    </div>
  );
};

export default WordToolbar;

