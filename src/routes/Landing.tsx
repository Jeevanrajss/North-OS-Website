import { useState, useEffect, useRef } from 'react';
import { Icon, Eyebrow, Button, Reveal, ModuleCard, Counter } from '../components/shared';

const WEB3FORMS_KEY = '5bd618a2-6535-4c01-bb84-cd6d0de60257';
const RELEASES_API = 'https://api.github.com/repos/Jeevanrajss/North-OS/releases/latest';

type Platform = 'mac_arm' | 'mac_x64' | 'win';
interface ReleaseAssets { mac_arm?: string; mac_x64?: string; win?: string; version: string; }

function useLatestRelease() {
  const [release, setRelease] = useState<ReleaseAssets | null>(null);
  useEffect(() => {
    fetch(RELEASES_API)
      .then(r => r.json())
      .then(data => {
        const assets: ReleaseAssets = { version: data.tag_name || '' };
        for (const a of (data.assets || [])) {
          const n: string = a.name.toLowerCase();
          if (n.includes('arm64') && n.endsWith('.dmg')) assets.mac_arm = a.browser_download_url;
          else if (n.endsWith('.dmg')) assets.mac_x64 = a.browser_download_url;
          else if (n.endsWith('.exe')) assets.win = a.browser_download_url;
        }
        setRelease(assets);
      })
      .catch(() => setRelease({ version: '' }));
  }, []);
  return release;
}

function detectOS(): Platform {
  const ua = navigator.userAgent;
  if (/Windows/.test(ua)) return 'win';
  return 'mac_arm';
}

const PLATFORM_LABELS: Record<Platform, { label: string; icon: string }> = {
  mac_arm: { label: 'Mac — Apple Silicon', icon: 'apple' },
  mac_x64: { label: 'Mac — Intel', icon: 'apple' },
  win: { label: 'Windows', icon: 'windows' },
};

function RequestForm({ release, compact = false }: { release: ReleaseAssets | null; compact?: boolean }) {
  const [platform, setPlatform] = useState<Platform>('mac_arm');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => { setPlatform(detectOS()); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          email,
          subject: `North OS download — ${PLATFORM_LABELS[platform].label}`,
          message: `Platform: ${PLATFORM_LABELS[platform].label}\nVersion: ${release?.version || 'latest'}`,
        }),
      });
    } catch { /* silent */ }
    setStatus('done');
    const url = release?.[platform];
    if (url) setTimeout(() => { window.location.href = url; }, 400);
  }

  if (status === 'done') {
    return <div className="email-success">Download starting… check your downloads folder.</div>;
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {(Object.entries(PLATFORM_LABELS) as [Platform, { label: string; icon: string }][]).map(([p, { label, icon }]) => (
            <button key={p} type="button"
              className={`plat-btn${platform === p ? ' selected' : ''}`}
              onClick={() => setPlatform(p)}>
              <Icon name={icon} size={13} />{label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          <input type="email" required placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-default)', color: 'var(--fg-1)', font: '400 14px/1 var(--font-sans)', outline: 'none', minWidth: 220 }} />
          <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'}>
            <Icon name="download" />
            <span>{status === 'loading' ? 'Starting…' : 'Request Access'}</span>
            <Icon name="arrow" />
            <span className="shimmer" />
          </button>
        </div>
        <div style={{ color: 'var(--fg-4)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          We&apos;ll send release notes. Unsubscribe any time.
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="email-form">
      <div className="platform-row">
        {(Object.entries(PLATFORM_LABELS) as [Platform, { label: string; icon: string }][]).map(([p, { label, icon }]) => (
          <button key={p} type="button"
            className={`plat-btn${platform === p ? ' selected' : ''}`}
            onClick={() => setPlatform(p)}>
            <Icon name={icon} size={13} />{label}
          </button>
        ))}
      </div>
      <div className="email-row">
        <input type="email" required placeholder="your@email.com"
          value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'}>
          <Icon name="download" />
          <span>{status === 'loading' ? 'Starting…' : 'Request Access'}</span>
          <Icon name="arrow" />
          <span className="shimmer" />
        </button>
      </div>
      <div style={{ color: 'var(--fg-4)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
        We&apos;ll send release notes. Unsubscribe any time.
      </div>
    </form>
  );
}

function FloatChip({ cls, ico, color, bg, label, sub }: {
  cls: string; ico: string; color: string; bg: string; label: string; sub: string;
}) {
  return (
    <div className={`float-chip ${cls}`}>
      <div className="ico" style={{ background: bg, color }}>
        <Icon name={ico} size={14} />
      </div>
      <div>
        <div style={{ color: 'var(--fg-1)' }}>{label}</div>
        <div style={{ color: 'var(--fg-4)', fontSize: 10, marginTop: 2, fontFamily: 'var(--font-mono)' }}>{sub}</div>
      </div>
    </div>
  );
}

function ShowcaseArt({ image }: { image: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
  }
  function onLeave() { if (ref.current) ref.current.style.transform = ''; }
  return (
    <div className="showcase-art" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <img src={image} alt="Module preview" />
    </div>
  );
}

function AIDemoSection() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const seq = [600, 1400, 1200, 1400, 1600, 1400];
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    function next() {
      setStage(s => (s + 1) % 6);
      t = setTimeout(next, seq[i++ % seq.length]);
    }
    t = setTimeout(next, seq[0]);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="hero-grid" style={{ alignItems: 'center' }}>
          <Reveal>
            <Eyebrow>North AI</Eyebrow>
            <h2 style={{ font: '700 clamp(34px,4.5vw,56px)/1.05 var(--font-display)', letterSpacing: '-0.025em', margin: '16px 0' }}>
              Grounded in your <span className="grad-text">workspace</span>.
            </h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 17, lineHeight: 1.55, maxWidth: 480 }}>
              North AI runs on your machine via Ollama. It reads your journal, habits, finances
              and subs as context — then answers in plain English, with the exact entries it grounded each claim in.
            </p>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 10, marginTop: 22 }}>
              {[
                'Citations for every figure — open the source entry in a click.',
                'Switch models without losing context — gemma, llama, qwen, any GGUF.',
                'Airplane-mode safe — no network, no telemetry, no quotas.',
              ].map((s, i) => (
                <li key={i} style={{ paddingLeft: 26, position: 'relative', color: 'var(--fg-2)', fontSize: 14, lineHeight: '22px' }}>
                  <span style={{ position: 'absolute', left: 0, top: 8, width: 14, height: 6, borderRadius: 3, background: 'linear-gradient(90deg, var(--primary-400), var(--accent-pink))' }} />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <div className="ai-demo">
              <div className="ai-prompt">
                <div className="ai-avatar user">J</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 500, color: 'var(--fg-1)', fontSize: 13 }}>You</span>
                    <span style={{ color: 'var(--fg-4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>14:06</span>
                  </div>
                  <div className="ai-msg">Where is my May money going? Am I on track to come in under budget?</div>
                  <div className="ai-context">
                    <span className="ctx">📁 Finance · May</span>
                    <span className="ctx">📁 Subscriptions</span>
                  </div>
                </div>
              </div>
              <div className="ai-prompt" style={{ background: 'rgba(139,124,255,0.06)', borderColor: 'rgba(139,124,255,0.2)' }}>
                <div className="ai-avatar"><Icon name="sparkles" size={14} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 500, color: 'var(--fg-1)', fontSize: 13 }}>North AI</span>
                    <span className="ctx" style={{ background: 'rgba(61,255,152,0.10)', color: 'var(--accent-green)', borderColor: 'rgba(61,255,152,0.2)' }}>gemma3:12b · local</span>
                    <span style={{ color: 'var(--fg-4)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>14:06</span>
                  </div>
                  <div className="ai-msg">
                    {stage >= 1 && <>Short answer: you&apos;re <b>14 days into May</b> with <b>₹140 spent</b> against a <b>₹15,000 budget</b> — that&apos;s <b>0.9%</b> burn. </>}
                    {stage >= 2 && <>100% of spend so far is <span className="pill">Subscriptions · Netflix</span> — </>}
                    {stage >= 3 && <>Food, transport, shopping are all at <b>₹0</b> (unusual for week 2). </>}
                    {stage >= 4 && <>Two more renewals: <span className="pill">Claude · 28 May · ₹1,740</span> and <span className="pill">Cursor · 4 Jun · ₹1,672</span>. </>}
                    {stage >= 5 && <>Projected end-of-month: <b>₹1,880</b> — closing May with a <b>₹13,120 surplus</b>. </>}
                    {stage < 5 && <span className="ai-typing"><span /><span /><span /></span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-default)' }}>
                <Icon name="search" size={14} style={{ color: 'var(--fg-4)' }} />
                <span style={{ color: 'var(--fg-4)', fontSize: 13 }}>Ask anything about your journal, habits, finance, subs…</span>
                <span style={{ marginLeft: 'auto', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-4)' }}>⌘K</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Landing() {
  const release = useLatestRelease();

  const MODULES = [
    { ico: 'book', title: 'Journal', desc: "One page per day — mood, tags, summary. AI auto-fills highlights and gratitude after you save.", tag: '↳ Day 134 of 2025' },
    { ico: 'coins', title: 'Finance', desc: "Income, expenses, budgets. Bank SMS parsing — local, private, no Plaid in the loop.", tag: '↳ May · ₹140 spent' },
    { ico: 'repeat', title: 'Subscriptions', desc: "Track every recurring charge, see what's due in the next 14 days, cancel in two clicks.", tag: '↳ 6 active · ₹2,389/mo' },
    { ico: 'flame', title: 'Habits', desc: "Nine habits, daily check-ins, heatmap. AI surfaces sleep + deep work patterns.", tag: '↳ 29-day streak' },
    { ico: 'message', title: 'AI Chat', desc: "A local LLM reads your workspace and reflects back. Grounded answers, with citations.", tag: '↳ Ollama · localhost' },
    { ico: 'settings', title: 'Settings', desc: "Theme, accent, density, AI model, integrations. Export your whole life as JSON, anytime.", tag: '↳ v1.0.20 · indie' },
  ];

  const SHOWCASES = [
    { eyebrow: 'Journal', flip: false, title: 'One page per day. Mood, tags, notes.', body: "Capture the day in 30 seconds — mood, tags, a quick summary. North AI auto-fills highlights, wins, learnings and gratitude after you save.", bullets: ['Calendar, streaks, and a year-in-review built in.', 'Habit ↔ mood correlation over a 90-day window.', 'Semantic search — finds what you meant, not what you typed.'], image: '/feature-journal.png' },
    { eyebrow: 'Finance', flip: true, title: "Where the money went — privately.", body: "Income, expenses, budgets, subscriptions — one place. Locally tracked, privately analyzed. Ask North AI to forecast end-of-month before it surprises you.", bullets: ["Bank SMS / statement parsing — no Plaid, no third-party.", "Budgets, top categories, savings rate, all at a glance.", "Reflect on finances with grounded, on-device context."], image: '/feature-finance.png' },
    { eyebrow: 'Habits', flip: false, title: 'Streaks, patterns, gentle nudges.', body: "Nine habits, tracked daily, drawn into a heatmap. North AI watches the patterns and tells you what to lock down tonight.", bullets: ['Daily check-ins with sleep, deep work, water, running.', "Habit ↔ mood deltas — see what actually moves your week.", 'Streak protection, restarts, and paused-state — no shame.'], image: '/feature-habits.png' },
    { eyebrow: 'Subscriptions', flip: true, title: 'Six recurring charges, two clicks to cancel.', body: "Track every monthly burn, see what's due in the next 14 days, and stop the slow leak. Calendar view shows the exact day each card gets hit.", bullets: ['Active / paused / trial states for every subscription.', 'Yearly projection, daily run-rate, upcoming renewals.', 'Cancellation flow with deep-links to the provider.'], image: '/feature-subscriptions.png' },
  ];

  const PRIVACY_ITEMS = [
    { ico: 'cpu', title: 'Runs locally', desc: 'Ollama on your machine. The model is yours. The data is yours. The compute is yours.', cls: 'alt' },
    { ico: 'cloudOff', title: 'No cloud — by design', desc: 'Zero outbound calls. Airplane-mode safe. No analytics, no telemetry, no account.', cls: '' },
    { ico: 'database', title: 'One file: SQLite', desc: 'Everything lives in ~/Library/Application Support/North/. Back it up like any file.', cls: 'alt-2' },
    { ico: 'shield', title: 'Export anytime', desc: 'JSON + Markdown bundle of journal, habits, finance and subs. No lock-in. Walk away clean.', cls: 'alt-3' },
  ];

  const MARQUEE_ITEMS = [
    { ico: 'book', t: 'Journal' }, { ico: 'flame', t: 'Habits' }, { ico: 'coins', t: 'Finance' },
    { ico: 'repeat', t: 'Subscriptions' }, { ico: 'message', t: 'AI Chat' }, { ico: 'cpu', t: 'Local LLM' },
    { ico: 'shield', t: 'Private' }, { ico: 'zap', t: 'Fast' },
  ];
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <Reveal>
              <Eyebrow live>Early access · invite only</Eyebrow>
              <h1>Your life,<br />on your <span className="grad-text">machine.</span></h1>
              <p className="lede">
                North OS is a private, AI-native operating layer for your week —
                journal, habits, finances, and subscriptions in one workspace.
                Runs locally via Ollama. Nothing leaves your laptop.
              </p>
              <div style={{ marginTop: 30, marginBottom: 16 }}>
                <RequestForm release={release} />
              </div>
              <div className="hero-meta">
                <div className="item"><span className="check">✓</span>100% on-device</div>
                <div className="item"><span className="check">✓</span>macOS &amp; Windows</div>
                <div className="item"><span className="check">✓</span>Free for early access</div>
              </div>
            </Reveal>
            <div className="hero-visual">
              <div className="preview-glow" />
              <div className="preview-card">
                <img src="/feature-dashboard.png" alt="North OS dashboard" />
              </div>
              <FloatChip cls="fc-1" ico="flame" color="#FFB86B" bg="rgba(255,184,107,0.12)" label="29-day streak" sub="habits" />
              <FloatChip cls="fc-2" ico="cpu" color="#B8A5FF" bg="rgba(184,165,255,0.12)" label="gemma3:12b" sub="local · 5.7 GB" />
              <FloatChip cls="fc-3" ico="coins" color="#3DFF98" bg="rgba(61,255,152,0.12)" label="₹84,860 saved" sub="this month" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee" style={{ marginTop: 64 }}>
        <div className="marquee-track">
          {doubled.map((it, i) => (
            <div key={i} className="mq-item">
              <span className="dot" /><Icon name={it.ico} size={18} />{it.t}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="wrap" style={{ marginTop: 64 }}>
        <Reveal>
          <div className="stats">
            <div className="stat"><div className="num"><Counter to={100} suffix="%" /></div><div className="label">On-device</div><div className="delta">Zero cloud calls</div></div>
            <div className="stat"><div className="num"><Counter to={5.7} decimals={1} suffix=" GB" /></div><div className="label">Default model</div><div className="delta">gemma3:12b · local</div></div>
            <div className="stat"><div className="num"><Counter to={6} /></div><div className="label">Modules</div><div className="delta">One workspace</div></div>
            <div className="stat"><div className="num">~<Counter to={142} suffix="MB" /></div><div className="label">Your data</div><div className="delta">SQLite · ~/Library</div></div>
          </div>
        </Reveal>
      </section>

      {/* Modules */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <Eyebrow>Six modules · One workspace</Eyebrow>
              <h2>Everything you keep <span className="aurora-text">scattered</span>, in one place.</h2>
              <p>Most weeks live in five tabs and a notes app. North OS replaces them with one sober dark surface that already knows your week.</p>
            </div>
          </Reveal>
          <div className="modules">
            {MODULES.map((m, i) => <Reveal key={m.title} delay={i * 70}><ModuleCard {...m} /></Reveal>)}
          </div>
        </div>
      </section>

      {/* AI Demo */}
      <AIDemoSection />

      {/* Showcases */}
      {SHOWCASES.map(sc => (
        <section key={sc.eyebrow} className="wrap">
          <div className={`showcase${sc.flip ? ' flip' : ''}`}>
            <Reveal>
              <div className="showcase-copy">
                <Eyebrow>{sc.eyebrow}</Eyebrow>
                <h3>{sc.title}</h3>
                <p>{sc.body}</p>
                <ul className="bullets">{sc.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
                <div style={{ marginTop: 24 }}>
                  <Button variant="ghost" iconRight="arrow" to="/features">See it in full</Button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}><ShowcaseArt image={sc.image} /></Reveal>
          </div>
        </section>
      ))}

      {/* Privacy */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="section-head" style={{ maxWidth: 720 }}>
              <Eyebrow>Privacy &amp; ownership</Eyebrow>
              <h2>Your data <span className="aurora-text">never leaves</span> this laptop.</h2>
              <p>The default is local. Not because it&apos;s a feature — because there isn&apos;t anywhere else for it to go.</p>
            </div>
          </Reveal>
          <div className="modules">
            {PRIVACY_ITEMS.map((it, i) => (
              <Reveal key={it.title} delay={i * 70}>
                <div className={`privacy-panel ${it.cls}`}>
                  <div className="ico"><Icon name={it.ico} size={18} /></div>
                  <h4>{it.title}</h4>
                  <p>{it.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="wrap" style={{ marginTop: 80, marginBottom: 80 }}>
        <Reveal>
          <div className="cta-final">
            <Eyebrow live>Early access · invite only</Eyebrow>
            <h2 style={{ marginTop: 16 }}>Take your week back.</h2>
            <p>Six modules, one workspace, zero cloud. Request access below.</p>
            <div style={{ maxWidth: 560, margin: '0 auto' }}>
              <RequestForm release={release} compact />
            </div>
            <div style={{ marginTop: 24, color: 'var(--fg-4)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
              macOS · Windows · Local AI via Ollama
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
