// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/routes/router';
import { I18nProvider } from '@/lib/i18n/i18n';

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </I18nProvider>
  );
}
export default App;
