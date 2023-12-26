import React, { useState, useEffect } from 'react';
import { Box, Grid, Button } from '@chakra-ui/react';
import PokemonCard from './PokemonCard';
import axios from 'axios';

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_PER_PAGE = 12;

const Homepage = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  const handleLoadMore = async () => {
    setPageCount((prevPageCount) => prevPageCount + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const apiUrl = `${POKEMON_API_BASE_URL}?limit=${POKEMON_PER_PAGE}&offset=${(pageCount - 1) * POKEMON_PER_PAGE}`;
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
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageCount]);

  return (
    <Box
      maxWidth="1200px"
      width="100%"
      bgColor="#ffffff"
      borderRadius="md"
      padding="2rem"
      marginTop="2rem"
      boxShadow="md"
    >
      <Grid templateColumns={`repeat(4, 1fr)`} gap={4} marginBottom="2rem">
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

export default Homepage;