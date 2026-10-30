import { Link } from 'react-router-dom'

function PokemonCard({ id, name, image }) {
  return (
    <Link className="pokemon-row" to={`/detail/${id}`}>
      <span className="pokemon-icon">
        <img src={image} alt={name} />
      </span>
      <span className="pokemon-info">
        <strong>{name}</strong>
      </span>
      <span className="pokemon-number">#{String(id).padStart(3, '0')}</span>
    </Link>
  )
}

export default PokemonCard
