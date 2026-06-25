import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import SmoothScroller from './components/SmoothScroller';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmoothScroller>
      <App />
    </SmoothScroller>
  </StrictMode>,
);
