class NeuroMarkdown {
  static render(text) {
    if (!text) return '';
    const safe = NeuroMarkdown.escapeHtml(text);
    const html = NeuroMarkdown.parse(safe);
    return html;
  }
  static escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, c => map[c]);
  }
  static parse(text) {
    let html = text;
    html = NeuroMarkdown.parseCodeBlocks(html);
    html = NeuroMarkdown.parseHeaders(html);
    html = NeuroMarkdown.parseHorizontalRules(html);
    html = NeuroMarkdown.parseBlockquotes(html);
    html = NeuroMarkdown.parseLists(html);
    html = NeuroMarkdown.parseTables(html);
    html = NeuroMarkdown.parseParagraphs(html);
    html = NeuroMarkdown.parseInline(html);
    return html;
  }
  static parseCodeBlocks(text) {
    return text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
      const clean = code.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      return `<pre><code>${clean.trim()}</code></pre>`;
    });
  }
  static parseHeaders(text) {
    return text.replace(/^#{1,6}\s+(.+)$/gm, (match, content) => {
      const level = match.trim().indexOf(' ');
      return `<h${level}>${content.trim()}</h${level}>`;
    });
  }
  static parseHorizontalRules(text) {
    return text.replace(/^(\s*[-*_]\s*){3,}$/gm, '<hr>');
  }
  static parseBlockquotes(text) {
    return text.replace(/^&gt;\s?(.+)$/gm, '<blockquote>$1</blockquote>');
  }
  static parseLists(text) {
    let lines = text.split('\n');
    let result = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const ulMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
      const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
      if (ulMatch || olMatch) {
        const isOrdered = !!olMatch;
        const items = [];
        while (i < lines.length) {
          const l = lines[i];
          const m = isOrdered ? l.match(/^\s*\d+\.\s+(.+)$/) : l.match(/^\s*[-*+]\s+(.+)$/);
          if (!m) break;
          items.push(`<li>${m[1]}</li>`);
          i++;
        }
        const tag = isOrdered ? 'ol' : 'ul';
        result.push(`<${tag}>${items.join('')}</${tag}>`);
      } else {
        result.push(line);
        i++;
      }
    }
    return result.join('\n');
  }
  static parseTables(text) {
    const lines = text.split('\n');
    let result = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        const rows = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          rows.push(lines[i].trim());
          i++;
        }
        if (rows.length >= 2) {
          result.push(NeuroMarkdown.buildTable(rows));
        } else {
          rows.forEach(r => result.push(r));
        }
      } else {
        result.push(lines[i]);
        i++;
      }
    }
    return result.join('\n');
  }
  static buildTable(rows) {
    const skipRow = rows.findIndex(r => /^[\s|:-]+$/.test(r.replace(/[^|:\- ]/g, '')));
    const dataRows = skipRow >= 0 ? rows.filter((_, idx) => idx !== skipRow) : rows;
    if (dataRows.length === 0) return rows.join('\n');
    let table = '<table><thead><tr>';
    const headerCells = NeuroMarkdown.splitRow(dataRows[0]);
    headerCells.forEach(c => { table += `<th>${c.trim()}</th>`; });
    table += '</tr></thead><tbody>';
    for (let r = 1; r < dataRows.length; r++) {
      table += '<tr>';
      NeuroMarkdown.splitRow(dataRows[r]).forEach(c => { table += `<td>${c.trim()}</td>`; });
      table += '</tr>';
    }
    table += '</tbody></table>';
    return table;
  }
  static splitRow(row) {
    const parts = row.split('|');
    parts.shift();
    parts.pop();
    return parts;
  }
  static parseParagraphs(text) {
    const blocks = text.split(/\n{2,}/);
    return blocks.map(block => {
      const b = block.trim();
      if (!b) return '';
      if (b.startsWith('<')) return b;
      if (b.length < 2) return b;
      return `<p>${b.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');
  }
  static parseInline(text) {
    let r = text;
    r = r.replace(/`([^`]+)`/g, '<code>$1</code>');
    r = r.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    r = r.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    r = r.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    return r;
  }
}
