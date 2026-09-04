"use client";

import React from "react";

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export default function FormattedMarkdown({ content, className = "" }: FormattedMarkdownProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule: --- or ___ or ***
    if (/^\s*[-_*]{3,}\s*$/.test(line)) {
      elements.push(
        <hr key={`hr-${i}`} className="my-4 border-slate-200" />
      );
      i++;
      continue;
    }

    // Headings (##, ###, ####)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const parsedText = parseInlineMarkdown(text);

      if (level === 1 || level === 2) {
        elements.push(
          <h2 key={`h2-${i}`} className="font-display font-bold text-base md:text-lg text-slate-900 mt-5 mb-2.5 flex items-center gap-2">
            {parsedText}
          </h2>
        );
      } else {
        elements.push(
          <h3 key={`h3-${i}`} className="font-display font-semibold text-sm md:text-base text-slate-800 mt-4 mb-2">
            {parsedText}
          </h3>
        );
      }
      i++;
      continue;
    }

    // Markdown Table detection (looks for | col1 | col2 |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableRows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableRows.push(lines[i].trim());
        i++;
      }

      if (tableRows.length > 0) {
        const headerRow = tableRows[0];
        const isDivider = (r: string) => /^[|\s-:]+$/.test(r);
        
        let bodyRows: string[] = [];
        if (tableRows.length > 1 && isDivider(tableRows[1])) {
          bodyRows = tableRows.slice(2);
        } else {
          bodyRows = tableRows.slice(1);
        }

        const parseCells = (rowStr: string) => {
          return rowStr
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());
        };

        const headers = parseCells(headerRow);

        elements.push(
          <div key={`table-wrapper-${i}`} className="my-4 overflow-x-auto rounded-xl border border-slate-200/80 shadow-sm bg-white">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {headers.map((h, hIdx) => (
                    <th key={`th-${hIdx}`} className="py-3 px-4 font-bold text-slate-700">
                      {parseInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bodyRows.map((bRow, rIdx) => {
                  const cells = parseCells(bRow);
                  return (
                    <tr key={`tr-${rIdx}`} className="hover:bg-slate-50/50 transition-colors">
                      {cells.map((cell, cIdx) => (
                        <td key={`td-${cIdx}`} className="py-2.5 px-4 text-slate-600 font-normal leading-relaxed">
                          {parseInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Bullet points (- or *)
    if (/^\s*[-*]\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }

      elements.push(
        <ul key={`ul-${i}`} className="my-2.5 space-y-1.5 list-disc list-inside text-xs md:text-sm text-slate-700 pl-1">
          {listItems.map((item, itemIdx) => (
            <li key={`li-${itemIdx}`} className="leading-relaxed">
              <span>{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list (1. 2. etc.)
    if (/^\s*\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }

      elements.push(
        <ol key={`ol-${i}`} className="my-2.5 space-y-1.5 list-decimal list-inside text-xs md:text-sm text-slate-700 pl-1">
          {listItems.map((item, itemIdx) => (
            <li key={`oli-${itemIdx}`} className="leading-relaxed">
              <span>{parseInlineMarkdown(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-xs md:text-sm text-slate-700 leading-relaxed my-2">
        {parseInlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return <div className={`formatted-markdown space-y-1 ${className}`}>{elements}</div>;
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="bg-slate-100 px-1.5 py-0.5 rounded text-[0.85em] font-mono text-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
