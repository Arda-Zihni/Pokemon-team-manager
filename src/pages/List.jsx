import { useEffect, useState } from 'react'
import PokemonCard from '../components/PokemonCard.jsx'

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function List() {
  const [pokemons, setPokemons] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()

    async function loadPokemon() {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151', { signal: controller.signal })
        if (!response.ok) throw new Error('Pokémon konden niet worden geladen.')
        const list = await response.json()
        const standardPokemons = list.results.filter((item) => (
          !item.name.includes('-mega') && !item.name.includes('-gmax')
        ))
        setPokemons(standardPokemons)
        setStatus('success')
      } catch (error) {
        if (error.name !== 'AbortError') setStatus('error')
      }
    }

    loadPokemon()
    return () => controller.abort()
  }, [])

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <h1>Pokémon</h1>
        </div>
        <span className="count-badge">{pokemons.length || '...'} Pokémon</span>
      </div>
      {status === 'loading' && <p className="status-message">Pokémon worden geladen...</p>}
      {status === 'error' && <p className="status-message error-message">De Pokémon konden niet worden geladen. Probeer opnieuw.</p>}
      {status === 'success' && <div className="pokemon-list">
        {pokemons.map((item) => (
          <PokemonCard
            key={item.name}
            id={item.url.split('/').filter(Boolean).pop()}
            name={formatName(item.name)}
            image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.url.split('/').filter(Boolean).pop()}.png`}
          />
        ))}
      </div>}
    </section>
  )
}

export default List
