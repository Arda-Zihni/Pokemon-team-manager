import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePokemonTeam } from '../context/usePokemonTeam.js'

const TEAM_COLORS = ['yellow', 'red', 'blue']

function Teams() {
  const {
    teams,
    favorites,
    storageError,
    createTeam,
    updateTeam,
    deleteTeam,
    removePokemonFromTeam,
    toggleTeamFavorite,
    togglePokemonFavorite,
  } = usePokemonTeam()
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('blue')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [editingColor, setEditingColor] = useState('blue')
  const [formError, setFormError] = useState('')

  function isDuplicate(name, color, excludedTeamId) {
    const normalizedName = name.trim().toLowerCase()
    return teams.some((team) => (
      team.id !== excludedTeamId
      && team.name.trim().toLowerCase() === normalizedName
      && team.color === color
    ))
  }

  function handleCreate(event) {
    event.preventDefault()
    if (isDuplicate(newName, newColor)) {
      setFormError('Er bestaat al een team met deze naam en kleur.')
      return
    }
    if (createTeam(newName, newColor)) {
      setNewName('')
      setFormError('')
    }
  }

  function startEditing(team) {
    setEditingId(team.id)
    setEditingName(team.name)
    setEditingColor(team.color)
  }

  function handleUpdate(event, teamId) {
    event.preventDefault()
    if (isDuplicate(editingName, editingColor, teamId)) {
      setFormError('Er bestaat al een team met deze naam en kleur.')
      return
    }
    if (updateTeam(teamId, editingName, editingColor)) {
      setEditingId(null)
      setFormError('')
    }
  }

  return (
    <section className="teams-section">
      <Link className="back-link" to="/list">← Terug naar Pokémon</Link>
      <div className="section-heading">
        <h1>Mijn teams</h1>
        <span className="count-badge">{teams.length} teams</span>
      </div>
      {storageError && <p className="status-message error-message">{storageError}</p>}
      {formError && <p className="status-message error-message" role="alert">{formError}</p>}

      <form className="create-team-form" onSubmit={handleCreate}>
        <label htmlFor="new-team-name">Nieuw team</label>
        <input
          id="new-team-name"
          value={newName}
          onChange={(event) => {
            setNewName(event.target.value)
            setFormError('')
          }}
          placeholder="Teamnaam"
          required
        />
        <select
          value={newColor}
          onChange={(event) => {
            setNewColor(event.target.value)
            setFormError('')
          }}
          aria-label="Teamkleur"
        >
          {TEAM_COLORS.map((color) => <option key={color} value={color}>{color}</option>)}
        </select>
        <button className="team-button" type="submit">Team aanmaken</button>
      </form>

      <div className="teams-list">
        {teams.map((team) => {
          const isTeamFavorite = favorites.teams.includes(team.id)
          return (
            <article className="team-card" key={team.id}>
              <div className="team-card-heading">
                <span className={`team-swatch team-swatch-${team.color}`} />
                {editingId === team.id ? (
                  <form className="edit-team-form" onSubmit={(event) => handleUpdate(event, team.id)}>
                    <input
                      aria-label="Teamnaam aanpassen"
                      value={editingName}
                      onChange={(event) => {
                        setEditingName(event.target.value)
                        setFormError('')
                      }}
                      required
                    />
                    <select
                      value={editingColor}
                      onChange={(event) => {
                        setEditingColor(event.target.value)
                        setFormError('')
                      }}
                      aria-label="Teamkleur aanpassen"
                    >
                      {TEAM_COLORS.map((color) => <option key={color} value={color}>{color}</option>)}
                    </select>
                    <button className="team-button" type="submit">Opslaan</button>
                    <button
                      className="plain-button"
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setFormError('')
                      }}
                    >
                      Annuleren
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="team-card-title">
                      <h2>{team.name}</h2>
                      <span className="count-badge">{team.members.length} Pokémon</span>
                    </div>
                    <button
                      className={`favorite-button${isTeamFavorite ? ' is-favorite' : ''}`}
                      type="button"
                      aria-pressed={isTeamFavorite}
                      onClick={() => toggleTeamFavorite(team.id)}
                    >
                      {isTeamFavorite ? '★ Favoriet' : '☆ Favoriet'}
                    </button>
                    <button className="plain-button" type="button" onClick={() => startEditing(team)}>Bewerken</button>
                    <button className="plain-button delete-button" type="button" onClick={() => deleteTeam(team.id)}>Verwijderen</button>
                  </>
                )}
              </div>
              {team.members.length > 0 ? (
                <ul className="team-members">
                  {team.members.map((pokemon) => (
                    <li key={pokemon.id}>
                      <Link to={`/detail/${pokemon.id}`}>
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                          alt=""
                        />
                        <span>{pokemon.name}</span>
                        <span className="pokemon-number">#{String(pokemon.id).padStart(3, '0')}</span>
                      </Link>
                      <button
                        className="plain-button delete-button"
                        type="button"
                        onClick={() => removePokemonFromTeam(pokemon.id, team.id)}
                      >
                        Uit team halen
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="status-message">Nog geen Pokémon in dit team.</p>
              )}
            </article>
          )
        })}
      </div>

      <section className="favorite-pokemon-section">
        <h2>Favoriete Pokémon</h2>
        {favorites.pokemon.length === 0 ? (
          <p className="status-message">Je hebt nog geen favoriete Pokémon.</p>
        ) : (
          <ul className="team-members">
            {favorites.pokemon.map((pokemon) => (
              <li key={pokemon.id}>
                <Link to={`/detail/${pokemon.id}`}>
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                    alt=""
                  />
                  <span>{pokemon.name}</span>
                  <span className="pokemon-number">#{String(pokemon.id).padStart(3, '0')}</span>
                </Link>
                <button
                  className="plain-button"
                  type="button"
                  onClick={() => togglePokemonFavorite(pokemon.id, pokemon.name)}
                >
                  Verwijder favoriet
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}

export default Teams
