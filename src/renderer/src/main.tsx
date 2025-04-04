import './assets/main.css';
import './assets/nprogress.css';
import './assets/split.css';
import './assets/output.css'

import { QueryClient, QueryClientProvider } from "react-query";
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
const queryClient = new QueryClient();
createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
</React.StrictMode>
)
