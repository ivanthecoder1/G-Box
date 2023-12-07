import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './components/AuthContent.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Use auth to authenticate if an admin is logged in or not */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
