import { Link } from 'react-router-dom'

function PokemonCard({ id, name, image, teamName, teamColor, isFavorite }) {
  return (
    <Link className="pokemon-row" to={`/detail/${id}`}>
      <span className="pokemon-icon">
        <img src={image} alt={name} />
      </span>
      <span className="pokemon-info">
        <strong>{name}</strong>
        {(teamName || isFavorite) && (
          <small className="pokemon-tags">
            {teamName && <span className={`team-tag team-tag-${teamColor}`}>{teamName}</span>}
            {isFavorite && <span className="favorite-tag">★ Favoriet</span>}
          </small>
        )}
      </span>
      <span className="pokemon-number">#{String(id).padStart(3, '0')}</span>
    </Link>
  )
}

export default PokemonCard
