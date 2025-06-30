import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import DemoPoll from './DemoPoll.jsx'
import Dashboard from './Dashboard.jsx'
import PollPreview from './PollPreview.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/demo" element={<DemoPoll />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/poll-preview" element={<PollPreview />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
