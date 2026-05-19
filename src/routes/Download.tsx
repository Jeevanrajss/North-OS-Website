import { useState, useEffect } from 'react';
import { Icon, Eyebrow, Button, Reveal } from '../components/shared';

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

const PLATFORMS: { id: Platform; name: string; arch: string; icon: string; ext: string }[] = [
  { id: 'mac_arm', name: 'macOS', arch: 'Apple Silicon · 13+', icon: 'apple', ext: 'dmg' },
  { id: 'mac_x64', name: 'macOS', arch: 'Intel · 13+', icon: 'apple', ext: 'dmg' },
  { id: 'win', name: 'Windows', arch: 'x64 · 10/11', icon: 'windows', ext: 'exe' },
];

function DownloadForm({ release }: { release: ReleaseAssets | null }) {
  const [platform, setPlatform] = useState<Platform>('mac_arm');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Windows/.test(ua)) setPlatform('win');
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    const plat = PLATFORMS.find(p => p.id === platform)!;
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          email,
          subject: `North OS download — ${plat.name} ${plat.arch}`,
          message: `Platform: ${plat.name} ${plat.arch}\nVersion: ${release?.version || 'latest'}`,
        }),
      });
    } catch { /* silent */ }
    setStatus('done');
    const url = release?.[platform];
    if (url) setTimeout(() => { window.location.href = url; }, 400);
  }

  if (status === 'done') {
    return <div className="email-success" style={{ maxWidth: 480, margin: '0 auto' }}>Download starting… check your downloads folder.</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520, margin: '32px auto 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {PLATFORMS.map(p => (
          <button key={p.id} type="button"
            className={`plat${platform === p.id ? '' : ''}`}
            onClick={() => setPlatform(p.id)}
            style={{
              padding: 20, borderRadius: 14, background: platform === p.id ? 'rgba(139,124,255,0.12)' : 'var(--surface)',
              border: `1px solid ${platform === p.id ? 'rgba(139,124,255,0.40)' : 'var(--border-default)'}`,
              color: 'var(--fg-1)', cursor: 'pointer', transition: 'all 250ms ease',
              textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8,
            }}>
            <div style={{ color: platform === p.id ? 'var(--primary-300)' : 'var(--fg-2)' }}>
              <Icon name={p.icon} size={26} stroke={1.4} />
            </div>
            <div style={{ font: '500 15px/1 var(--font-display)' }}>{p.name}</div>
            <div style={{ font: '500 11px/1 var(--font-mono)', color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.arch}</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input type="email" required placeholder="your@email.com" value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ flex: 1, padding: '13px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-default)', color: 'var(--fg-1)', font: '400 14px/1 var(--font-sans)', outline: 'none' }} />
        <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'} style={{ whiteSpace: 'nowrap' }}>
          <Icon name="download" />
          <span>{status === 'loading' ? 'Starting…' : 'Download'}</span>
          <Icon name="arrow" />
          <span className="shimmer" />
        </button>
      </div>
      <div style={{ color: 'var(--fg-4)', fontSize: 12, fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
        We'll send release notes to your email. Unsubscribe any time.
      </div>
    </form>
  );
}

export function Download() {
  const release = useLatestRelease();

  const SYS_REQS = [
    ['macOS', '13 Ventura or newer · Apple Silicon or Intel'],
    ['Windows', '10 / 11 · x64'],
    ['RAM', '8 GB minimum · 16 GB recommended for 12B models'],
    ['Disk', '~50 MB for app · ~6 GB for default Ollama model'],
    ['GPU', 'Optional · Metal on macOS, CUDA on Windows'],
    ['Network', 'Not required after install — runs fully offline'],
  ];

  return (
    <div className="page">
      <section className="download-hero">
        <div className="wrap">
          <Reveal>
            <Eyebrow live>Early access · invite only</Eyebrow>
            <h1 style={{ font: '700 clamp(48px,6vw,78px)/1 var(--font-display)', letterSpacing: '-0.03em', margin: '18px auto', maxWidth: 920 }}>
              Pick your <span className="aurora-text">platform.</span>
            </h1>
            <p style={{ color: 'var(--fg-2)', fontSize: 18, maxWidth: 600, margin: '0 auto', lineHeight: 1.55 }}>
              Single binary, signed and notarized. No installer chaos. Drop it into Applications,
              run it, point it at your local Ollama. You're in.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <DownloadForm release={release} />
          </Reveal>
          <Reveal>
            <div style={{ marginTop: 24, padding: 20, borderRadius: 14, background: 'rgba(139,124,255,0.06)', border: '1px solid rgba(139,124,255,0.18)', display: 'flex', gap: 14, alignItems: 'flex-start', maxWidth: 640, margin: '24px auto 0' }}>
              <Icon name="cpu" size={20} style={{ color: 'var(--primary-300)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--fg-1)', marginBottom: 4 }}>You also need Ollama (for the AI half).</div>
                <div style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.5 }}>
                  North OS uses Ollama at{' '}
                  <code style={{ fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--fg-1)' }}>localhost:11434</code>.
                  Free, open source. Run{' '}
                  <code style={{ fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--primary-300)' }}>ollama pull gemma3:12b</code>
                  {' '}after install and you're done.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <Eyebrow>Pricing</Eyebrow>
              <h2>Free for early access.</h2>
              <p>During early access, North OS is completely free. Request access with your email above.</p>
            </div>
          </Reveal>
          <div className="pricing">
            <Reveal>
              <div className="price">
                <h3>Early Access</h3>
                <div className="desc">Anyone with an invite. Free, forever.</div>
                <div className="num">₹0<small> / forever</small></div>
                <ul>
                  <li>All six modules, no limits</li>
                  <li>Local AI via Ollama — any model</li>
                  <li>Full export &amp; import</li>
                  <li>Auto-backup to your local drive</li>
                  <li>Community support</li>
                </ul>
                <Button variant="ghost" iconRight="arrow" to="/">Request access</Button>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="price featured">
                <h3>Invite Only</h3>
                <div className="desc">Currently limited to friends and early adopters.</div>
                <div className="num" style={{ fontSize: 36 }}>Invite<small> required</small></div>
                <ul>
                  <li>Everything in Early Access</li>
                  <li>Direct access to the builder</li>
                  <li>Shape the roadmap</li>
                  <li>Early build drops</li>
                  <li>Priority support</li>
                </ul>
                <Button magnetic iconRight="arrow" href="mailto:blankspacetechnologies@gmail.com">Request an invite</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Reveal>
            <div className="section-head">
              <Eyebrow>System requirements</Eyebrow>
              <h2>Bring your own laptop. That's it.</h2>
            </div>
          </Reveal>
          <div className="kv-grid" style={{ maxWidth: 720 }}>
            {SYS_REQS.map(([k, v], i) => (
              <div key={i} style={{ display: 'contents' }}>
                <div className="k">{k}</div>
                <div className="v good">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 80, marginBottom: 80 }}>
        <Reveal>
          <div className="cta-final">
            <Eyebrow live>Early access · invite only</Eyebrow>
            <h2 style={{ marginTop: 16 }}>Take your week back.</h2>
            <p>Six modules, one workspace, zero cloud.</p>
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
