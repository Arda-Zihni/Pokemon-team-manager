import { useMemo, useRef, useState } from 'react'
import PokemonTeamContext from './PokemonTeamContext.js'

const STORAGE_KEY = 'pokemonTeamData'
const LEGACY_STORAGE_KEY = 'pokemonTeam'
const TEAM_COLORS = ['yellow', 'red', 'blue']

function createInitialData() {
  return {
    teams: [
      { id: 'yellow', name: 'Geel', color: 'yellow', members: [] },
      { id: 'red', name: 'Rood', color: 'red', members: [] },
      { id: 'blue', name: 'Blauw', color: 'blue', members: [] },
    ],
    favorites: { pokemon: [], teams: [] },
  }
}

function hasDuplicateTeam(teams, name, color, excludedTeamId) {
  const normalizedName = name.trim().toLowerCase()
  return teams.some((team) => (
    team.id !== excludedTeamId
    && team.name.trim().toLowerCase() === normalizedName
    && team.color === color
  ))
}

function loadStoredData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      const parsed = JSON.parse(savedData)
      if (!Array.isArray(parsed.teams) || !parsed.favorites) {
        throw new Error('De opgeslagen teamgegevens hebben een ongeldig formaat.')
      }

      const teams = parsed.teams
        .filter((team) => team && typeof team.id === 'string' && typeof team.name === 'string')
        .map((team) => ({
          id: team.id,
          name: team.name,
          color: TEAM_COLORS.includes(team.color) ? team.color : 'blue',
          members: Array.isArray(team.members)
            ? team.members
              .filter((member) => Number.isInteger(member.id) && member.id > 0)
              .map((member) => ({
                id: member.id,
                name: typeof member.name === 'string' ? member.name : `Pokémon #${String(member.id).padStart(3, '0')}`,
              }))
            : [],
        }))

      return {
        data: {
          teams,
          favorites: {
            pokemon: Array.isArray(parsed.favorites.pokemon)
              ? parsed.favorites.pokemon.filter((pokemon) => Number.isInteger(pokemon.id) && pokemon.id > 0)
              : [],
            teams: Array.isArray(parsed.favorites.teams)
              ? parsed.favorites.teams.filter((teamId) => teams.some((team) => team.id === teamId))
              : [],
          },
        },
        error: '',
      }
    }

    const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY)
    const data = createInitialData()
    if (legacyData) {
      const legacyIds = JSON.parse(legacyData)
      if (Array.isArray(legacyIds)) {
        data.teams[0].members = legacyIds
          .filter((id) => Number.isInteger(id) && id > 0)
          .slice(0, 6)
          .map((id) => ({ id, name: `Pokémon #${String(id).padStart(3, '0')}` }))
      }
    }
    return { data, error: '' }
  } catch (error) {
    console.error('De opgeslagen teamgegevens konden niet worden geladen.', error)
    return { data: createInitialData(), error: 'Opgeslagen gegevens konden niet worden gelezen.' }
  }
}

export function PokemonTeamProvider({ children }) {
  const [store, setStore] = useState(loadStoredData)
  const storeRef = useRef(store)

  function updateData(updater) {
    const current = storeRef.current
    const nextData = updater(current.data)
    if (nextData === current.data) return false

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
      const nextStore = { data: nextData, error: '' }
      storeRef.current = nextStore
      setStore(nextStore)
      return true
    } catch (error) {
      console.error('De teamwijziging kon niet worden opgeslagen.', error)
      const nextStore = { ...current, error: 'De wijziging kon niet worden opgeslagen.' }
      storeRef.current = nextStore
      setStore(nextStore)
      return false
    }
  }

  const value = useMemo(() => ({
    teams: store.data.teams,
    favorites: store.data.favorites,
    storageError: store.error,
    addPokemonToTeam(pokemonId, pokemonName, teamId) {
      return updateData((data) => {
        if (!data.teams.some((team) => team.id === teamId)) return data
        const member = { id: pokemonId, name: pokemonName }
        return {
          ...data,
          teams: data.teams.map((team) => ({
            ...team,
            members: team.members
              .filter((item) => item.id !== pokemonId)
              .concat(team.id === teamId ? [member] : []),
          })),
        }
      })
    },
    removePokemonFromTeam(pokemonId, teamId) {
      return updateData((data) => ({
        ...data,
        teams: data.teams.map((team) => team.id === teamId
          ? { ...team, members: team.members.filter((member) => member.id !== pokemonId) }
          : team),
      }))
    },
    createTeam(name, color) {
      const team = {
        id: `team-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: name.trim(),
        color: TEAM_COLORS.includes(color) ? color : 'blue',
        members: [],
      }
      if (!team.name) return false
      return updateData((data) => (
        hasDuplicateTeam(data.teams, team.name, team.color)
          ? data
          : { ...data, teams: [...data.teams, team] }
      ))
    },
    updateTeam(teamId, name, color) {
      const trimmedName = name.trim()
      if (!trimmedName) return false
      return updateData((data) => {
        const currentTeam = data.teams.find((team) => team.id === teamId)
        if (!currentTeam) return data
        const updatedColor = TEAM_COLORS.includes(color) ? color : currentTeam.color
        if (hasDuplicateTeam(data.teams, trimmedName, updatedColor, teamId)) return data

        return {
          ...data,
          teams: data.teams.map((team) => team.id === teamId
            ? { ...team, name: trimmedName, color: updatedColor }
            : team),
        }
      })
    },
    deleteTeam(teamId) {
      return updateData((data) => ({
        ...data,
        teams: data.teams.filter((team) => team.id !== teamId),
        favorites: {
          ...data.favorites,
          teams: data.favorites.teams.filter((id) => id !== teamId),
        },
      }))
    },
    togglePokemonFavorite(pokemonId, pokemonName) {
      return updateData((data) => {
        const isFavorite = data.favorites.pokemon.some((pokemon) => pokemon.id === pokemonId)
        return {
          ...data,
          favorites: {
            ...data.favorites,
            pokemon: isFavorite
              ? data.favorites.pokemon.filter((pokemon) => pokemon.id !== pokemonId)
              : [...data.favorites.pokemon, { id: pokemonId, name: pokemonName }],
          },
        }
      })
    },
    toggleTeamFavorite(teamId) {
      return updateData((data) => ({
        ...data,
        favorites: {
          ...data.favorites,
          teams: data.favorites.teams.includes(teamId)
            ? data.favorites.teams.filter((id) => id !== teamId)
            : [...data.favorites.teams, teamId],
        },
      }))
    },
  }), [store])

  return <PokemonTeamContext.Provider value={value}>{children}</PokemonTeamContext.Provider>
}
