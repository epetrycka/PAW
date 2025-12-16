import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Actor from './Actor.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Actor />
  </StrictMode>,
)