import { Eyebrow, Button, Reveal } from '../components/shared';

const CHANGELOG = [
  {
    version: 'v1.0.20', date: 'May 2025', badge: 'Latest' as const,
    changes: [
      { tag: 'feat', text: 'Habit reminder time picker — set your own reminder time' },
      { tag: 'fix', text: 'Notification icons for morning briefings & budget warnings' },
      { tag: 'fix', text: "Budget warning now correctly opt-in (won't fire without consent)" },
      { tag: 'fix', text: 'Import transactions now respects your profile currency setting' },
      { tag: 'improve', text: '50 MB file size guard on bank statement imports' },
    ],
  },
  {
    version: 'v1.0.19', date: 'May 2025', badge: null,
    changes: [
      { tag: 'feat', text: 'Danger Zone in Settings — wipe all data with 3-step confirmation' },
      { tag: 'fix', text: 'Notification time showing wrong timezone ("5h ago" → "just now")' },
      { tag: 'fix', text: 'OS notification sound no longer double-plays alongside in-app audio' },
      { tag: 'fix', text: 'Existing unread notifications no longer re-fire as new push notifications' },
    ],
  },
  {
    version: 'v1.0.18', date: 'Apr 2025', badge: null,
    changes: [
      { tag: 'feat', text: 'Full notification system — morning briefings, habit reminders, subscription alerts, budget warnings' },
      { tag: 'feat', text: 'Configurable quiet hours to silence notifications at night' },
      { tag: 'feat', text: 'Notification bell with unread badge + sound' },
      { tag: 'improve', text: 'Per-notification sound toggle in Settings' },
    ],
  },
  {
    version: 'v1.0.0 → v1.0.17', date: 'Feb–Apr 2025', badge: null,
    changes: [
      { tag: 'feat', text: 'Core modules: Journal, Habits, Finance, Subscriptions, AI Chat' },
      { tag: 'feat', text: 'Bank statement import: CSV, Excel, PDF with AI auto-categorization' },
      { tag: 'feat', text: 'Module system — enable/disable sections from Settings' },
      { tag: 'feat', text: 'Desktop app packaging (Mac + Windows) with auto-updater' },
      { tag: 'feat', text: 'License system for controlled distribution' },
    ],
  },
];

export function Changelog() {
  return (
    <div className="page">
      <section className="cl-hero">
        <div className="wrap" style={{ maxWidth: 800 }}>
          <Reveal>
            <Eyebrow>Release history</Eyebrow>
            <h1 className="cl-hero" style={{ font: '700 clamp(36px,5vw,60px)/1.05 var(--font-display)', letterSpacing: '-0.025em', margin: '18px 0' }}>Changelog</h1>
            <p style={{ fontSize: 17, color: 'var(--fg-2)', lineHeight: 1.6 }}>Every release, every fix. Updates ship automatically.</p>
          </Reveal>
        </div>
      </section>

      <div className="wrap" style={{ maxWidth: 800, paddingBottom: 100 }}>
        {CHANGELOG.map((entry, i) => (
          <Reveal key={entry.version} delay={i * 60}>
            <div className="cl-card">
              <div className="cl-header">
                <span className="cl-version">{entry.version}</span>
                {entry.badge && <span className="cl-badge latest">{entry.badge}</span>}
                <span className="cl-date">{entry.date}</span>
              </div>
              <div className="cl-items">
                {entry.changes.map((c, j) => (
                  <div key={j} className="cl-item">
                    <span className={`cl-tag ${c.tag}`}>{c.tag}</span>
                    <span className="cl-desc">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        <Reveal delay={240}>
          <div style={{ marginTop: 48, padding: '28px 32px', borderRadius: 16, background: 'rgba(139,124,255,0.06)', border: '1px solid rgba(139,124,255,0.18)', textAlign: 'center' }}>
            <div style={{ fontWeight: 500, fontSize: 15, color: 'var(--fg-1)', marginBottom: 8 }}>Want early access to new builds?</div>
            <p style={{ fontSize: 14, color: 'var(--fg-3)', marginBottom: 20 }}>Request access on the home page and we'll loop you in as new versions ship.</p>
            <Button to="/" icon="download" iconRight="arrow">Request Access</Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
