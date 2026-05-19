import { useState } from 'react';
import { Link } from 'react-router-dom';

// Web3Forms — works on Vercel, sends to blankspacetechnologies@gmail.com
// Setup: go to https://web3forms.com, enter your email, get an access key, paste it below.
const WEB3FORMS_KEY = '5bd618a2-6535-4c01-bb84-cd6d0de60257';

// ─────────────────────────────────────────────
// Email request form
// ─────────────────────────────────────────────
function RequestForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const invalid = touched && !email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return;
    setStatus('submitting');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          email: email.trim(),
          subject: 'North OS — Access Request',
          message: `New access request from ${email.trim()}`,
        }),
      });
      const data = await res.json();
      if (data.success) setStatus('done');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: compact ? '8px 0' : '16px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>✉️</div>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          Got it! We'll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            style={{
              padding: '12px 18px', borderRadius: 11, width: compact ? 220 : 260,
              background: 'rgba(255,255,255,0.06)',
              border: `1px solid ${invalid ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
              color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
            }}
            onFocus={e => { if (!invalid) e.currentTarget.style.borderColor = 'rgba(107,124,230,0.55)'; }}
            onBlurCapture={e => { if (!invalid) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          />
          {invalid && (
            <p style={{ fontSize: 12, color: '#f87171', marginTop: 4, marginBottom: 0, textAlign: 'left' }}>
              Enter a valid email.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          style={{
            padding: '12px 24px', borderRadius: 11,
            background: 'linear-gradient(135deg,#6b7ce6,#9b8cff)',
            border: 'none', color: 'white', fontWeight: 600, fontSize: 14,
            cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            opacity: status === 'submitting' ? 0.7 : 1,
            letterSpacing: '-0.01em', whiteSpace: 'nowrap',
          }}>
          {status === 'submitting' ? 'Sending…' : 'Request Access →'}
        </button>
      </div>
      {status === 'error' && (
        <p style={{ textAlign: 'center', fontSize: 12, color: '#f87171', marginTop: 8, marginBottom: 0 }}>
          Something went wrong. Email us at{' '}
          <a href="mailto:blankspacetechnologies@gmail.com" style={{ color: '#f87171' }}>
            blankspacetechnologies@gmail.com
          </a>
        </p>
      )}
    </form>
  );
}

// ─────────────────────────────────────────────
// Screenshot mock frames
// ─────────────────────────────────────────────
const SCREENS = [
  {
    title: 'Dashboard',
    desc: 'Daily overview of habits, journal mood, spending, and upcoming subscriptions.',
    mockup: (
      <div style={{ background: '#0e0e17', borderRadius: 10, padding: '16px', minHeight: 200 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {['Habits', 'Journal', 'Finance', 'Subs'].map(l => (
            <div key={l} style={{ flex: 1, borderRadius: 8, padding: '10px 8px', background: 'rgba(107,124,230,0.1)', border: '1px solid rgba(107,124,230,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{l}</div>
              <div style={{ fontSize: 18, color: '#9b8cff', fontWeight: 700 }}>{['4/5', '✓', '₹12k', '3'][['Habits','Journal','Finance','Subs'].indexOf(l)]}</div>
            </div>
          ))}
        </div>
        <div style={{ borderRadius: 8, padding: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>TODAY'S HABITS</div>
          {['Morning run ✓', 'Reading ✓', 'Meditation', 'Cold shower'].map((h, i) => (
            <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: h.includes('✓') ? '#9b8cff' : 'rgba(255,255,255,0.08)', border: h.includes('✓') ? 'none' : '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: h.includes('✓') ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)' }}>{h.replace(' ✓', '')}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Journal',
    desc: 'A calm writing space with daily prompts, mood tracking, and AI-generated reflections.',
    mockup: (
      <div style={{ background: '#0e0e17', borderRadius: 10, padding: 16, minHeight: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Mon, 19 May</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['😊','😐','😔'].map((m, i) => <span key={m} style={{ fontSize: 16, opacity: i === 0 ? 1 : 0.3, cursor: 'pointer' }}>{m}</span>)}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 12, marginBottom: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>
            Today was productive. Finished the notification system and ran a full code review. Feeling clear-headed and focused…
          </p>
        </div>
        <div style={{ borderRadius: 8, padding: 12, background: 'rgba(107,124,230,0.07)', border: '1px solid rgba(107,124,230,0.18)' }}>
          <div style={{ fontSize: 10, color: '#9b8cff', marginBottom: 4 }}>✦ AI REFLECTION</div>
          <p style={{ fontSize: 11, color: 'rgba(155,140,255,0.7)', lineHeight: 1.6, margin: 0 }}>You've mentioned clarity and focus 4 times this week. Your mood correlates with coding progress.</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Finance',
    desc: 'Track income and expenses, set budgets, import bank statements, and get AI insights.',
    mockup: (
      <div style={{ background: '#0e0e17', borderRadius: 10, padding: 16, minHeight: 200 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[['Income', '+₹85,000', '#4ade80'], ['Expense', '-₹42,300', '#f87171'], ['Net', '+₹42,700', '#9b8cff']].map(([l,v,c]) => (
            <div key={l as string} style={{ flex: 1, borderRadius: 8, padding: '10px 8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{l as string}</div>
              <div style={{ fontSize: 13, color: c as string, fontWeight: 700, fontFamily: 'monospace' }}>{v as string}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>BY CATEGORY</div>
          {[['Food & Dining', 68, '#9b8cff'], ['Transport', 42, '#6b7ce6'], ['Entertainment', 25, '#c084fc']].map(([cat, pct, col]) => (
            <div key={cat as string} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{cat as string}</span>
                <span style={{ fontSize: 10, color: col as string }}>{pct as number}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', borderRadius: 99, background: col as string, width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Habits',
    desc: 'Build streaks, track consistency, and visualize your progress over time.',
    mockup: (
      <div style={{ background: '#0e0e17', borderRadius: 10, padding: 16, minHeight: 200 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>This week</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: i < 5 ? 'rgba(107,124,230,0.35)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: i < 5 ? '#9b8cff' : 'rgba(255,255,255,0.25)' }}>{d}</div>
            ))}
          </div>
        </div>
        {[['🏃 Morning run', 18, true], ['📚 Reading', 9, true], ['🧘 Meditation', 24, false], ['🚿 Cold shower', 6, true]].map(([h, streak, done]) => (
          <div key={h as string} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: done ? 'linear-gradient(135deg,#6b7ce6,#9b8cff)' : 'rgba(255,255,255,0.08)', border: done ? 'none' : '1px solid rgba(255,255,255,0.12)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white' }}>{done ? '✓' : ''}</div>
            <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{(h as string).split(' ').slice(1).join(' ')}</span>
            <span style={{ fontSize: 10, color: '#9b8cff', fontFamily: 'monospace' }}>🔥 {streak as number}d</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Subscriptions',
    desc: 'Never miss a renewal. Track all your subscriptions and see 12-month billing forecasts.',
    mockup: (
      <div style={{ background: '#0e0e17', borderRadius: 10, padding: 16, minHeight: 200 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, borderRadius: 8, padding: '10px 8px', background: 'rgba(107,124,230,0.1)', border: '1px solid rgba(107,124,230,0.2)' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>MONTHLY</div>
            <div style={{ fontSize: 15, color: '#9b8cff', fontWeight: 700 }}>₹3,240</div>
          </div>
          <div style={{ flex: 1, borderRadius: 8, padding: '10px 8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>ACTIVE</div>
            <div style={{ fontSize: 15, color: 'white', fontWeight: 700 }}>8</div>
          </div>
          <div style={{ flex: 1, borderRadius: 8, padding: '10px 8px', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>DUE SOON</div>
            <div style={{ fontSize: 15, color: '#f87171', fontWeight: 700 }}>2</div>
          </div>
        </div>
        {[['🎵 Spotify', '₹119', '2d'], ['☁️ iCloud', '₹75', '5d'], ['📺 Netflix', '₹499', '12d']].map(([s, amt, due]) => (
          <div key={s as string} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: 14 }}>{(s as string).split(' ')[0]}</span>
            <span style={{ flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{(s as string).split(' ').slice(1).join(' ')}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginRight: 6 }}>in {due as string}</span>
            <span style={{ fontSize: 12, color: '#9b8cff', fontWeight: 600 }}>{amt as string}</span>
          </div>
        ))}
      </div>
    ),
  },
];

// ─────────────────────────────────────────────
// Features
// ─────────────────────────────────────────────
const FEATURES = [
  { icon: '📓', title: 'Daily Journal', desc: 'Rich journaling with mood tracking, AI summaries, and semantic search across your past entries.' },
  { icon: '🔥', title: 'Habit Tracking', desc: "Build streaks, track consistency, get reminded at your chosen time. Schedule-aware so weekly habits don't penalise rest days." },
  { icon: '💳', title: 'Financial Tracking', desc: 'Log income and expenses, set category budgets, import bank statements (CSV / Excel / PDF), and get AI category insights.' },
  { icon: '🔄', title: 'Subscription Manager', desc: 'Track every recurring charge, get renewal alerts up to 7 days ahead, and see a 12-month billing forecast.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Morning briefing, habit reminders, subscription alerts, and budget warnings — all configurable with quiet hours.' },
  { icon: '🤖', title: 'AI that knows your life', desc: 'Ask about your spending patterns, journal entries, habit history, or get a unified life reflection. Fully local or cloud AI.' },
];

const PROVIDERS = [
  { name: 'LM Studio', label: 'Local · Free' }, { name: 'Ollama', label: 'Local · Free' },
  { name: 'OpenAI', label: 'GPT-4o' }, { name: 'Anthropic', label: 'Claude' },
  { name: 'Gemini', label: 'Google' }, { name: 'Groq', label: 'Fast inference' },
  { name: 'Mistral', label: 'Open weights' }, { name: 'Custom', label: 'Any OpenAI-compat' },
];

// ─────────────────────────────────────────────
// Main Landing component
// ─────────────────────────────────────────────
export function Landing() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
      className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse at center,rgba(107,124,230,0.12) 0%,transparent 70%)' }} />
      </div>

      {/* ════ NAV ════ */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', backgroundColor: 'rgba(10,10,15,0.85)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/favicon.png" alt="North OS" style={{ width: 30, height: 30, borderRadius: 8 }} />
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>North OS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {([['#features','Features'],['#screenshots','Screenshots']] as [string,string][]).map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                {label}
              </a>
            ))}
            <Link to="/tutorials" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              Tutorials
            </Link>
            <Link to="/changelog" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              Changelog
            </Link>
            <a href="#request-access"
              style={{ padding: '7px 18px', borderRadius: 9, background: 'linear-gradient(135deg,#6b7ce6,#9b8cff)', border: 'none', color: 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', letterSpacing: '-0.01em', textDecoration: 'none' }}>
              Request Access
            </a>
          </div>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '160px 24px 90px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', marginBottom: 28 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 100, border: '1px solid rgba(107,124,230,0.3)', background: 'rgba(107,124,230,0.08)', fontSize: 12, color: 'rgba(155,140,255,0.9)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6b7ce6', display: 'inline-block', boxShadow: '0 0 6px #6b7ce6' }} />
            Privacy-first · Local-first AI
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(44px,7vw,76px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.03em', color: 'white', marginBottom: 14 }}>
          Your personal life,<br />
          <span style={{ background: 'linear-gradient(135deg,#6b7ce6 0%,#9b8cff 50%,#c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            organized and understood.
          </span>
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.65, color: 'rgba(255,255,255,0.45)', maxWidth: 520, margin: '0 auto 48px', letterSpacing: '-0.01em' }}>
          A private, AI-powered desktop app for journaling, habits, finances, and subscriptions. Runs 100% on your machine.
        </p>

        <div id="request-access">
          <RequestForm />
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
          Invite-only · Runs locally · No subscription
        </p>
      </section>

      {/* ════ SCREENSHOTS ════ */}
      <section id="screenshots" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#6b7ce6', textTransform: 'uppercase', marginBottom: 12 }}>See it in action</p>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>
            Every corner of your life, in one place.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: 16 }}>
          {SCREENS.map((s) => (
            <div key={s.title} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: '#0d0d14', transition: 'border-color .2s, transform .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(107,124,230,0.35)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                {['#f87171','#fbbf24','#4ade80'].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.6 }} />)}
                <span style={{ marginLeft: 8, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>North OS — {s.title}</span>
              </div>
              <div style={{ padding: 12 }}>{s.mockup}</div>
              <div style={{ padding: '12px 16px 16px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ FEATURES ════ */}
      <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#6b7ce6', textTransform: 'uppercase', marginBottom: 12 }}>What it does</p>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>
            Everything that matters. Nothing that doesn't.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ padding: '28px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', transition: 'border-color .2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(107,124,230,0.25)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'}>
              <div style={{ width: 38, height: 38, borderRadius: 9, marginBottom: 16, background: 'rgba(107,124,230,0.12)', border: '1px solid rgba(107,124,230,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 8, letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════ PRIVACY ════ */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ borderRadius: 20, padding: '60px 64px', border: '1px solid rgba(107,124,230,0.2)', background: 'linear-gradient(135deg,rgba(107,124,230,0.06) 0%,rgba(10,10,15,0) 60%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'radial-gradient(circle,rgba(107,124,230,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 520 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#6b7ce6', textTransform: 'uppercase', marginBottom: 16 }}>Privacy First</p>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 18, color: 'white' }}>
              Your data belongs to you.<br />Full stop.
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
              North OS runs locally on your device. Your thoughts, emotions, routines, and finances never leave your machine. No tracking. No telemetry. No cloud unless you choose it.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Runs entirely on your machine',
                'No accounts, no sign-up required',
                'Zero telemetry or analytics',
                'SQLite database — your data is a single local file',
                'Wipe all data with one click anytime',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                  <span style={{ color: '#6b7ce6', fontSize: 16 }}>✓</span>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ AI PROVIDERS ════ */}
      <section id="ai-providers" style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#6b7ce6', textTransform: 'uppercase', marginBottom: 12 }}>AI providers</p>
          <h2 style={{ fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', color: 'white', marginBottom: 10 }}>Your AI. Your choice.</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', maxWidth: 440, margin: '0 auto' }}>Start with a free local model for full privacy, or use any cloud provider. Switch any time from Settings.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {PROVIDERS.map((p) => (
            <div key={p.name} style={{ padding: '10px 20px', borderRadius: 100, border: '1px solid rgba(107,124,230,0.25)', background: 'rgba(107,124,230,0.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>{p.name}</span>
              <span style={{ fontSize: 11, color: 'rgba(107,124,230,0.5)' }}>·</span>
              <span style={{ fontSize: 11, color: 'rgba(155,140,255,0.55)' }}>{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════ FINAL CTA ════ */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 120px' }}>
        <div style={{ textAlign: 'center', padding: '80px 40px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse,rgba(107,124,230,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#6b7ce6', textTransform: 'uppercase', marginBottom: 20 }}>Get started</p>
          <h2 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'white', marginBottom: 18 }}>
            Start understanding yourself.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', maxWidth: 400, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Private, powerful, and runs entirely on your machine.
          </p>
          <RequestForm compact />
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/favicon.png" alt="North OS" style={{ width: 24, height: 24, borderRadius: 6 }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>North OS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {([['#features','Features'],['#screenshots','Screenshots']] as [string,string][]).map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
                {label}
              </a>
            ))}
            <Link to="/tutorials" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
              Tutorials
            </Link>
            <Link to="/changelog" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
              Changelog
            </Link>
            <a href="mailto:blankspacetechnologies@gmail.com"
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}>
              Feedback
            </a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2025 Blankspace Technologies</span>
          <a href="mailto:blankspacetechnologies@gmail.com"
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>
            blankspacetechnologies@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
