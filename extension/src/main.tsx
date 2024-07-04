import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = document.getElementById('root')
// set the height of root to 400
root!.style.height = '400px'
root!.style.width = '300px'

ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
