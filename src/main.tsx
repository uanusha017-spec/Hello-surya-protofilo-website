import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { PortfolioProvider } from './context/PortfolioContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </ErrorBoundary>
);
