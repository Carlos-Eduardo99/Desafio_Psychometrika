import React, { useState, useEffect } from 'react';
import { Grid, Button, Box } from '@chakra-ui/react';
import axios from 'axios';
import PokemonCard from './PokemonCard';

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_SPECIES_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon-species';
const POKEMON_PER_PAGE = 12;

const Pokedex = ({ selectedGeneration }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      try {
        let apiUrl;

        if (selectedGeneration) {
          const response = await axios.get(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
          const pokemonUrls = response.data.pokemon_species.map(pokemon => `${POKEMON_SPECIES_API_BASE_URL}/${pokemon.name}`);
          const pokemonDetails = await Promise.all(pokemonUrls.map(async url => {
            const pokemonSpeciesResponse = await axios.get(url);
            const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
            return pokemonResponse.data;
          }));
          setNextPage(null);

          // Ordena o array pelo número do Pokémon
          setPokemonList([...pokemonDetails].sort((a, b) => a.id - b.id));
        } else {
          apiUrl = `${POKEMON_API_BASE_URL}?limit=${POKEMON_PER_PAGE}&offset=${(pageCount - 1) * POKEMON_PER_PAGE}`;
          const response = await axios.get(apiUrl);
          setNextPage(response.data.next);

          const pokemonDetails = await Promise.all(response.data.results.map(async (pokemon) => {
            const pokemonResponse = await axios.get(pokemon.url);
            return pokemonResponse.data;
          }));

          setPokemonList((prevList) => (pageCount === 1 ? [...pokemonDetails].sort((a, b) => 
          a.id - b.id) : [...new Set([...prevList, ...pokemonDetails])].sort((a, b) => a.id - b.id)));
        }
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [pageCount, selectedGeneration]);

  const handleLoadMore = () => {
    setPageCount((prevPageCount) => prevPageCount + 1);
  };

  return (
    <Box className="content" p="1rem" bgColor="#fff" width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center">
      <Grid templateColumns={`repeat(4, 1fr)`} gap={4}>
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            number={pokemon.id}
            name={pokemon.name}
            pokeDetails={pokemon}
            image={pokemon.sprites.front_default}
          />
        ))}
      </Grid>
      {nextPage && (
        <Button mt={4} onClick={handleLoadMore} isLoading={loading} loadingText='Carregar mais Pokemons'>
          Carregar mais Pokemons
        </Button>
      )}
    </Box>
  );
};

export default Pokedex;