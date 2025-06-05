'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { Section } from '../lib/markdown';
import MermaidDiagram from './MermaidDiagram';

interface SectionCardProps {
  section: Section;
}

export default function SectionCard({ section }: SectionCardProps) {
  const [contentParts, setContentParts] = useState<ReactNode[]>([]);
  
  useEffect(() => {
    // サーバーサイドでは実行しない
    if (typeof window === 'undefined') return;
    
    const content = section.content;
    const mermaidPattern = /```mermaid\n([\s\S]*?)```/g;
    
    // Mermaidコードブロックを見つけてマークする
    const parts: Array<{ type: 'html' | 'mermaid', content: string }> = [];
    let lastIndex = 0;
    let match;
    
    // コンテンツをHTMLとMermaidに分割
    while ((match = mermaidPattern.exec(content)) !== null) {
      const htmlBeforeMermaid = content.substring(lastIndex, match.index);
      if (htmlBeforeMermaid) {
        parts.push({ type: 'html', content: htmlBeforeMermaid });
      }
      
      parts.push({ type: 'mermaid', content: match[1].trim() });
      lastIndex = match.index + match[0].length;
    }
    
    // 残りのHTMLを追加
    const remainingHtml = content.substring(lastIndex);
    if (remainingHtml) {
      parts.push({ type: 'html', content: remainingHtml });
    }
    
    // Reactコンポーネントに変換
    const renderedParts = parts.map((part, index) => {
      if (part.type === 'html') {
        return (
          <div 
            key={`html-${index}`} 
            dangerouslySetInnerHTML={{ __html: part.content }} 
          />
        );
      } else {
        return (
          <MermaidDiagram 
            key={`mermaid-${index}`} 
            chart={part.content} 
          />
        );
      }
    });
    
    setContentParts(renderedParts);
  }, [section.content]);
  
  // サーバーサイドレンダリングまたはクライアントサイドの初期レンダリングでは
  // 通常のHTMLとして表示
  if (contentParts.length === 0) {
    return (
      <div className="mb-12" id={section.id}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{section.title}</h2>
        <div className="prose max-w-none prose-img:my-2">
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      </div>
    );
  }
  
  // クライアントサイドでMermaidが処理された後のレンダリング
  return (
    <div className="mb-12" id={section.id}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{section.title}</h2>
      <div className="prose max-w-none prose-img:my-2">
        {contentParts}
      </div>
    </div>
  );
} 