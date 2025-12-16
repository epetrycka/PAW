import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter} from 'react-router-dom'

// npm install react-router-dom react-dom

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </StrictMode>,
)