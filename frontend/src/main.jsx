import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { PostContexProvider } from './context/PostContex.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <PostContexProvider>
        <App />
      </PostContexProvider>
    </UserContextProvider>
  </StrictMode>,
)
