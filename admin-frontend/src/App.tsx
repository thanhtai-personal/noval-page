// src/App.tsx
import '@radix-ui/themes/styles.css';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/routes/router';
import { I18nProvider } from '@/lib/i18n/i18n';
import { Theme } from '@radix-ui/themes';

function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <Theme>
          <AppRouter />
        </Theme>
      </BrowserRouter>
    </I18nProvider>
  );
}
export default App;
