import { useState, createContext, useContext } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import "./App.css"

const PokemonContext = createContext()

function PokemonProvider({ children }) {
  const [team, setTeam] = useState([])
  const [error, setError] = useState("")

  const addPokemon = (pokemon) => {
    if (team.length >= 6) {
      setError("Equipe complète (6 max)")
      return
    }

    setTeam([...team, pokemon])
    setError("")
  }

  return (
    <PokemonContext.Provider value={{ team, addPokemon, error }}>
      {children}
    </PokemonContext.Provider>
  )
}

function PokemonSearchPage() {
  const [name, setName] = useState("")
  const [pokemon, setPokemon] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const { addPokemon, error } = useContext(PokemonContext)

  const searchPokemon = async () => {
    setNotFound(false)

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
      )

      if (!response.ok) {
        throw new Error("Not found")
      }

      const data = await response.json()
      setPokemon(data)
    } catch (err) {
      setPokemon(null)
      setNotFound(true)
    }
  }

  return (
    <div>
      <h2>Recherche Pokémon</h2>

      <input
        type="text"
        placeholder="Nom du pokemon"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={searchPokemon}>Rechercher</button>

      {notFound && <p>Pokémon introuvable</p>}

      {pokemon && (
        <div>
          <h3>{pokemon.name}</h3>
          <img src={pokemon.sprites.front_default} />
          <p>Taille : {pokemon.height}</p>
          <p>Poids : {pokemon.weight}</p>

          <button onClick={() => addPokemon(pokemon)}>
            Ajouter à l'équipe
          </button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

function MonEquipePage() {
  const { team } = useContext(PokemonContext)

  return (
    <div className="pokemon">
      <h2>Mon équipe</h2>
      {team.length === 0 && <p>Aucun Pokémon</p>}

      {team.map((pokemon, index) => (
        <div key={index}>
          <h4>{pokemon.name}</h4>
          <img src={pokemon.sprites.front_default} />
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <PokemonProvider>
      <BrowserRouter>
        <nav>
          <Link to="/">Recherche</Link> |{" "}
          <Link to="/mon-equipe">Mon équipe</Link>
        </nav>

        <Routes>
          <Route path="/" element={<PokemonSearchPage />} />
          <Route path="/mon-equipe" element={<MonEquipePage />} />
        </Routes>
      </BrowserRouter>
    </PokemonProvider>
  )
}

export default App
