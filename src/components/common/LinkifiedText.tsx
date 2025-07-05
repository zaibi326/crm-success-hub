
import React from 'react';

interface LinkifiedTextProps {
  text: string;
  className?: string;
}

export function LinkifiedText({ text, className = '' }: LinkifiedTextProps) {
  if (!text) return null;

  // Regular expression to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[^\s]+\.[a-z]{2,}[^\s]*)/gi;
  
  const parts = text.split(urlRegex);
  
  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (urlRegex.test(part)) {
          let href = part;
          // Add protocol if missing
          if (!part.startsWith('http')) {
            href = `https://${part}`;
          }
          
          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
            >
              {part}
            </a>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
}
