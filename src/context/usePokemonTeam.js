import { useContext } from 'react'
import PokemonTeamContext from './PokemonTeamContext.js'

export function usePokemonTeam() {
  const context = useContext(PokemonTeamContext)
  if (!context) throw new Error('usePokemonTeam moet binnen PokemonTeamProvider worden gebruikt.')
  return context
}
