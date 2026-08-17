'use client';
import { useState } from 'react';

export default function ChatMVP() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const aiMsg = { 
      role: 'assistant', 
      content: data.reply, 
      angerLevel: data.sentiment?.anger_level 
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>情緒感知 AI 客服 MVP 測試</h2>
      <div style={{ border: '1px solid #ccc', height: '40px', padding: '10px', overflowY: 'scroll', mb: '10px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '10px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <span style={{ 
              background: m.role === 'user' ? '#0070f3' : (m.angerLevel >= 4 ? '#ffe6e6' : '#f1f1f1'),
              color: m.role === 'user' ? '#fff' : '#000',
              padding: '8px 12px', borderRadius: '8px', display: 'inline-block'
            }}>
              {m.content}
            </span>
            {m.angerLevel >= 4 && <div style={{ fontSize: '12px', color: 'red' }}>⚠️ 已觸發高憤怒安撫模式</div>}
          </div>
        ))}
        {loading && <p>AI 正在理解並思考回應...</p>}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          style={{ flex: 1, padding: '10px' }} 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入訊息（試著用憤怒的語氣測試...）"
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px' }}>發送</button>
      </div>
    </div>
  );
}
