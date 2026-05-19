import { Link } from 'react-router-dom';

const CHANGELOG = [
  {
    version: 'v1.0.20', date: 'May 2025', badge: 'Latest',
    changes: [
      'Added habit reminder time picker — set your own reminder time',
      'Fixed notification icons for morning briefings & budget warnings',
      "Budget warning now correctly opt-in (won't fire without consent)",
      'Import transactions now respects your profile currency setting',
      '50 MB file size guard on bank statement imports',
    ],
  },
  {
    version: 'v1.0.19', date: 'May 2025', badge: null,
    changes: [
      'Danger Zone in Settings — wipe all data with 3-step confirmation',
      'Fixed notification time showing wrong timezone ("5h ago" → "just now")',
      'OS notification sound no longer double-plays alongside in-app audio',
      'Existing unread notifications no longer re-fire as new push notifications',
    ],
  },
  {
    version: 'v1.0.18', date: 'Apr 2025', badge: null,
    changes: [
      'Full notification system — morning briefings, habit reminders, subscription alerts, budget warnings',
      'Configurable quiet hours to silence notifications at night',
      'Notification bell with unread badge + sound',
      'Per-notification sound toggle in Settings',
    ],
  },
  {
    version: 'v1.0.0 → v1.0.17', date: 'Feb–Apr 2025', badge: null,
    changes: [
      'Core modules: Journal, Habits, Finance, Subscriptions, AI Chat',
      'Bank statement import: CSV, Excel, PDF with AI auto-categorization',
      'Module system — enable/disable sections from Settings',
      'Desktop app packaging (Mac + Windows) with auto-updater',
      'License system for controlled distribution',
    ],
  },
];

export function Changelog() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse at center,rgba(107,124,230,0.10) 0%,transparent 70%)' }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', backgroundColor: 'rgba(10,10,15,0.85)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/favicon.png" alt="North OS" style={{ width: 30, height: 30, borderRadius: 8 }} />
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', color: 'white' }}>North OS</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link to="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              ← Home
            </Link>
            <Link to="/tutorials" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              Tutorials
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 24px 100px' }}>
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: '#6b7ce6', textTransform: 'uppercase', marginBottom: 14 }}>Release history</p>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08, color: 'white', marginBottom: 14 }}>
            Changelog
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, margin: 0 }}>
            Every release, every fix. Updates ship automatically to all users.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CHANGELOG.map((entry) => (
            <div key={entry.version} style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden', transition: 'border-color .2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(107,124,230,0.3)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: entry.badge ? 'rgba(107,124,230,0.04)' : 'transparent' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'white', fontFamily: 'monospace' }}>{entry.version}</span>
                {entry.badge && (
                  <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 99, background: 'rgba(107,124,230,0.2)', border: '1px solid rgba(107,124,230,0.35)', color: '#9b8cff', fontWeight: 600 }}>{entry.badge}</span>
                )}
                <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>{entry.date}</span>
              </div>
              <ul style={{ margin: 0, padding: '16px 24px 20px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {entry.changes.map((c) => (
                  <li key={c} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>
                    <span style={{ color: '#6b7ce6', marginTop: 2, flexShrink: 0, fontSize: 12 }}>✓</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px', maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2025 Blankspace Technologies</span>
        <a href="mailto:Blankspacetechnologies@gmail.com"
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>
          Blankspacetechnologies@gmail.com
        </a>
      </footer>
    </div>
  );
}
