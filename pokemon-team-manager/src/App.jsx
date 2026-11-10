import { Route, Routes } from 'react-router-dom'
import './App.css'
import Detail from './pages/Detail.jsx'
import Home from './pages/Home.jsx'
import List from './pages/List.jsx'
import Teams from './pages/Teams.jsx'
import { PokemonTeamProvider } from './context/PokemonTeamProvider.jsx'

function App() {
  return (
    <PokemonTeamProvider>
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </main>
    </PokemonTeamProvider>
  )
}

export default App
