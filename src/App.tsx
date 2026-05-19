import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './styles/design-system.css';
import { Header, Footer, useCursorGlow } from './components/shared';
import { Landing } from './routes/Landing';
import { Features } from './routes/Features';
import { Privacy } from './routes/Privacy';
import { Download } from './routes/Download';
import { Tutorials } from './routes/Tutorials';
import { Changelog } from './routes/Changelog';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function Layout() {
  useCursorGlow();
  return (
    <>
      <div className="aurora" />
      <div className="grain" />
      <div id="cursor-glow" className="cursor-glow" />
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/download" element={<Download />} />
        <Route path="/tutorials" element={<Tutorials />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Layout />
    </>
  );
}
