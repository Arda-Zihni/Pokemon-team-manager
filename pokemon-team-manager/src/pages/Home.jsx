import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="hero-section">
      <p className="eyebrow">Jouw digitale Pokédex</p>
      <h1>Verzamel kennis.<br /><span>Maak je team.</span></h1>
      <p className="hero-copy">
        Ontdek Pokémon, bekijk hun eigenschappen en stel stap voor stap jouw ideale team samen.
      </p>
      <div className="hero-actions">
        <Link className="button button-primary" to="/list">Bekijk de lijst <span aria-hidden="true">→</span></Link>
        <Link className="text-link" to="/detail/1">Bekijk een detail <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="home-note">
        <span className="note-dot" />
        <span>3 views, 1 duidelijke route</span>
      </div>
    </section>
  )
}

export default Home
