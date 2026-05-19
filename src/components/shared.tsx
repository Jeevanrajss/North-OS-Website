import { useEffect, useRef, useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* ---- Icons ---- */
const ICONS: Record<string, string> = {
  arrow: "M5 12h14M13 5l7 7-7 7",
  arrowDown: "M12 5v14M19 12l-7 7-7-7",
  check: "M5 12l5 5L20 7",
  sparkles: "M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9zM19 14l.9 2.1 2.1.9-2.1.9L19 20l-.9-2.1-2.1-.9 2.1-.9zM5 4l.7 1.6L7.3 6.3 5.7 7 5 8.6 4.3 7 2.7 6.3 4.3 5.6z",
  lock: "M5 11h14v10H5zM7 11V7a5 5 0 0110 0v4",
  cloud: "M17.5 19a4.5 4.5 0 100-9 6.5 6.5 0 00-12.4 2.5A4 4 0 006 19z",
  cloudOff: "M2 2l20 20M5.5 5.5A6.5 6.5 0 0118 8a4.5 4.5 0 014 7.5M16 16H6a4 4 0 01-1.5-7.7",
  cpu: "M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3M7 7h10v10H7zM10 10h4v4h-4z",
  book: "M4 19V5a2 2 0 012-2h13v18H6a2 2 0 01-2-2zM4 19a2 2 0 012-2h13",
  coins: "M8 14a6 6 0 100-12 6 6 0 000 12zM16 22a6 6 0 100-12 6 6 0 000 12zM6 8h4M14 16h4M8 6v4M16 14v4",
  repeat: "M3 12V6h6M21 12v6h-6M3 6l4 4M21 18l-4-4M9 6c5 0 8 3 8 8M15 18c-5 0-8-3-8-8",
  flame: "M12 22c4 0 7-3 7-7 0-3-2-5-3-7-1-2-1-4 0-6-3 1-7 5-7 9 0 1 1 2 2 2-3 0-5 2-5 5 0 4 3 4 6 4z",
  message: "M21 12a8 8 0 11-3-6L21 4l-1 5a8 8 0 011 3z",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12c0 .5-.1 1-.2 1.4l2.1 1.6-2 3.4-2.4-1A7 7 0 0114 18.7L13.6 21h-3.2L10 18.7a7 7 0 01-2.5-1.3l-2.4 1-2-3.4 2-1.6A7 7 0 015 12c0-.5.1-1 .2-1.4l-2.1-1.6 2-3.4 2.4 1A7 7 0 0110 5.3L10.4 3h3.2L14 5.3a7 7 0 012.5 1.3l2.4-1 2 3.4-2 1.6c.1.4.1.9.1 1.4z",
  download: "M12 3v12M7 10l5 5 5-5M5 21h14",
  apple: "M16 2c0 2-1 4-3 4-1-2 1-4 3-4zM12 6c-3 0-5 2-5 5 0 5 3 11 6 11 1 0 2-1 3-1s2 1 3 1c3 0 6-6 6-11 0-3-2-5-5-5-1 0-2 1-3 1s-2-1-3-1z",
  windows: "M3 5l8-1v8H3zm0 8h8v7l-8-1zm10-9.2l9-1.3v10H13zm0 9.2h9v10l-9-1z",
  linux: "M12 2C8 2 6 6 6 11s2 9 6 9 6-4 6-9-2-9-6-9zM10 8a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zM8 16c1 1 2 2 4 2s3-1 4-2",
  github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9c0-1.1.1-1.5-.5-2.1 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.3 4.3 0 00-.1-3.2s-1-.3-3.5 1.3a12 12 0 00-6.4 0C6.5 2 5.5 2.3 5.5 2.3a4.3 4.3 0 00-.1 3.2A4.6 4.6 0 004 8.7c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2.1V21",
  twitter: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  bolt: "M13 2L3 14h8l-1 8 10-12h-8z",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
  chevronRight: "M9 18l6-6-6-6",
  zap: "M13 2L4 13h6l-1 9 9-12h-6z",
  database: "M4 6a8 3 0 0016 0 8 3 0 00-16 0zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
};

export function Icon({ name, size = 18, stroke = 1.5, fill = 'none', style = {} }: {
  name: string; size?: number; stroke?: number; fill?: string; style?: React.CSSProperties;
}) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d} />
    </svg>
  );
}

/* ---- Brand ---- */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <div className="brand-mark" style={{ width: size, height: size, borderRadius: size * 0.3 }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <path d="M4 20L12 4L20 20L12 14L4 20Z" fill="white" />
      </svg>
    </div>
  );
}

export function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link to="/" className="brand" onClick={onClick}>
      <BrandMark />
      <span className="brand-name">North OS</span>
    </Link>
  );
}

/* ---- Button ---- */
export function Button({ children, variant = 'primary', size, to, href, onClick, icon, iconRight, magnetic = false, ...rest }: {
  children: ReactNode; variant?: 'primary' | 'ghost'; size?: 'lg'; to?: string;
  href?: string; onClick?: () => void; icon?: string; iconRight?: string;
  magnetic?: boolean; [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const cls = `btn btn-${variant}${size === 'lg' ? ' btn-lg' : ''}`;

  useEffect(() => {
    if (!magnetic || !ref.current) return;
    const el = ref.current;
    function onMove(e: MouseEvent) {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    }
    function onLeave() { el.style.transform = ''; }
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [magnetic]);

  const inner = (
    <>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} />}
      <span className="shimmer" />
    </>
  );

  if (to) return <Link ref={ref as React.RefObject<HTMLAnchorElement>} className={cls} to={to} onClick={onClick} {...(rest as object)}>{inner}</Link>;
  if (href) return <a ref={ref as React.RefObject<HTMLAnchorElement>} className={cls} href={href} onClick={onClick} {...(rest as object)}>{inner}</a>;
  return <button ref={ref as React.RefObject<HTMLButtonElement>} className={cls} onClick={onClick} {...(rest as object)}>{inner}</button>;
}

/* ---- Eyebrow ---- */
export function Eyebrow({ children, live }: { children: ReactNode; live?: boolean }) {
  return (
    <span className="eyebrow">
      {live && <span className="dot" />}
      {children}
    </span>
  );
}

/* ---- Reveal on scroll ---- */
export function Reveal({ children, delay = 0, as: As = 'div', ...rest }: {
  children: ReactNode; delay?: number; as?: keyof JSX.IntrinsicElements; [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { setShown(true); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As ref={ref as never} className={`reveal${shown ? ' in' : ''}`}
      style={{ transitionDelay: `${delay}ms` }} {...(rest as object)}>
      {children}
    </As>
  );
}

/* ---- Module card with cursor-track glow ---- */
export function ModuleCard({ ico, title, desc, tag }: {
  ico: string; title: string; desc: string; tag: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
  return (
    <div className="module" ref={ref} onMouseMove={onMove}>
      <div className="ico"><Icon name={ico} size={20} /></div>
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{ __html: desc }} />
      <div className="tag">{tag}</div>
    </div>
  );
}

/* ---- Animated counter ---- */
export function Counter({ to, suffix = '', prefix = '', duration = 1200, decimals = 0 }: {
  to: number; suffix?: string; prefix?: string; duration?: number; decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = performance.now();
        function step(t: number) {
          const p = Math.min(1, (t - start) / duration);
          const ease = 1 - Math.pow(1 - p, 3);
          setV(to * ease);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{prefix}{v.toFixed(decimals)}{suffix}</span>;
}

/* ---- Cursor glow hook ---- */
export function useCursorGlow() {
  useEffect(() => {
    const el = document.getElementById('cursor-glow');
    if (!el) return;
    let raf = 0, x = 0, y = 0, tx = 0, ty = 0;
    function loop() {
      x += (tx - x) * 0.15; y += (ty - y) * 0.15;
      el!.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      raf = requestAnimationFrame(loop);
    }
    function onMove(e: MouseEvent) { tx = e.clientX; ty = e.clientY; }
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);
}

/* ---- Nav ---- */
export function Header() {
  const { pathname } = useLocation();
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Brand />
        <nav className="nav-links">
          <Link to="/" className={`nav-link${pathname === '/' ? ' active' : ''}`}>Home</Link>
          <Link to="/features" className={`nav-link${pathname === '/features' ? ' active' : ''}`}>Features</Link>
          <Link to="/privacy" className={`nav-link${pathname === '/privacy' ? ' active' : ''}`}>Privacy</Link>
          <Link to="/changelog" className={`nav-link${pathname === '/changelog' ? ' active' : ''}`}>Changelog</Link>
          <Link to="/tutorials" className={`nav-link${pathname === '/tutorials' ? ' active' : ''}`}>Tutorials</Link>
        </nav>
        <div className="nav-cta">
          <Button to="/download" icon="download">Get North OS</Button>
        </div>
      </div>
    </header>
  );
}

/* ---- Footer ---- */
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Brand />
            <p style={{ marginTop: 16, color: 'var(--fg-3)', fontSize: 13, lineHeight: 1.6, maxWidth: 280 }}>
              An AI-native operating layer for your week. Built for the calm operator who already knows their stack.
            </p>
            <div style={{ marginTop: 12 }}>
              <a href="mailto:blankspacetechnologies@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--fg-3)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                <Icon name="mail" size={12} />
                blankspacetechnologies@gmail.com
              </a>
            </div>
          </div>
          <div>
            <h5>Product</h5>
            <Link to="/features">Features</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/download">Download</Link>
            <Link to="/changelog">Changelog</Link>
          </div>
          <div>
            <h5>Learn</h5>
            <Link to="/tutorials">Tutorials</Link>
            <Link to="/features">What's inside</Link>
          </div>
          <div>
            <h5>Connect</h5>
            <a href="mailto:blankspacetechnologies@gmail.com">Feedback</a>
            <a href="mailto:blankspacetechnologies@gmail.com">Support</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2025 Blankspace Technologies · Made in Bangalore</div>
          <div className="commit">Early access · invite only</div>
        </div>
      </div>
    </footer>
  );
}
