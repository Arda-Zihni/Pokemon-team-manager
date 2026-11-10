import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePokemonTeam } from '../context/usePokemonTeam.js'

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function Detail() {
  const { id } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [status, setStatus] = useState('loading')
  const [teamMenuOpen, setTeamMenuOpen] = useState(false)
  const { teams, favorites, storageError, addPokemonToTeam, removePokemonFromTeam, togglePokemonFavorite } = usePokemonTeam()

  useEffect(() => {
    const controller = new AbortController()

    async function loadPokemon() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { signal: controller.signal })
        if (!response.ok) throw new Error('Pokémon niet gevonden.')
        setPokemon(await response.json())
        setStatus('success')
      } catch (error) {
        if (error.name !== 'AbortError') setStatus('error')
      }
    }

    loadPokemon()
    return () => controller.abort()
  }, [id])

  if (status === 'loading') return <section className="detail-section"><p className="status-message">Pokémon wordt geladen...</p></section>
  if (status === 'error') return <section className="detail-section"><Link className="back-link" to="/list">← Terug naar Pokémon</Link><p className="status-message error-message">Deze Pokémon kon niet worden gevonden.</p></section>

  const typeNames = pokemon.types.map(({ type }) => type.name)
  const hp = pokemon.stats.find(({ stat }) => stat.name === 'hp')
  const name = formatName(pokemon.name)
  const currentTeam = teams.find((team) => team.members.some((member) => member.id === pokemon.id))
  const isFavorite = favorites.pokemon.some((favorite) => favorite.id === pokemon.id)

  return (
    <section className="detail-section">
      <Link className="back-link" to="/list">← Terug naar Pokémon</Link>
      <div className="detail-layout">
        <div className="detail-art"><img src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default} alt={formatName(pokemon.name)} /></div>
        <div className="detail-copy">
          <p className="eyebrow">Pokédex detail</p>
          <div className="detail-title"><h1>{name}</h1><span>#{String(pokemon.id).padStart(3, '0')}</span></div>
          <p className="type-label">{typeNames.map(formatName).join(' / ')}</p>
          <p className="detail-description">{name} heeft {pokemon.abilities.length} bekende ability{pokemon.abilities.length === 1 ? '' : 's'} en een basis HP van {hp?.base_stat}.</p>
          <div className="stats">
            <div><small>Gewicht</small><strong>{(pokemon.weight / 10).toFixed(1)} kg</strong></div>
            <div><small>Hoogte</small><strong>{(pokemon.height / 10).toFixed(1)} m</strong></div>
          </div>
          <p className="team-membership">
            Huidig team: {currentTeam ? <span className={`team-tag team-tag-${currentTeam.color}`}>{currentTeam.name}</span> : 'Geen'}
          </p>
          <div
            className={`team-picker${teamMenuOpen ? ' team-picker-open' : ''}`}
            onMouseEnter={() => setTeamMenuOpen(true)}
            onMouseLeave={() => setTeamMenuOpen(false)}
          >
            <button
              className="team-button"
              type="button"
              aria-haspopup="true"
              aria-expanded={teamMenuOpen}
              onClick={() => setTeamMenuOpen((open) => !open)}
            >
              {currentTeam ? 'Wijzig team' : 'Kies een team'}
            </button>
            <div className="team-options">
              {teams.map((team) => (
                <button
                  className="team-option"
                  key={team.id}
                  type="button"
                  onClick={() => {
                    if (currentTeam?.id === team.id) {
                      removePokemonFromTeam(pokemon.id, team.id)
                    } else {
                      addPokemonToTeam(pokemon.id, name, team.id)
                    }
                    setTeamMenuOpen(false)
                  }}
                >
                  <span className={`team-swatch team-swatch-${team.color}`} />
                  {currentTeam?.id === team.id ? `Verwijder uit ${team.name}` : `Zet in ${team.name}`}
                </button>
              ))}
              {teams.length === 0 && <Link className="team-option" to="/teams">Maak eerst een team aan</Link>}
            </div>
          </div>
          <button
            className={`favorite-button${isFavorite ? ' is-favorite' : ''}`}
            type="button"
            aria-pressed={isFavorite}
            onClick={() => togglePokemonFavorite(pokemon.id, name)}
          >
            {isFavorite ? '★ Verwijder uit favorieten' : '☆ Voeg toe aan favorieten'}
          </button>
          {storageError && <p className="status-message error-message">{storageError}</p>}
        </div>
      </div>
    </section>
  )
}

export default Detail
