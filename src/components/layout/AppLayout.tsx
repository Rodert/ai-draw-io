import React from 'react';
import DiagramEmbed from '../diagram/DiagramEmbed';
import ChatPanel from '../chat/ChatPanel';

const AppLayout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <DiagramEmbed />
      </div>
      <ChatPanel />
    </div>
  );
};

export default AppLayout;
