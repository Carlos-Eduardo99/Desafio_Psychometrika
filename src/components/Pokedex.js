import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@chakra-ui/react';
import axios from 'axios';
import PokemonCard from './PokemonCard';

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_PER_PAGE = 12;

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [nextPage, setNextPage] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${POKEMON_API_BASE_URL}?limit=${POKEMON_PER_PAGE}&offset=${(pageCount - 1) * POKEMON_PER_PAGE}`);
        setNextPage(response.data.next);
        const pokemonDetails = await Promise.all(response.data.results.map(async (pokemon) => {
          const pokemonResponse = await axios.get(pokemon.url);
          return pokemonResponse.data;
        }));

        // Se for a primeira carga ou uma carga subsequente, substitua a lista
        setPokemonList((prevList) => (pageCount === 1 ? [...pokemonDetails] : [...new Set([...prevList, ...pokemonDetails])]));
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [pageCount]);

  const handleLoadMore = () => {
    setPageCount((prevPageCount) => prevPageCount + 1);
  };

  return (
    <>
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
    </>
  );
};

export default Pokedex;