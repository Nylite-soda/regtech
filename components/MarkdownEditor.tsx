import { useState, useRef, useEffect, useCallback } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  Table,
  Maximize,
  Minimize,
  Strikethrough,
  X,
  Type,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Indent,
  Outdent,
} from "lucide-react";
import { fullscreen } from "@uiw/react-markdown-editor";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string | null;
  rows?: number;
  helpText?: string;
  className?: string;
}

interface ToolbarButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
}

// Initialize markdown parser once
const md = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true,
  typographer: true,
  // Enhanced list settings
  // listIndent: 2, // Match the 2-space indentation used in the editor
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return "";
  },
});

const bulletTypes = ["- ", "* ", "+ "];
const emojis = ["😀", "😂", "👍", "❤️", "🔥", "🎉", "🤔", "👏"];

function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder = "Type here...",
  error = null,
  rows = 6,
  helpText = "Markdown formatting supported",
  className = "",
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [previewMode, setPreviewMode] = useState<"edit" | "preview" | "split">(
    "edit"
  );
  const [bulletType, setBulletType] = useState(bulletTypes[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({
    top: 0,
    left: 0,
  });

  // Memoize the word and character count calculations
  const { wordCount, charCount } = useCallback(() => {
    return {
      wordCount: value.trim() ? value.trim().split(/\s+/).length : 0,
      charCount: value.length,
    };
  }, [value])();

  const insertFormatting = useCallback(
    (start: string, end: string = "", placeholderText = "") => {
      const ta = textareaRef.current;
      if (!ta) return;

      const s = ta.selectionStart;
      const e = ta.selectionEnd;
      const before = value.slice(0, s);
      const sel = value.slice(s, e) || placeholderText || getPlaceholder(start);
      const after = value.slice(e);
      const newText = before + start + sel + end + after;

      onChange(newText);

      setTimeout(() => {
        ta.focus();
        const cursorPos =
          s + start.length + (sel === getPlaceholder(start) ? 0 : sel.length);
        ta.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    },
    [value, onChange]
  );

  const insertTemplate = useCallback(
    (template: string, cursorOffset = 0) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const s = ta.selectionStart;
      const e = ta.selectionEnd;
      const before = value.slice(0, s);
      const after = value.slice(e);
      const newText = before + template + after;

      onChange(newText);

      setTimeout(() => {
        ta.focus();
        const pos = s + template.length + cursorOffset;
        ta.setSelectionRange(pos, pos);
      }, 0);
    },
    [value, onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // The following function was commented in original code - leaving it commented
  // const handleDrop = (e: React.DragEvent) => {
  //   e.preventDefault();
  //   const files = e.dataTransfer.files;
  //   if (files.length > 0) {
  //     const file = files[0];
  //     if (file.type.startsWith('image/')) {
  //       handleImageUpload(file);
  //     }
  //   }
  // };

  const getPlaceholder = (fmt: string) => {
    if (fmt.trim().startsWith("#")) return "Heading";
    if (fmt.startsWith("**")) return "bold text";
    if (fmt.startsWith("_")) return "italic text";
    if (fmt.startsWith("[")) return "link text";
    if (fmt.startsWith("```")) return "code";
    return "";
  };

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const pos = ta.selectionStart;
      const lines = value.slice(0, pos).split("\n");
      const line = lines[lines.length - 1];
      const matchList = line.match(/^(\s*)([-*+]|\d+\.)\s+/);
      const indentation = matchList ? matchList[1] : "";
      const bulletOrNumber = matchList ? matchList[2] : "";

      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            insertFormatting("**", "**", "bold text");
            break;
          case "i":
            e.preventDefault();
            insertFormatting("_", "_", "italic text");
            break;
          case "k":
            e.preventDefault();
            insertFormatting("[", "](url)", "link text");
            break;
          case "e":
            e.preventDefault();
            positionEmojiPicker(ta);
            setShowEmojiPicker(true);
            break;
        }
      }

      // Handle Enter key for lists and sublists
      if (e.key === "Enter") {
        if (matchList) {
          e.preventDefault();
          const isNumbered = /\d+\./.test(bulletOrNumber);
          const nextBullet = isNumbered
            ? `${parseInt(bulletOrNumber, 10) + 1}. `
            : bulletType;
          const textToInsert = `\n${indentation}${
            isNumbered ? nextBullet : bulletType
          } `;
          const newText = value.slice(0, pos) + textToInsert + value.slice(pos);
          onChange(newText);
          setTimeout(() => {
            const newPos = pos + textToInsert.length;
            ta.setSelectionRange(newPos, newPos);
          });
        }
      }

      // Handle Tab key for indenting lists
      if (e.key === "Tab" && !e.shiftKey) {
        if (matchList) {
          e.preventDefault();
          const newIndentation = indentation + "  "; // Increase indentation by two spaces
          const newLine = line.replace(
            /^(\s*)([-*+]|\d+\.)\s+/,
            `${newIndentation}${bulletOrNumber} `
          );
          const before = value.slice(0, pos - line.length);
          const after = value.slice(pos);
          onChange(before + newLine + after);
          setTimeout(() => ta.setSelectionRange(pos + 2, pos + 2));
        }
      }

      // Handle Shift+Tab for outdenting lists
      if (e.key === "Tab" && e.shiftKey) {
        if (matchList && indentation.length >= 2) {
          e.preventDefault();
          const newIndentation = indentation.slice(0, -2);
          const newLine = line.replace(
            /^(\s*)([-*+]|\d+\.)\s+/,
            `${newIndentation}${bulletOrNumber} `
          );
          const before = value.slice(0, pos - line.length);
          const after = value.slice(pos);
          onChange(before + newLine + after);
          setTimeout(() => ta.setSelectionRange(pos - 2, pos - 2));
        }
      }

      // Handle colon for emoji suggestions
      if (e.key === ":") {
        positionEmojiPicker(ta);
        setShowEmojiPicker(true);
      }
    },
    [value, onChange, insertFormatting, bulletType]
  );

  const positionEmojiPicker = (textareaElement: HTMLTextAreaElement) => {
    const rect = textareaElement.getBoundingClientRect();
    const cursorPos = textareaElement.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lines = textBeforeCursor.split("\n");
    const currentLine = lines[lines.length - 1];

    // Create a temporary element to measure text width
    const tempSpan = document.createElement("span");
    tempSpan.style.visibility = "hidden";
    tempSpan.style.position = "absolute";
    tempSpan.style.whiteSpace = "pre";
    tempSpan.style.font = window.getComputedStyle(textareaElement).font;
    tempSpan.textContent = currentLine;
    document.body.appendChild(tempSpan);

    // Get the relative position of the cursor
    const lineHeight =
      parseInt(window.getComputedStyle(textareaElement).lineHeight) || 20;
    const scrollTop = textareaElement.scrollTop;

    // Calculate position
    const top = rect.top + (lines.length - 1) * lineHeight - scrollTop;
    const left = rect.left + tempSpan.clientWidth;

    document.body.removeChild(tempSpan);

    // Ensure the emoji picker stays within the viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const pickerWidth = 220; // Approximate width of emoji picker
    const pickerHeight = 150; // Approximate height of emoji picker

    const safeLeft = Math.min(left, viewportWidth - pickerWidth - 10);
    const safeTop = Math.min(top, viewportHeight - pickerHeight - 10);

    setEmojiPickerPosition({
      top: Math.max(10, safeTop),
      left: Math.max(10, safeLeft),
    });
  };

  const insertEmoji = useCallback(
    (emoji: string) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const pos = ta.selectionStart;
      const before = value.slice(0, pos);
      const after = value.slice(pos);
      const newText = before + emoji + after;

      onChange(newText);

      setTimeout(() => {
        ta.focus();
        const newPos = pos + emoji.length;
        ta.setSelectionRange(newPos, newPos);
      }, 0);

      setShowEmojiPicker(false);
    },
    [value, onChange]
  );

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Prevent scrolling of the body when in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return (
    <div
      className={`w-full ${
        isFullscreen ? "fixed inset-0 z-999 bg-white p-4 overflow-auto" : ""
      } ${className}`}
    >
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">{label}</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setPreviewMode((prev) =>
                    prev === "edit"
                      ? "preview"
                      : prev === "preview"
                      ? "split"
                      : "edit"
                  )
                }
                className="text-xs text-[#AD0000] flex items-center gap-1"
                aria-label={`Switch to ${
                  previewMode === "edit"
                    ? "preview"
                    : previewMode === "preview"
                    ? "split"
                    : "edit"
                } mode`}
              >
                {previewMode === "edit" ? (
                  <>
                    <Type className="h-3 w-3" /> Preview
                  </>
                ) : previewMode === "preview" ? (
                  <>
                    <Maximize className="h-3 w-3" /> Split
                  </>
                ) : (
                  <>
                    <Minimize className="h-3 w-3" /> Edit
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-xs text-[#AD0000]"
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-xs flex items-center text-[#AD0000]"
              aria-label="Show markdown help"
            >
              <HelpCircle className="h-4 w-4 mr-1" /> Help
            </button>
          </div>
        </div>
      )}

      <div
        className={`border rounded-md overflow-hidden ${
          isFullscreen ? "h-[calc(100%-80px)]" : "max-h-[230px]"
        }`}
        onDragOver={handleDragOver}
        // onDrop={handleDrop}
      >
        {(previewMode === "edit" || previewMode === "split") && (
          <>
            <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-50 border-b">
              {/* Text formatting */}
              <div className="flex items-center">
                <ToolbarButton
                  onClick={() => insertFormatting("# ", "", "Heading 1")}
                  title="Heading 1"
                >
                  <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("## ", "", "Heading 2")}
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("### ", "", "Heading 3")}
                  title="Heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <ToolbarDivider />

              {/* Text styles */}
              <div className="flex items-center">
                <ToolbarButton
                  onClick={() => insertFormatting("**", "**", "bold text")}
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("_", "_", "italic text")}
                  title="Italic (Ctrl+I)"
                >
                  <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("~~", "~~", "strikethrough")}
                  title="Strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("<u>", "</u>", "underline")}
                  title="Underline"
                >
                  <Underline className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <ToolbarDivider />

              {/* Lists */}
              <div className="flex items-center">
                <select
                  value={bulletType}
                  onChange={(e) => setBulletType(e.target.value)}
                  className="text-xs p-1 border rounded bg-white"
                  title="Bullet style"
                  aria-label="Select bullet style"
                >
                  {bulletTypes.map((b) => (
                    <option key={b} value={b}>
                      {b.trim()}
                    </option>
                  ))}
                </select>
                <ToolbarButton
                  onClick={() => insertFormatting(bulletType)}
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("1. ")}
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => {
                    const ta = textareaRef.current;
                    if (ta) {
                      const pos = ta.selectionStart;
                      const lines = value.slice(0, pos).split("\n");
                      const line = lines[lines.length - 1];
                      const matchList = line.match(/^(\s*)([-*+]|\d+\.)\s+/);
                      if (matchList) {
                        const newIndentation = matchList[1] + "  ";
                        const newLine = line.replace(
                          /^(\s*)([-*+]|\d+\.)\s+/,
                          `${newIndentation}${matchList[2]} `
                        );
                        const before = value.slice(0, pos - line.length);
                        const after = value.slice(pos);
                        onChange(before + newLine + after);
                        setTimeout(() =>
                          ta.setSelectionRange(pos + 2, pos + 2)
                        );
                      } else {
                        insertFormatting("  - ", "", "Sub-item");
                      }
                    }
                  }}
                  title="Indent List"
                >
                  <Indent className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => {
                    const ta = textareaRef.current;
                    if (ta) {
                      const pos = ta.selectionStart;
                      const lines = value.slice(0, pos).split("\n");
                      const line = lines[lines.length - 1];
                      const matchList = line.match(/^(\s{2,})([-*+]|\d+\.)\s+/);
                      if (matchList) {
                        const newIndentation = matchList[1].slice(0, -2);
                        const newLine = line.replace(
                          /^(\s{2,})([-*+]|\d+\.)\s+/,
                          `${newIndentation}${matchList[2]} `
                        );
                        const before = value.slice(0, pos - line.length);
                        const after = value.slice(pos);
                        onChange(before + newLine + after);
                        setTimeout(() =>
                          ta.setSelectionRange(pos - 2, pos - 2)
                        );
                      }
                    }
                  }}
                  title="Outdent List"
                >
                  <Outdent className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <ToolbarDivider />

              {/* Links */}
              <div className="flex items-center">
                <ToolbarButton
                  onClick={() => insertFormatting("[", "](url)", "link text")}
                  title="Link (Ctrl+K)"
                >
                  <Link className="h-4 w-4" />
                </ToolbarButton>
                {/* <ToolbarButton onClick={() => insertFormatting("![", "](url)", "image alt text")} title="Image">
                  <ImageIcon className="h-4 w-4" />
                </ToolbarButton> */}
              </div>

              <ToolbarDivider />

              {/* Content blocks */}
              <div className="flex items-center">
                <ToolbarButton
                  onClick={() => insertFormatting("> ", "", "quote")}
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("`", "`", "code")}
                  title="Inline Code"
                >
                  <Code className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("```\n", "\n```", "code")}
                  title="Code Block"
                >
                  <Code className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <ToolbarDivider />

              {/* Special elements */}
              <div className="flex items-center">
                <ToolbarButton
                  onClick={() => insertFormatting("---\n")}
                  title="Horizontal Rule"
                >
                  <Minus className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("> [!NOTE]\n> ", "", "note")}
                  title="Note"
                >
                  <Info className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    insertFormatting("> [!WARNING]\n> ", "", "warning")
                  }
                  title="Warning"
                >
                  <AlertTriangle className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => insertFormatting("> [!TIP]\n> ", "", "tip")}
                  title="Tip"
                >
                  <Check className="h-4 w-4" />
                </ToolbarButton>
              </div>

              <ToolbarDivider />

              {/* Advanced elements */}
              <div className="flex items-center">
                <ToolbarButton
                  onClick={() =>
                    insertTemplate(
                      "| Header | Header |\n|--------|--------|\n| Cell   | Cell   |\n",
                      -15
                    )
                  }
                  title="Table"
                >
                  <Table className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => {
                    if (textareaRef.current) {
                      positionEmojiPicker(textareaRef.current);
                      setShowEmojiPicker(true);
                    }
                  }}
                  title="Insert Emoji (Ctrl+E)"
                >
                  <span className="text-sm">😀</span>
                </ToolbarButton>
                {/* Alignment (Conceptual - would require custom rendering) */}
                {/* <ToolbarButton title="Align Left"><AlignLeft className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton title="Align Center"><AlignCenter className="h-4 w-4" /></ToolbarButton>
                <ToolbarButton title="Align Right"><AlignRight className="h-4 w-4" /></ToolbarButton> */}
              </div>
            </div>

            <div
              className={`flex ${
                previewMode === "split"
                  ? fullscreen
                    ? "h-[calc(100%-36px)] "
                    : "max-h-[220px]"
                  : "max-h-[220px]"
              }`}
            >
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKey}
                placeholder={placeholder}
                rows={isFullscreen ? 25 : rows}
                className={`w-full p-3 focus:outline-none focus:ring-1 focus:ring-[#AD0000] resize-none ${
                  previewMode === "split" ? "w-1/2 h-full" : "w-full"
                } ${error ? "border-red-500" : ""}`}
                style={isFullscreen ? { height: "calc(100% - 36px)" } : {}}
                aria-invalid={!!error}
                aria-describedby={error ? "markdown-error" : "markdown-help"}
              />

              {previewMode === "split" && (
                <div className="w-1/2 border-l p-4 overflow-auto">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: md.render(value) }}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {previewMode === "preview" && (
          <div
            className="p-4 bg-white overflow-auto"
            style={isFullscreen ? { height: "calc(100% - 36px)" } : {}}
          >
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: md.render(value) }}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-1">
        {helpText && !error && (
          <p className="text-xs text-gray-500" id="markdown-help">
            {helpText}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-600" id="markdown-error">
            {error}
          </p>
        )}
        <div className="text-xs text-gray-500 ml-auto">
          {wordCount} words, {charCount} chars
        </div>
      </div>

      {/* Emoji picker (positioned with fixed positioning) */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-md shadow-lg p-2"
          style={{
            top: `${emojiPickerPosition.top}px`,
            left: `${emojiPickerPosition.left}px`,
            maxWidth: "220px",
          }}
        >
          <div className="grid grid-cols-4 gap-1">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="p-1 hover:bg-gray-100 rounded text-lg"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Markdown Formatting Guide</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close help"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Text Formatting</h4>
                <ul className="space-y-2">
                  <li>
                    <code>**bold**</code> → <strong>bold text</strong>
                  </li>
                  <li>
                    <code>_italic_</code> → <em>italic text</em>
                  </li>
                  <li>
                    <code>~~strikethrough~~</code> → <s>strikethrough</s>
                  </li>
                  <li>
                    <code>`code`</code> → <code>code</code>
                  </li>
                  <li>
                    <code># Heading 1</code>
                  </li>
                  <li>
                    <code>## Heading 2</code>
                  </li>
                  <li>
                    <code>### Heading 3</code>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Lists</h4>
                <ul className="space-y-2">
                  <li>
                    <code>- Item</code> → Bullet list
                  </li>
                  <li>
                    <code>* Item</code> → Bullet list
                  </li>
                  <li>
                    <code>+ Item</code> → Bullet list
                  </li>
                  <li>
                    <code>1. Item</code> → Numbered list
                  </li>
                  <li>Tab to indent, Shift+Tab to outdent</li>
                </ul>
              </div>
              {/* <div>
                <h4 className="font-semibold mb-2">Links & Media</h4>
                <ul className="space-y-2">
                  <li><code>[text](url)</code> → <a href="#">link</a></li>
                  <li><code>![alt](url)</code> → Image</li>
                  <li>Drag & drop images to upload</li>
                </ul>
              </div> */}
              <div>
                <h4 className="font-semibold mb-2">Other Elements</h4>
                <ul className="space-y-2">
                  <li>
                    <code>&gt; quote</code> → Blockquote
                  </li>
                  <li>
                    <code>```code```</code> → Code block
                  </li>
                  <li>
                    <code>---</code> → Horizontal rule
                  </li>
                  <li>
                    <code>| Table |</code> → Create tables
                  </li>
                  <li>
                    <code>&gt; [!NOTE]</code> → Note block
                  </li>
                  <li>
                    <code>&gt; [!WARNING]</code> → Warning block
                  </li>
                  <li>
                    <code>&gt; [!TIP]</code> → Tip block
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li>
                  <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                    Ctrl+B
                  </kbd>{" "}
                  Bold
                </li>
                <li>
                  <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                    Ctrl+I
                  </kbd>{" "}
                  Italic
                </li>
                <li>
                  <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                    Ctrl+K
                  </kbd>{" "}
                  Link
                </li>
                <li>
                  <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                    Ctrl+E
                  </kbd>{" "}
                  Emoji
                </li>
                <li>
                  <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                    Tab
                  </kbd>{" "}
                  Indent list
                </li>
                <li>
                  <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                    Shift+Tab
                  </kbd>{" "}
                  Outdent list
                </li>
                <li>
                  <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">
                    Esc
                  </kbd>{" "}
                  Exit fullscreen
                </li>
              </ul>
            </div>
            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-[#AD0000] text-white rounded hover:bg-[#8a0000]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  title,
  active = false,
  disabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-1.5 hover:bg-gray-200 rounded text-gray-700 ${
        active ? "bg-gray-200" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="h-6 w-px bg-gray-300 mx-1" />;
}

export default MarkdownEditor;
