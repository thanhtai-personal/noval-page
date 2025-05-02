import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CrawlerPage from '@/pages/CrawlerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CrawlerPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
