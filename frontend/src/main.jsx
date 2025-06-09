import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { PostContexProvider } from './context/PostContex.jsx'
import { ChatContextProvider } from './context/ChatContex.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <PostContexProvider>
        <ChatContextProvider>
          <SocketContextProvider>
        <App />
          </SocketContextProvider>
        </ChatContextProvider>
      </PostContexProvider>
    </UserContextProvider>
  </StrictMode>,
)
