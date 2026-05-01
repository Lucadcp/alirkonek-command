import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, CheckCircle2, Clock, ListTodo, MessageCircle, RadioTower, ShieldCheck, Users } from 'lucide-react';
import { bootTelegram, getTelegramUserName, tg } from './telegram';
import './styles.css';

type Demo = {
  user: { name: string; role: string };
  today: { shift: string; location: string; team: string[]; urgent: string };
  tasks: Array<{ id: string; title: string; assignee: string; due: string; status: string; priority: string }>;
  roster: Array<{ id: string; date: string; time: string; role: string; location: string; confirmed: boolean }>;
  radar: string[];
};

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'danger' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="card"><div className="cardTitle">{icon}<h2>{title}</h2></div>{children}</section>;
}

function App() {
  const [data, setData] = useState<Demo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'today' | 'tasks' | 'roster' | 'ops'>('today');

  useEffect(() => {
    bootTelegram();
    fetch(`${API}/api/demo/me`)
      .then((r) => {
        if (!r.ok) throw new Error(`API ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError(`Could not reach AlirKonek API at ${API}. Start backend or check deploy env.`);
      });
  }, []);

  const name = getTelegramUserName();

  if (error) return <main className="shell"><div className="loading errorBox"><strong>Connection issue</strong><span>{error}</span></div></main>;
  if (!data) return <main className="shell"><div className="loading">Loading AlirKonek Command…</div></main>;

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">AlirKonek Command</p>
          <h1>Morning, {name}</h1>
          <p className="muted">Roster, tasks, attendance, and team operations inside Telegram.</p>
        </div>
        <div className="statusPill"><ShieldCheck size={16}/> Secure Telegram session</div>
      </header>

      <nav className="tabs">
        <button className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}><Clock size={16}/>Today</button>
        <button className={tab === 'tasks' ? 'active' : ''} onClick={() => setTab('tasks')}><ListTodo size={16}/>Tasks</button>
        <button className={tab === 'roster' ? 'active' : ''} onClick={() => setTab('roster')}><CalendarDays size={16}/>Roster</button>
        <button className={tab === 'ops' ? 'active' : ''} onClick={() => setTab('ops')}><RadioTower size={16}/>Ops</button>
      </nav>

      {tab === 'today' && <div className="grid">
        <Card title="Today briefing" icon={<Clock/>}>
          <div className="briefing">
            <strong>{data.today.shift}</strong>
            <span>{data.today.location}</span>
            <Badge tone="danger">Urgent: {data.today.urgent}</Badge>
          </div>
          <div className="actions">
            <button onClick={() => tg?.HapticFeedback?.impactOccurred('medium')}>Clock In</button>
            <button className="secondary">Request Swap</button>
          </div>
        </Card>
        <Card title="Shift team" icon={<Users/>}>
          <div className="people">{data.today.team.map((p) => <span key={p}>{p}</span>)}</div>
        </Card>
        <Card title="Human chat → structured ops" icon={<MessageCircle/>}>
          <p className="muted">Soon: “John clean freezer before 3” becomes assigned, tracked task with reminders.</p>
        </Card>
      </div>}

      {tab === 'tasks' && <Card title="Task board" icon={<ListTodo/>}>
        <div className="list">{data.tasks.map((task) => <div className="row" key={task.id}>
          <div><strong>{task.title}</strong><span>{task.assignee} · {task.due}</span></div>
          <Badge tone={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warn' : 'neutral'}>{task.status}</Badge>
        </div>)}</div>
      </Card>}

      {tab === 'roster' && <Card title="Visual roster" icon={<CalendarDays/>}>
        <div className="list">{data.roster.map((shift) => <div className="row" key={shift.id}>
          <div><strong>{shift.date}: {shift.time}</strong><span>{shift.role} · {shift.location}</span></div>
          <Badge tone={shift.confirmed ? 'good' : 'warn'}>{shift.confirmed ? 'confirmed' : 'needs confirm'}</Badge>
        </div>)}</div>
      </Card>}

      {tab === 'ops' && <Card title="Manager radar" icon={<RadioTower/>}>
        <div className="list">{data.radar.map((risk) => <div className="row" key={risk}><div><strong>{risk}</strong><span>AI ops brain will suggest fix next.</span></div><CheckCircle2 size={20}/></div>)}</div>
      </Card>}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
