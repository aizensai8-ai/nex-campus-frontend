import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import App from './App.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import './index.css'

function Root() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <App />
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
