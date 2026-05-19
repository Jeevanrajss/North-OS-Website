import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './routes/Landing';
import { Tutorials } from './routes/Tutorials';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
