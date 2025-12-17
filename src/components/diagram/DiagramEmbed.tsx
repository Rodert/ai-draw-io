import React, { useEffect, useRef } from 'react';

interface DiagramEmbedProps {
  className?: string;
}

const getBaseUrl = () =>
  import.meta.env.VITE_DIAGRAMS_BASE_URL || 'https://embed.diagrams.net/';

const DiagramEmbed: React.FC<DiagramEmbedProps> = ({ className }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const baseUrl = getBaseUrl();
    let origin: string;
    try {
      origin = new URL(baseUrl).origin;
    } catch {
      origin = 'https://embed.diagrams.net';
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      // 预留：后续处理 diagrams.net 发来的事件
      // console.debug('Message from diagram editor', event.data);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const src = `${getBaseUrl()}?embed=1&ui=min&spin=1&proto=json`;

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <iframe
        ref={iframeRef}
        title="Diagram Editor"
        src={src}
        frameBorder={0}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};

export default DiagramEmbed;
