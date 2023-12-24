import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Text } from '@chakra-ui/react';
import PokemonCard from './PokemonCard';
import { useNavigate } from 'react-router-dom';

const POKEMON_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_SPECIES_API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon-species';

const Pokedex = ({ selectedGeneration, selectedTypes, searchTrigger }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const applyFilter = async () => {
      try {
        let filteredPokemonList = [];

        // Filtro por geração e tipo
        if (selectedGeneration && selectedTypes.length > 0) {
          const generationResponse = await axios.get(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
          const generationPokemonNames = generationResponse.data.pokemon_species.map(pokemon => pokemon.name);

          const typePromises = selectedTypes.map(async (type) => {
            try {
              const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
              return response.data.pokemon.map((pokemon) => pokemon.pokemon.name);
            } catch (error) {
              console.error('Error fetching Pokemon data:', error);
            }
          });

          const typePokemonNames = await Promise.all(typePromises);
          const commonPokemonNames = typePokemonNames.reduce((a, b) => a.filter(c => b.includes(c)));

          const commonPokemonInGeneration = commonPokemonNames.filter(name => generationPokemonNames.includes(name));

          const pokemonPromises = commonPokemonInGeneration.map(async (name) => {
            try {
              const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            } catch (error) {
              // Ignorar Pokémon não encontrado
              return null;
            }
          });

          filteredPokemonList = await Promise.all(pokemonPromises);
          filteredPokemonList = filteredPokemonList.filter(Boolean); // Remover valores nulos
        } else if (selectedGeneration) {
          // Filtro por geração
          const response = await axios.get(`https://pokeapi.co/api/v2/generation/${selectedGeneration}`);
          const pokemonNamesByGeneration = response.data.pokemon_species.map(pokemon => pokemon.name);

          const pokemonPromises = pokemonNamesByGeneration.map(async (name) => {
            try {
              const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            } catch (error) {
              return null;
            }
          });

          filteredPokemonList = await Promise.all(pokemonPromises);
          filteredPokemonList = filteredPokemonList.filter(Boolean);
        } else if (selectedTypes.length > 0) {
          // Filtro por tipo
          const typePromises = selectedTypes.map(async (type) => {
            try {
              const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
              return response.data.pokemon.map((pokemon) => pokemon.pokemon.name);
            } catch (error) {
              console.error('Error fetching Pokemon data:', error);
            }
          });

          const pokemonNamesByType = await Promise.all(typePromises);
          const commonPokemonNames = pokemonNamesByType.reduce((a, b) => a.filter(c => b.includes(c)));

          const pokemonPromises = commonPokemonNames.map(async (name) => {
            try {
              const pokemonSpeciesResponse = await axios.get(`${POKEMON_SPECIES_API_BASE_URL}/${name}`);
              const pokemonResponse = await axios.get(`${POKEMON_API_BASE_URL}/${pokemonSpeciesResponse.data.id}`);
              return pokemonResponse.data;
            } catch (error) {
              return null;
            }
          });

          filteredPokemonList = await Promise.all(pokemonPromises);
          filteredPokemonList = filteredPokemonList.filter(Boolean);
        }

        setPokemonList(filteredPokemonList.sort((a, b) => a.id - b.id)); // ordena em ordem crescente
      } catch (error) {
        console.error('Error fetching Pokemon data:', error);
      }
    };

    applyFilter();
    // eslint-disable-next-line
  }, [searchTrigger]);

  useEffect(() => {
    if (selectedTypes.length === 0 && !selectedGeneration) {
      // Se nenhum filtro estiver ativado, retorne para a home
      navigate('/');
    }
  }, [selectedTypes, selectedGeneration, navigate]);

  return (
    <Box className="content" p="1rem" bgColor="#fff" width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center">
      {pokemonList.length > 0 ? (
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
      ) : (
        <Text mt={4} fontSize="xl" fontWeight="bold" color="red.500">
          Nenhum Pokémon corresponde à sua pesquisa!
        </Text>
      )}
    </Box>
  );
};

export default Pokedex;