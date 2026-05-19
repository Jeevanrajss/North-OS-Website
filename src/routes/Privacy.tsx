import { Icon, Eyebrow, Button, Reveal } from '../components/shared';

export function Privacy() {
  const KV = [
    ['Default storage', '~/Library/.../north.sqlite', 'good'],
    ['Cloud sync', 'Off — no servers exist', 'good'],
    ['Telemetry', 'None. No SDK, no pings.', 'good'],
    ['Crash reports', 'Local file. Opt-in to email.', 'good'],
    ['AI inference', 'Ollama · localhost:11434', 'good'],
    ['Network calls', 'Zero, when AI is on Ollama', 'good'],
    ['Tracking pixels', 'Never.', 'good'],
    ['Account required', 'No login. No email. No password.', 'good'],
  ];

  const STAYS = ['Journal entries, moods, tags', 'Bank transaction history, budgets', 'Subscription list and renewals', 'Habit log and 30-day heatmap', 'Every AI chat thread and citation', 'Your model weights (Ollama)'];
  const NEVER = ['No telemetry — not even \'version pinged\'', 'No crash uploads (opt-in via email)', 'No accounts, no user IDs, no cookies', 'No anonymized stats, no feature flags', 'No third-party SDKs of any kind', 'No background sync, ever'];

  const HOW = [
    { ico: 'database', title: '1. SQLite', desc: 'One file at ~/Library/Application Support/North/north.sqlite. Open it in any SQLite viewer.', cls: 'alt-2' },
    { ico: 'cpu', title: '2. Ollama', desc: 'Local model server at localhost:11434. North OS talks to it like an API — but it\'s yours.', cls: 'alt' },
    { ico: 'lock', title: '3. macOS Keychain', desc: 'API tokens for read-only integrations live in Keychain. Never on disk as plain text.', cls: 'alt-3' },
    { ico: 'shield', title: '4. Auto-backup', desc: 'Optional nightly encrypted snapshot to your iCloud Drive. Off by default. Your call.', cls: '' },
    { ico: 'cloudOff', title: '5. Airplane-mode', desc: 'Pull the wifi cable and it works identically. The fastest privacy test there is.', cls: 'alt' },
    { ico: 'download', title: '6. Export anytime', desc: 'JSON + Markdown bundle of everything, on demand. No lock-in. Walk away clean.', cls: 'alt-3' },
  ];

  return (
    <div className="page">
      <section className="privacy-hero">
        <div className="wrap">
          <div className="hero-grid">
            <Reveal>
              <Eyebrow live>Privacy · v1.0.20</Eyebrow>
              <h1 style={{ font: '700 clamp(44px,6.4vw,84px)/1.02 var(--font-display)', letterSpacing: '-0.03em', margin: '18px 0' }}>
                Nothing leaves<br />this <span className="grad-text">laptop.</span>
              </h1>
              <p style={{ font: '400 18px/1.55 var(--font-sans)', color: 'var(--fg-2)', maxWidth: 520 }}>
                The default in most apps is to phone home. The default in North OS is silence.
                No accounts, no servers, no telemetry. Your week lives in a single file on disk.
              </p>
              <div style={{ marginTop: 28 }}>
                <Button size="lg" magnetic icon="download" iconRight="arrow" to="/download">Download · try it free</Button>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="kv-grid">
                {KV.map(([k, v, g], i) => (
                  <div key={i} style={{ display: 'contents' }}>
                    <div className="k">{k}</div>
                    <div className={`v ${g}`}>{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <Eyebrow>What stays · What leaves</Eyebrow>
              <h2>A short, honest comparison.</h2>
              <p>If you put a sniffer between North OS and your router, here is exactly what you would see.</p>
            </div>
          </Reveal>
          <div className="split">
            <Reveal>
              <div className="privacy-panel">
                <div className="ico" style={{ background: 'rgba(61,255,152,0.12)', color: 'var(--accent-green)' }}>
                  <Icon name="check" size={20} />
                </div>
                <h4>Stays on device</h4>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 10, marginTop: 12 }}>
                  {STAYS.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg-2)', fontSize: 14 }}>
                      <Icon name="check" size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />{s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="privacy-panel" style={{ background: 'rgba(255,91,110,0.04)', borderColor: 'rgba(255,91,110,0.16)' }}>
                <div className="ico" style={{ background: 'rgba(255,91,110,0.12)', color: 'var(--error)' }}>
                  <Icon name="cloudOff" size={20} />
                </div>
                <h4>Never sent anywhere</h4>
                <ul style={{ listStyle: 'none', display: 'grid', gap: 10, marginTop: 12 }}>
                  {NEVER.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg-2)', fontSize: 14 }}>
                      <Icon name="cloudOff" size={14} style={{ color: 'var(--error)', flexShrink: 0 }} />{s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <Eyebrow>How it works</Eyebrow>
              <h2>One file. One process. One model.</h2>
              <p>Open the file in DB Browser if you don't believe us. It's plain SQLite. Your life, in tables.</p>
            </div>
          </Reveal>
          <div className="modules">
            {HOW.map((it, i) => (
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

      <section className="wrap" style={{ marginTop: 80, marginBottom: 80 }}>
        <Reveal>
          <div className="cta-final">
            <Eyebrow live>Early access · invite only</Eyebrow>
            <h2 style={{ marginTop: 16 }}>Take your week back.</h2>
            <p>Six modules, one workspace, zero cloud. Request access on the home page.</p>
            <div style={{ display: 'inline-flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button magnetic size="lg" icon="download" iconRight="arrow" to="/">Request Access</Button>
              <Button variant="ghost" size="lg" to="/features">Browse features</Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
