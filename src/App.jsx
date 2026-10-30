import { Route, Routes } from 'react-router-dom'
import './App.css'
import Detail from './pages/Detail.jsx'
import List from './pages/List.jsx'

function App() {
  return (
    <main className="page-content">
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/list" element={<List />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </main>
  )
}

export default App
