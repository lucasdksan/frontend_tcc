// markdownToHtml.ts
// Small, dependency-free Markdown -> HTML converter (basic features)
// Supports: headings, bold, italic, inline code, fenced code blocks, links, ordered/unordered lists, paragraphs

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
}

export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  // Normalize line endings
  let text = markdown.replace(/\r\n?/g, '\n');

  // Extract fenced code blocks and replace with placeholders
  const codeBlocks: string[] = [];
  text = text.replace(/```([\s\S]*?)```/g, (_, code) => {
    const idx = codeBlocks.push(code) - 1;
    return `{{{CODEBLOCK_${idx}}}}`;
  });

  // Escape HTML for the rest
  text = escapeHtml(text);

  // Restore code blocks as escaped content inside <pre><code>
  text = text.replace(/\{\{\{CODEBLOCK_(\d+)\}\}\}/g, (_, id) => {
    const code = codeBlocks[Number(id)];
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  });

  // Process lines
  const lines = text.split('\n');
  const out: string[] = [];

  let i = 0;
  while (i < lines.length) {
    let line = lines[i];

    // skip consecutive empty lines
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    // Heading
    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const content = inlineFormat(hMatch[2]);
      out.push(`<h${level}>${content}</h${level}>`);
      i++;
      continue;
    }

    // Lists (unordered)
    if (/^[\s]*([-+*])\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[\s]*([-+*])\s+/.test(lines[i])) {
        const item = lines[i].replace(/^[\s]*([-+*])\s+/, '');
        items.push(`<li>${inlineFormat(item)}</li>`);
        i++;
      }
      out.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Ordered lists
    if (/^[\s]*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[\s]*\d+\.\s+/.test(lines[i])) {
        const item = lines[i].replace(/^[\s]*\d+\.\s+/, '');
        items.push(`<li>${inlineFormat(item)}</li>`);
        i++;
      }
      out.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // Paragraph: gather lines until blank line
    const paraLines: string[] = [];
    while (i < lines.length && !/^[\s]*$/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    const paragraph = paraLines.join(' ');
    out.push(`<p>${inlineFormat(paragraph)}</p>`);
  }

  return out.join('\n');
}

// inline formatting for bold, italic, inline code and links
function inlineFormat(s: string): string {
  if (!s) return '';

  // inline code: `code`
  s = s.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);

  // links: [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const safeText = text;
    const safeUrl = escapeHtml(url);
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
  });

  // bold: **text** or __text__
  s = s.replace(/(\*\*|__)(.*?)\1/g, (_, _m, inner) => `<strong>${inner}</strong>`);

  // italic: *text* or _text_
  s = s.replace(/(\*|_)(.*?)\1/g, (_, _m, inner) => `<em>${inner}</em>`);

  // simple line breaks: two or more spaces at end already lost; we keep as-is
  return s;
}

export default markdownToHtml;
