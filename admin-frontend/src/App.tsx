import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import CrawlerPage from '@/pages/CrawlerPage';
import RequireAuth from '@/components/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <CrawlerPage />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
