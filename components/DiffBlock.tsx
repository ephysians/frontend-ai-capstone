type DiffLine = { type: 'remove' | 'add' | 'context'; text: string };

export default function DiffBlock({ lines, label }: { lines: DiffLine[]; label?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel overflow-hidden">
      {label && (
        <div className="border-b border-white/10 px-4 py-2 font-mono text-xs text-muted">{label}</div>
      )}
      <pre className="font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'remove'
                ? 'bg-remove/10 text-remove px-4 py-1'
                : line.type === 'add'
                  ? 'bg-add/10 text-add px-4 py-1'
                  : 'text-muted px-4 py-1'
            }
          >
            <span aria-hidden="true">{line.type === 'remove' ? '- ' : line.type === 'add' ? '+ ' : '  '}</span>
            {line.text}
          </div>
        ))}
      </pre>
    </div>
  );
}
