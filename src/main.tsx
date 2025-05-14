
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Apply dark mode class based on system preference initially to avoid flash
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('data-agent-theme');

if (storedTheme === 'dark' || (!storedTheme && prefersDarkMode)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
