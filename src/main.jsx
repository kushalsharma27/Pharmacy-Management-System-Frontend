import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './Context/ThemeContext'  // Add this import
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>  {/* Wrap App with ThemeProvider */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)