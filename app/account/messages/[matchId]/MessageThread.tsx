'use client';
import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect, useRef } from 'react';

import type { Message } from '@/lib/types';

function getBrowserClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export default function MessageThread({ matchId, userId, initialMessages }: {
  matchId: string;
  userId: string;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const supabase = getBrowserClient();
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `match_id=eq.${matchId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [matchId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    const supabase = getBrowserClient();
    await supabase.from('messages').insert({ match_id: matchId, sender_id: userId, body: body.trim() });
    setBody('');
    setSending(false);
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)', minHeight: 400 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--slate)', fontSize: 'var(--text-sm)', padding: 'var(--space-8)' }}>
            No messages yet. Say hello!
          </div>
        )}
        {messages.map(msg => {
          const isMine = msg.sender_id === userId;
          return (
            <div key={msg.id} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: isMine ? 'flex-end' : 'flex-start',
              gap: 4,
            }}>
              <div style={{
                background: isMine ? 'var(--navy)' : 'var(--surface)',
                color: isMine ? 'var(--white)' : 'var(--navy)',
                border: isMine ? 'none' : '1.5px solid var(--line)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3) var(--space-4)',
                maxWidth: '70%',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.5,
              }}>
                {msg.body}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--mist)' }}>
                {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ borderTop: '1px solid var(--line)', padding: 'var(--space-4)' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input
            type="text" className="field-input" placeholder="Write a message…"
            value={body} onChange={e => setBody(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={sending || !body.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
