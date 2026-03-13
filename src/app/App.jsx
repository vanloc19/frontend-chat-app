import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <main className="app-shell">
      <Outlet />
    </main>
  )
}

export default App
