import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <NavLink className="brand" to="/">
          <span className="brand-mark">P</span>
          <span>Pokélog</span>
        </NavLink>
        <nav aria-label="Hoofdnavigatie" className="navigation">
          <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/">
            Home
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/list">
            Team lijst
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} to="/detail/1">
            Detail
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navigation
