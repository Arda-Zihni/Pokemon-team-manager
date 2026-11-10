import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PokemonCard from '../components/PokemonCard.jsx'
import { usePokemonTeam } from '../context/usePokemonTeam.js'

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function List() {
  const [pokemons, setPokemons] = useState([])
  const [status, setStatus] = useState('loading')
  const { teams, favorites, storageError } = usePokemonTeam()

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
        <div className="list-heading-actions">
          <span className="count-badge">{pokemons.length || '...'} Pokémon</span>
          <Link className="team-button" to="/teams">Beheer teams</Link>
        </div>
      </div>
      {storageError && <p className="status-message error-message">{storageError}</p>}
      {status === 'loading' && <p className="status-message">Pokémon worden geladen...</p>}
      {status === 'error' && <p className="status-message error-message">De Pokémon konden niet worden geladen. Probeer opnieuw.</p>}
      {status === 'success' && <div className="pokemon-list">
        {pokemons.map((item) => {
          const id = Number(item.url.split('/').filter(Boolean).pop())
          const assignedTeam = teams.find((team) => team.members.some((member) => member.id === id))
          const isFavorite = favorites.pokemon.some((pokemon) => pokemon.id === id)
          return (
            <PokemonCard
              key={item.name}
              id={id}
              name={formatName(item.name)}
              image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
              teamName={assignedTeam?.name}
              teamColor={assignedTeam?.color}
              isFavorite={isFavorite}
            />
          )
        })}
      </div>}
    </section>
  )
}

export default List
