import { useRef } from 'react';
import { Icon, Eyebrow, Button, Reveal } from '../components/shared';

const MODULES = [
  {
    id: 'dashboard', eyebrow: 'Module 01 · Dashboard', title: 'The first surface, every morning.',
    body: "A single page that already knows your week — habit streak, journal status, what's due this week, and a one-click morning briefing the AI generates locally.",
    bullets: ['Day-of-year counter, week number, cycle context.', '4 KPI tiles: habit streak, journal streak, subs this month, due this week.', "Today's habits inline — tap to check off, never leave the page.", 'Morning briefing — North AI scans journal, habits, finance, calendar.'],
    image: '/feature-dashboard.png',
    meta: ['Day 134 / 2025', '1 of 9 habits done', '₹140 spent · May', '29-day streak'],
  },
  {
    id: 'journal', eyebrow: 'Module 02 · Journal', title: 'One page per day. Nothing more.',
    body: "Mood, tags, summary — and as many entries as you want. North AI watches the patterns over weeks and surfaces what mattered.",
    bullets: ['Pick up to 3 moods, free-form tag, optional summary blocks.', 'Auto-fills highlights, wins, learnings, gratitude after you save.', 'Calendar heatmap, 7-day streak, longest streak this month.', "Year-in-review bar chart of entries + average mood per month.", "Semantic search — 'days I felt drained' finds the right entries."],
    image: '/feature-journal.png',
    meta: ['Cycle 14 · Week 20', '12 entries this month', '+0.18 mood vs last', '56 tags · 11 unique'],
  },
  {
    id: 'finance', eyebrow: 'Module 03 · Finance', title: "Where the money went — privately.",
    body: "Income, expenses, budgets, subscriptions — one place. Locally tracked, privately analyzed. No Plaid, no third-party broker.",
    bullets: ['Total income, expenses, net balance, savings rate — month-by-month.', 'Recent transactions, grouped by day, with category and account.', 'Top categories with progress bars and per-category narratives.', 'North AI · Finance — ask for forecast, comparison, anomaly detection.'],
    image: '/feature-finance.png',
    meta: ['₹85,000 income', '₹140 expenses', '99.8% savings rate', '0.9% of monthly budget'],
  },
  {
    id: 'subs', eyebrow: 'Module 04 · Subscriptions', title: 'Stop the slow leak.',
    body: "Six recurring charges, two due this week. Tracked, summarized, cancellable in two clicks. The calendar tells you the exact day each card gets hit.",
    bullets: ['Cards per service: monthly cost, yearly projection, next renewal.', 'Status pills — active / paused / trial — and category tags.', 'Filter tabs: All · Active · Paused · Trials.', 'Upcoming charges, next 30 days, with deep-links to provider.'],
    image: '/feature-subscriptions.png',
    meta: ['6 active · 2 paused', '₹2,389 / month', '₹28,668 / yearly', '≈ ₹78 / day'],
  },
  {
    id: 'habits', eyebrow: 'Module 05 · Habits', title: 'Streaks, patterns, gentle nudges.',
    body: "Nine habits, daily check-ins, heatmap. North AI watches what correlates with mood and tells you what to lock down tonight.",
    bullets: ["Today's check-in list — circle taps, no friction.", "Streak count per habit + 30-day heatmap with completion percent.", "Habit ↔ mood deltas — +1.40 on deep-work days, −1.31 on sleep-skipped days.", "Pattern surface — 'Sleep + deep work, in that order'."],
    image: '/feature-habits.png',
    meta: ['29-day flame', '38 of 63 checks', '60% this week', '9 habits, 68% completion'],
  },
  {
    id: 'aichat', eyebrow: 'Module 06 · AI Chat', title: "A second brain that never leaks.",
    body: "A local LLM via Ollama with grounded context across every module. Switch models, browse old threads, suggest prompts based on what you've been logging.",
    bullets: ['Threads grouped by today / yesterday / earlier — searchable.', 'Grounded context panel — see what the model is reading.', "Suggested prompts — 'forecast May at this pace', 'which subs to cancel'.", 'Model picker — gemma3, llama3, qwen, any GGUF you\'ve pulled.'],
    image: '/feature-aichat.png',
    meta: ['gemma3:12b · 5.7 GB', 'via Ollama · localhost:11434', '5 transactions indexed', 'Nothing leaves your device'],
  },
  {
    id: 'settings', eyebrow: 'Module 07 · Settings', title: 'Yours to tune. Yours to leave.',
    body: "Profile, appearance, AI, integrations. Everything runs on your machine — change what you want, when you want.",
    bullets: ['Theme · Aurora / Slate / Glow / Light · accent color picker.', 'Density · Compact, Comfy, Spacious. Reduce-motion supported.', 'AI & Privacy · default model, Ollama endpoint, auto-summarize toggle.', 'Data & Backup · auto-backup, full JSON export, import from Day One / Notion.', 'Danger zone — reset preferences, clear chats, wipe everything.'],
    image: '/feature-settings.png',
    meta: ['Local-only · indie', 'v1.0.20', 'Auto-backup nightly', '142 MB on disk'],
  },
];

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

export function Features() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="page">
      <section className="features-hero">
        <div className="wrap">
          <Reveal>
            <Eyebrow>Features</Eyebrow>
            <h1>Seven surfaces.<br /><span className="aurora-text">One workspace.</span></h1>
            <p>Every module is opinionated, dark by default, and grounded in a single SQLite file on your laptop. Nothing more. Nothing less.</p>
          </Reveal>
          <Reveal delay={120}>
            <div className="feature-toc">
              {MODULES.map(m => (
                <a key={m.id} href={`#${m.id}`}
                  onClick={e => { e.preventDefault(); scrollTo(m.id); }}>
                  {m.eyebrow.split('·')[1]?.trim()}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="wrap">
        {MODULES.map((m, i) => (
          <section key={m.id} id={m.id} className={`showcase${i % 2 === 1 ? ' flip' : ''}`} style={{ scrollMarginTop: 80 }}>
            <Reveal>
              <div className="showcase-copy">
                <Eyebrow>{m.eyebrow}</Eyebrow>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
                <ul className="bullets">
                  {m.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
                {m.meta && (
                  <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {m.meta.map((tag, j) => (
                      <span key={j} style={{ font: '500 11px/1.6 var(--font-mono)', color: 'var(--fg-3)', padding: '5px 10px', borderRadius: 6, background: 'var(--surface-elev)', border: '1px solid var(--border-default)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal delay={150}><ShowcaseArt image={m.image} /></Reveal>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="wrap" style={{ marginTop: 80, marginBottom: 80 }}>
        <Reveal>
          <div className="cta-final">
            <Eyebrow live>Early access · invite only</Eyebrow>
            <h2 style={{ marginTop: 16 }}>Take your week back.</h2>
            <p>Six modules, one workspace, zero cloud. Request access on the home page.</p>
            <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button magnetic size="lg" icon="download" iconRight="arrow" to="/">Request Access</Button>
              <Button variant="ghost" size="lg" icon="shield" to="/privacy">How privacy works</Button>
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
