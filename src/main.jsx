import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './remix.css'
import './epic-motion.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

