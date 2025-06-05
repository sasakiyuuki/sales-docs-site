'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // mermaidの設定
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'Noto Sans JP, sans-serif',
      fontSize: 14,
      flowchart: {
        htmlLabels: true,
        curve: 'linear',
        useMaxWidth: true
      }
    });

    // 既存のコンテンツをクリア
    if (mermaidRef.current) {
      mermaidRef.current.innerHTML = '';
    }

    // mermaidの処理を次のレンダリングサイクルで実行
    const renderDiagram = async () => {
      try {
        if (mermaidRef.current) {
          const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substring(2, 11)}`, chart);
          mermaidRef.current.innerHTML = svg;
          
          // SVGに日本語フォントを適用
          const svgElement = mermaidRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.setAttribute('font-family', 'Noto Sans JP, sans-serif');
            
            // テキスト要素にもフォント適用
            const textElements = svgElement.querySelectorAll('text');
            textElements.forEach(text => {
              text.setAttribute('font-family', 'Noto Sans JP, sans-serif');
            });
          }
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<pre class="text-red-500 p-4 bg-red-50 rounded">${chart}</pre>`;
        }
      }
    };

    // 少し遅延させてレンダリング
    setTimeout(renderDiagram, 10);
  }, [chart]);

  return (
    <div className="mermaid-container my-8">
      <div ref={mermaidRef} className="flex justify-center w-full max-w-full overflow-x-auto" />
    </div>
  );
} 