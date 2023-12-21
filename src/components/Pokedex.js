import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Button } from '@chakra-ui/react';
import PokemonCard from './PokemonCard';

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_SPECIES_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon-species';
const POKEMON_PER_PAGE = 12;

const Pokedex = ({ selectedGeneration, selectedTypes }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);

      try {
        let apiUrl;

        if (selectedGeneration && selectedTypes.length === 0) {
          
          const response = await axios.get(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
          const pokemonUrls = response.data.pokemon_species.map((pokemon) => `${POKEMON_SPECIES_API_BASE_URL}/${pokemon.name}`);
          const pokemonDetails = await Promise.all(
            pokemonUrls.map(async (url) => {
              const pokemonSpeciesResponse = await axios.get(url);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            })
          );

          setNextPage(null);
          setPokemonList([...pokemonDetails].sort((a, b) => a.id - b.id));
        } else if (selectedTypes.length > 0) {
        
          const typeApiUrls = selectedTypes.map((type) => `https://pokeapi.co/api/v2/type/${type}`);
          const typeResponses = await Promise.all(typeApiUrls.map((url) => axios.get(url)));
          const pokemonUrls = typeResponses.flatMap((response) => response.data.pokemon.map((pokemon) => pokemon.pokemon.url));

          if (selectedGeneration) {
            
            const generationResponse = await axios.get(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
            const generationPokemonUrls = generationResponse.data.pokemon_species.map((pokemon) => `${POKEMON_SPECIES_API_BASE_URL}/${pokemon.name}`);
            const filteredPokemonUrls = pokemonUrls.filter((url) => generationPokemonUrls.includes(url));
            const filteredPokemonDetails = await Promise.all(
              filteredPokemonUrls.map(async (url) => {
                const pokemonResponse = await axios.get(url);
                return pokemonResponse.data;
              })
            );

            const finalFilteredPokemonDetails = filteredPokemonDetails.filter((pokemon) => {
              const pokemonTypes = pokemon.types.map((type) => type.type.name);
              return selectedTypes.every((type) => pokemonTypes.includes(type));
            });

            setNextPage(null);
            setPokemonList([...finalFilteredPokemonDetails].sort((a, b) => a.id - b.id));
          } else {
            
            const pokemonDetails = await Promise.all(
              pokemonUrls.map(async (url) => {
                const pokemonResponse = await axios.get(url);
                return pokemonResponse.data;
              })
            );

            const finalFilteredPokemonDetails = pokemonDetails.filter((pokemon) => {
              const pokemonTypes = pokemon.types.map((type) => type.type.name);
              return selectedTypes.every((type) => pokemonTypes.includes(type));
            });

            setNextPage(null);
            setPokemonList([...finalFilteredPokemonDetails].sort((a, b) => a.id - b.id));
          }
        } else {
          
          apiUrl = `${POKEMON_API_BASE_URL}?limit=${POKEMON_PER_PAGE}&offset=${(pageCount - 1) * POKEMON_PER_PAGE}`;
          const response = await axios.get(apiUrl);
          setNextPage(response.data.next);

          const pokemonDetails = await Promise.all(
            response.data.results.map(async (pokemon) => {
              const pokemonResponse = await axios.get(pokemon.url);
              return pokemonResponse.data;
            })
          );

          setPokemonList((prevList) =>
            pageCount === 1
              ? [...pokemonDetails].sort((a, b) => a.id - b.id)
              : [...new Set([...prevList, ...pokemonDetails])].sort((a, b) => a.id - b.id)
          );
        }
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [pageCount, selectedGeneration, selectedTypes]);

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