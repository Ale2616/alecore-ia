import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * CodeBlock - Bloque de código con syntax highlighting y botón copiar
 */
const CodeBlock = ({ children, language }) => {
  const [copied, setCopied] = React.useState(false);

  const code = String(children).replace(/\n$/, '');
  const lang = language || 'text';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Custom theme overrides for deeper background
  const customStyle = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: '#0d0d14',
      margin: 0,
      padding: '1rem',
      fontSize: '0.8125rem',
      lineHeight: '1.6',
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: 'none',
      fontSize: '0.8125rem',
    },
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-surface-700/50
                    bg-surface-950 shadow-lg group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2
                      bg-surface-800/80 border-b border-surface-700/40">
        <span className="text-xs font-medium text-surface-400 uppercase tracking-wider">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-surface-400
                     hover:text-accent-400 transition-all duration-200
                     px-2 py-1 rounded-md hover:bg-surface-700/50"
          aria-label="Copiar código"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <SyntaxHighlighter
        language={lang}
        style={customStyle}
        showLineNumbers={code.split('\n').length > 3}
        wrapLongLines
        lineNumberStyle={{
          color: 'rgba(100,100,140,0.4)',
          fontSize: '0.75rem',
          paddingRight: '1rem',
          minWidth: '2rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
