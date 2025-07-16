"use client";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your message...",
  rows = 8,
  className = "",
}: MarkdownEditorProps) {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2 bg-slate-900/70 border border-pink-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-pink-100 font-mono resize-vertical ${className}`}
      />
      <div className="text-pink-400 text-xs mt-1 space-y-1">
        <p>Supports markdown formatting:</p>
        <div className="text-pink-500/80 text-xs space-x-4">
          <span>**bold**</span>
          <span>*italic*</span>
          <span>`code`</span>
          <span>&gt; quote</span>
          <span>- list</span>
          <span># heading</span>
        </div>
      </div>
    </div>
  );
}
