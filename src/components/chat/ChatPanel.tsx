import React, { useCallback, useEffect, useState } from 'react';
import { callDeepSeekChat } from '../../ai/deepseek';
import type { ChatMessage } from '../../ai/types';

const MIN_WIDTH = 280;
const MAX_WIDTH = 600;

const ChatPanel: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [width, setWidth] = useState(360);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('deepseek_api_key');
    if (saved) setApiKey(saved);
  }, []);

  useEffect(() => {
    if (apiKey) {
      window.localStorage.setItem('deepseek_api_key', apiKey);
    }
  }, [apiKey]);

  const handleMouseDown = useCallback(() => {
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setError(null);

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await callDeepSeekChat(apiKey, nextMessages);
      const assistantMessage: ChatMessage = { role: 'assistant', content: reply };
      setMessages([...nextMessages, assistantMessage]);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  if (isCollapsed) {
    return (
      <div
        style={{
          width: 32,
          borderLeft: '1px solid #ddd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsCollapsed(false)}
      >
        {'<'}
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        borderLeft: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#f0f2f5',
        position: 'relative',
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          cursor: 'col-resize',
          zIndex: 10,
        }}
      />

      <div
        style={{
          padding: 8,
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontWeight: 600, flex: 1 }}>AI 助手 · DeepSeek</span>
        <button onClick={() => setIsCollapsed(true)} style={{ fontSize: 12 }}>
          收起
        </button>
      </div>

      <div style={{ padding: 8, borderBottom: '1px solid #eee', fontSize: 12 }}>
        <div>DeepSeek API Key：</div>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="请输入你的 DeepSeek API Key"
          style={{ width: '100%', marginTop: 4, padding: 4, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ flex: 1, padding: 8, overflowY: 'auto', fontSize: 14 }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 8,
              padding: 6,
              borderRadius: 4,
              background: m.role === 'user' ? '#e6f4ff' : '#f7f8fa',
              border: '1px solid #e0e0e0',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 2 }}>
              {m.role === 'user' ? '你' : 'AI'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
          </div>
        ))}
        {loading && <div>AI 正在思考中...</div>}
        {error && <div style={{ color: 'red' }}>错误：{error}</div>}
      </div>

      <div style={{ padding: 8, borderTop: '1px solid #eee' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          style={{ width: '100%', resize: 'none', padding: 4, boxSizing: 'border-box' }}
          placeholder="描述你想画的图，比如：画一个三层 Web 架构图..."
        />
        <button
          onClick={handleSend}
          disabled={loading || !apiKey}
          style={{ marginTop: 4, width: '100%' }}
        >
          {loading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
